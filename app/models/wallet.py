from app.extensions import db

class WalletModel(db.Model):
    __tablename__ = 'wallets'
    address = db.Column(db.String, primary_key=True)
    user_address = db.Column(db.String, db.ForeignKey('users.address'), nullable=False)
    network = db.Column(db.String, default='Ethereum Mainnet')
    
    # We maintain total balance directly for quick dashboard access, 
    # but the detailed allocation is in holdings.
    balance = db.Column(db.Float, default=0.0) 
    
    user = db.relationship('UserModel', back_populates='wallets')
    holdings = db.relationship('HoldingModel', back_populates='wallet', cascade='all, delete-orphan')

class HoldingModel(db.Model):
    __tablename__ = 'holdings'
    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String, db.ForeignKey('wallets.address'), nullable=False)
    asset_symbol = db.Column(db.String, db.ForeignKey('assets.symbol'), nullable=False)
    amount = db.Column(db.Float, default=0.0)
    
    wallet = db.relationship('WalletModel', back_populates='holdings')
    asset = db.relationship('AssetModel', back_populates='holdings')
