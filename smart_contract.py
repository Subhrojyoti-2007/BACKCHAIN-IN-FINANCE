class KYCVerificationError(Exception):
    """Exception raised for errors in the KYC verification process."""
    def __init__(self, username, message="User is not KYC verified. Transaction blocked."):
        self.username = username
        self.message = f"{message} (User: {username})"
        super().__init__(self.message)


class FraudDetectionError(Exception):
    """Exception raised when a transaction is blocked due to high fraud risk."""
    def __init__(self, score, reasons, message="Transaction blocked due to high fraud risk."):
        self.score = score
        self.reasons = reasons
        self.message = f"{message} Risk Score: {score}/100. Reasons: {', '.join(reasons)}"
        super().__init__(self.message)


class FraudDetector:
    """Evaluates transaction fraud risk using heuristics and historical data."""
    
    @staticmethod
    def parse_threshold(threshold_str):
        try:
            import re
            num = re.sub(r'[^\d.]', '', threshold_str)
            return float(num) if num else 1000.0
        except Exception:
            return 1000.0

    @staticmethod
    def evaluate_risk(sender_addr, sender_account, receiver_addr, receiver_account, amount, asset, blockchain_chain, audit_logs, users_dict):
        score = 0
        reasons = []
        
        # 1. KYC status check
        if not sender_account.is_kyc_verified:
            score += 40
            reasons.append("Sender KYC is unverified")
        if receiver_account and not receiver_account.is_kyc_verified:
            score += 40
            reasons.append("Receiver KYC is unverified")

        # 2. Unknown/Unregistered receiver check
        if not receiver_account or receiver_addr not in users_dict:
            score += 35
            reasons.append("Unknown or unregistered recipient address")

        # Calculate USD equivalent for checks
        prices = {"ETH": 3350.0, "BTC": 95000.0, "USDC": 1.0, "AAVE": 150.0}
        usd_val = amount * prices.get(asset.upper(), 1.0)

        # 3. Unusually large amount check
        threshold_val = 1000.0
        if hasattr(sender_account, 'tx_threshold') and sender_account.tx_threshold:
            threshold_val = FraudDetector.parse_threshold(sender_account.tx_threshold)
        
        if usd_val > threshold_val:
            score += 25
            reasons.append(f"Amount exceeds user's defined transaction threshold (${threshold_val:,.2f})")
        
        if usd_val > 50000.0:
            score += 45
            reasons.append(f"Unusually large transaction amount (${usd_val:,.2f} USD equivalent)")
        elif usd_val > 10000.0:
            score += 20
            reasons.append(f"Large transaction amount (${usd_val:,.2f} USD equivalent)")

        # 4. Rapid/Multiple transactions (velocity check)
        import time
        now = time.time()
        recent_tx_count = 0
        if blockchain_chain:
            for block in blockchain_chain:
                block_time = block.timestamp
                if now - block_time <= 60:
                    txs = block.transactions
                    if isinstance(txs, list):
                        for tx in txs:
                            if isinstance(tx, dict) and tx.get("sender") == sender_addr:
                                recent_tx_count += 1
        
        if recent_tx_count >= 5:
            score += 55
            reasons.append(f"Extreme transaction velocity ({recent_tx_count} transactions in the last 60s)")
        elif recent_tx_count >= 3:
            score += 30
            reasons.append(f"High transaction velocity ({recent_tx_count} transactions in the last 60s)")

        # 5. Repeated failed attempts check
        recent_failed_attempts = 0
        if audit_logs:
            for entry in audit_logs:
                entry_time = entry.get("timestamp", 0)
                if now - entry_time <= 300: # last 5 minutes
                    if entry.get("user") == sender_account.username and entry.get("status") == "FAILED":
                        recent_failed_attempts += 1
                        
        if recent_failed_attempts >= 5:
            score += 50
            reasons.append(f"Repeated transaction failures ({recent_failed_attempts} failed attempts in the last 5m)")
        elif recent_failed_attempts >= 3:
            score += 25
            reasons.append(f"Multiple transaction failures ({recent_failed_attempts} failed attempts in the last 5m)")

        # Cap score between 0 and 100
        score = max(0, min(100, score))
        
        if score >= 80:
            level = "HIGH"
        elif score >= 40:
            level = "MEDIUM"
        else:
            level = "LOW"
            
        return score, level, reasons


