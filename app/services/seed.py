import time
from werkzeug.security import generate_password_hash
from app.extensions import db
from app.models.user import UserModel
from app.models.wallet import WalletModel, HoldingModel
from app.models.asset import AssetModel
from app.models.settings import SettingsModel
from app.services.blockchain_service import BlockchainService

def seed_database():
    print("Seeding database...")
    
    # Check if users already exist
    if UserModel.query.first():
        print("Database already seeded. Skipping.")
        return

    # Seed Assets
    assets = [
        AssetModel(symbol='BTC', name='Bitcoin', current_price=64200.50),
        AssetModel(symbol='ETH', name='Ethereum', current_price=3450.75),
        AssetModel(symbol='USDC', name='USD Coin', current_price=1.00),
        AssetModel(symbol='AAVE', name='Aave', current_price=95.20),
        AssetModel(symbol='SOL', name='Solana', current_price=145.20)
    ]
    db.session.add_all(assets)
    
    # Seed Users
    users_data = [
        {"addr": "0x82AF91EF", "name": "Alice_Corp", "kyc": True, "bal": 150000.0},
        {"addr": "0x91AF72BC", "name": "Bob_LLC", "kyc": True, "bal": 200000.0},
        {"addr": "0x72BC88EF", "name": "Charlie_Anon", "kyc": False, "bal": 50000.0}
    ]
    
    for u in users_data:
        user = UserModel(
            address=u["addr"], 
            username=u["name"], 
            is_kyc_verified=u["kyc"], 
            password_hash=generate_password_hash("password123")
        )
        db.session.add(user)
        
        settings = SettingsModel(
            user_address=u["addr"],
            language="English",
            currency="USD",
            theme="Dark",
            profile_visibility="Public",
            network="Ethereum Mainnet",
            wallet_connection="Auto Connect ON"
        )
        db.session.add(settings)
        
        wallet = WalletModel(
            address=u["addr"],
            user_address=u["addr"],
            balance=u["bal"],
            network="Ethereum Mainnet"
        )
        db.session.add(wallet)
        
        # Add some random holdings for the dashboard
        if u["name"] == "Alice_Corp":
            # Total value should represent allocation roughly
            h1 = HoldingModel(wallet_address=u["addr"], asset_symbol="BTC", amount=0.5)
            h2 = HoldingModel(wallet_address=u["addr"], asset_symbol="ETH", amount=5.0)
            db.session.add_all([h1, h2])

    # Seed Genesis Block
    BlockchainService.add_block(["Genesis Block"])
    
    db.session.commit()
    print("Database seeded successfully.")
