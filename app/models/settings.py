from app.extensions import db

class SettingsModel(db.Model):
    __tablename__ = 'settings'
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String, db.ForeignKey('users.address'), unique=True, nullable=False)
    
    language = db.Column(db.String, default="English")
    currency = db.Column(db.String, default="USD")
    theme = db.Column(db.String, default="Dark")
    profile_visibility = db.Column(db.String, default="Public")
    network = db.Column(db.String, default="Ethereum Mainnet")
    wallet_connection = db.Column(db.String, default="Auto Connect ON")
    notifications_enabled = db.Column(db.Boolean, default=True)

    user = db.relationship('UserModel', back_populates='settings')
