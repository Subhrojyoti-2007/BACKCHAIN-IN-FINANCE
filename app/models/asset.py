from app.extensions import db

class AssetModel(db.Model):
    __tablename__ = 'assets'
    symbol = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    current_price = db.Column(db.Float, default=0.0)
    
    holdings = db.relationship('HoldingModel', back_populates='asset', cascade='all, delete-orphan')