class UserAccount:
    """Represents a user in the system with KYC status and balance."""
    def __init__(self, username, is_kyc_verified=False, password_hash=None, balance=0.0, language="English", currency="USD", profile_visibility="Public", network="Ethereum Mainnet", wallet_connection="Auto Connect ON", kyc_reference_id=None, kyc_timestamp=None, kyc_aadhaar_hash=None, hardware_mfa="Enabled", passkey_biometrics="Enabled", settlement_alerts="ON", threat_advisories="ON", yield_updates="OFF", session_timeout="30 Minutes", tx_threshold="$1,000 Threshold"):
        self.username = username
        self.is_kyc_verified = is_kyc_verified
        self.password_hash = password_hash
        self.balance = balance
        self.language = language
        self.currency = currency
        self.profile_visibility = profile_visibility
        self.network = network
        self.wallet_connection = wallet_connection
        self.kyc_reference_id = kyc_reference_id
        self.kyc_timestamp = kyc_timestamp
        self.kyc_aadhaar_hash = kyc_aadhaar_hash
        self.hardware_mfa = hardware_mfa
        self.passkey_biometrics = passkey_biometrics
        self.settlement_alerts = settlement_alerts
        self.threat_advisories = threat_advisories
        self.yield_updates = yield_updates
        self.session_timeout = session_timeout
        self.tx_threshold = tx_threshold

    def __repr__(self):
        return f"UserAccount(username='{self.username}', kyc={self.is_kyc_verified}, balance={self.balance}, lang={self.language}, curr={self.currency}, vis={self.profile_visibility}, net={self.network}, conn={self.wallet_connection}, kyc_ref={self.kyc_reference_id}, kyc_ts={self.kyc_timestamp}, kyc_aadhaar_hash={self.kyc_aadhaar_hash})"

    def to_dict(self):
        return {
            "username": self.username,
            "is_kyc_verified": self.is_kyc_verified,
            "password_hash": self.password_hash,
            "balance": self.balance,
            "language": self.language,
            "currency": self.currency,
            "profile_visibility": self.profile_visibility,
            "network": self.network,
            "wallet_connection": self.wallet_connection,
            "kyc_reference_id": self.kyc_reference_id,
            "kyc_timestamp": self.kyc_timestamp,
            "kyc_aadhaar_hash": self.kyc_aadhaar_hash,
            "hardware_mfa": self.hardware_mfa,
            "passkey_biometrics": self.passkey_biometrics,
            "settlement_alerts": self.settlement_alerts,
            "threat_advisories": self.threat_advisories,
            "yield_updates": self.yield_updates,
            "session_timeout": self.session_timeout,
            "tx_threshold": self.tx_threshold
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            username=data.get("username"),
            is_kyc_verified=data.get("is_kyc_verified", False),
            password_hash=data.get("password_hash"),
            balance=data.get("balance", 0.0),
            language=data.get("language", "English"),
            currency=data.get("currency", "USD"),
            profile_visibility=data.get("profile_visibility", "Public"),
            network=data.get("network", "Ethereum Mainnet"),
            wallet_connection=data.get("wallet_connection", "Auto Connect ON"),
            kyc_reference_id=data.get("kyc_reference_id"),
            kyc_timestamp=data.get("kyc_timestamp"),
            kyc_aadhaar_hash=data.get("kyc_aadhaar_hash"),
            hardware_mfa=data.get("hardware_mfa", "Enabled"),
            passkey_biometrics=data.get("passkey_biometrics", "Enabled"),
            settlement_alerts=data.get("settlement_alerts", "ON"),
            threat_advisories=data.get("threat_advisories", "ON"),
            yield_updates=data.get("yield_updates", "OFF"),
            session_timeout=data.get("session_timeout", "30 Minutes"),
            tx_threshold=data.get("tx_threshold", "$1,000 Threshold")
        )


class IdentityRegistry:
    """Simulates the ERC-3643 Identity Registry smart contract."""
    
    @staticmethod
    def whitelist_address(wallet_address: str):
        """
        Triggers a simulated blockchain transaction to whitelist the wallet address.
        """
        print(f"\n[Smart Contract] whitelisting address in IdentityRegistry: {wallet_address}")
        # In a real environment: identityRegistry.registerIdentity(wallet_address, identityURI, kycStatus)
        return True
class TransactionManager:
    """Acts as the smart contract protocol enforcing rules like ERC-3643."""
    
    @staticmethod
    def process_transaction(sender: UserAccount, receiver: UserAccount, amount: float, sender_addr=None, receiver_addr=None, asset="ETH", blockchain=None, audit_logs=None, users=None):
        """
        Processes a transaction, automatically enforcing KYC compliance and fraud risk thresholds.
        """
        print(f"Attempting to process transaction: {sender.username} -> {receiver.username if receiver else 'Unknown'} (Amount: {amount})")
        
        # Enforce Fraud risk rules if blockchain details are present
        if blockchain is not None and users is not None:
            score, risk_level, reasons = FraudDetector.evaluate_risk(
                sender_addr=sender_addr,
                sender_account=sender,
                receiver_addr=receiver_addr,
                receiver_account=receiver,
                amount=amount,
                asset=asset,
                blockchain_chain=blockchain.chain,
                audit_logs=audit_logs,
                users_dict=users
            )
            if risk_level == "HIGH":
                raise FraudDetectionError(score, reasons)

        # Enforce KYC rules for Sender
        if not sender.is_kyc_verified:
            raise KYCVerificationError(sender.username, "Sender is not KYC verified.")
            
        # Enforce KYC rules for Receiver
        if receiver is None:
            raise Exception("Receiver account not found in system.")
            
        if not receiver.is_kyc_verified:
            raise KYCVerificationError(receiver.username, "Receiver is not KYC verified.")
            
        print("KYC verification passed for both parties.")
        
        if sender.balance < amount:
            raise ValueError("Insufficient treasury balance to complete the transaction.")
            
        sender.balance -= amount
        receiver.balance += amount
        
        # Proceed with the trade
        print(f"Transaction successful: {amount} transferred from {sender.username} to {receiver.username}")
        return True


# Example Usage & Testing
if __name__ == "__main__":
    # Create test accounts
    alice = UserAccount("Alice_Corp", is_kyc_verified=True)
    bob = UserAccount("Bob_LLC", is_kyc_verified=True)
    charlie = UserAccount("Charlie_Anon", is_kyc_verified=False)
    
    print("--- Scenario 1: Both users are KYC verified ---")
    try:
        TransactionManager.process_transaction(alice, bob, 5000.0)
    except KYCVerificationError as e:
        print(f"Error: {e}")
        
    print("\n--- Scenario 2: Sender is NOT KYC verified ---")
    try:
        TransactionManager.process_transaction(charlie, bob, 150.0)
    except KYCVerificationError as e:
        print(f"Blocked Trade - Security Exception Caught: {e}")
        
    print("\n--- Scenario 3: Receiver is NOT KYC verified ---")
    try:
        TransactionManager.process_transaction(alice, charlie, 700.0)
    except KYCVerificationError as e:
        print(f"Blocked Trade - Security Exception Caught: {e}")
