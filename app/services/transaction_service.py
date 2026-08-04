import uuid
from time import time
from app.extensions import db
from app.models.wallet import WalletModel
from app.models.transaction import TransactionModel
from app.services.blockchain_service import BlockchainService

class KYCVerificationError(Exception):
    pass

class InsufficientFundsError(Exception):
    pass

class TransactionService:
    @staticmethod
    def process_transaction(sender_address, receiver_address, amount, asset="ETH"):
        if amount <= 0:
            raise ValueError("Amount must be positive.")
            
        sender_wallet = WalletModel.query.get(sender_address)
        receiver_wallet = WalletModel.query.get(receiver_address)
        
        if not sender_wallet or not receiver_wallet:
            raise ValueError("Invalid sender or receiver address.")
            
        if not sender_wallet.user.is_kyc_verified:
            raise KYCVerificationError("Sender is not KYC verified.")
            
        if sender_wallet.balance < amount:
            raise InsufficientFundsError("Insufficient funds.")
            
        # Update balances
        sender_wallet.balance -= amount
        receiver_wallet.balance += amount
        
        # Create Transaction record
        tx_hash = "TXN-" + str(uuid.uuid4())[:8].upper()
        timestamp = time()
        
        tx = TransactionModel(
            id=tx_hash,
            sender_address=sender_address,
            receiver_address=receiver_address,
            amount=amount,
            asset=asset,
            status="Completed",
            timestamp=timestamp
        )
        db.session.add(tx)
        
        # Add to Blockchain
        tx_data = [{
            "hash": tx_hash,
            "sender": sender_address,
            "receiver": receiver_address,
            "amount": amount,
            "asset": asset,
            "time": timestamp
        }]
        new_block = BlockchainService.add_block(tx_data)
        
        db.session.commit()
        return tx, new_block
