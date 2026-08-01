class KYCVerificationError(Exception):
    """Exception raised for errors in the KYC verification process."""
    def __init__(self, username, message="User is not KYC verified. Transaction blocked."):
        self.username = username
        self.message = f"{message} (User: {username})"
        super().__init__(self.message)


class UserAccount:
    """Represents a user in the system with KYC status and balance."""
    def __init__(self, username, is_kyc_verified=False, password_hash=None, balance=0.0):
        self.username = username
        self.is_kyc_verified = is_kyc_verified
        self.password_hash = password_hash
        self.balance = balance

    def __repr__(self):
        return f"UserAccount(username='{self.username}', kyc={self.is_kyc_verified}, balance={self.balance})"


class TransactionManager:
    """Acts as the smart contract protocol enforcing rules like ERC-3643."""
    
    @staticmethod
    def process_transaction(sender: UserAccount, receiver: UserAccount, amount: float):
        """
        Processes a transaction, automatically enforcing KYC compliance.
        """
        print(f"Attempting to process transaction: {sender.username} -> {receiver.username} (Amount: {amount})")
        
        # Enforce KYC rules for Sender
        if not sender.is_kyc_verified:
            raise KYCVerificationError(sender.username, "Sender is not KYC verified.")
            
        # Enforce KYC rules for Receiver
        if not receiver.is_kyc_verified:
            raise KYCVerificationError(receiver.username, "Receiver is not KYC verified.")
            
        print("KYC verification passed for both parties.")
        
        # Proceed with the trade (simulated)
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
