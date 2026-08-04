from app.extensions import db

class TransactionModel(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.String, primary_key=True) # tx_hash
    sender_address = db.Column(db.String, nullable=False)
    receiver_address = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    asset = db.Column(db.String, default='ETH')
    status = db.Column(db.String, default='Pending')
    timestamp = db.Column(db.Float, nullable=False)
