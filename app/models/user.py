from app.extensions import db

class UserModel(db.Model):
    __tablename__ = 'users'
    address = db.Column(db.String, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    is_kyc_verified = db.Column(db.Boolean, default=False)
    password_hash = db.Column(db.String, nullable=False)
    
    # Relationships
    settings = db.relationship('SettingsModel', back_populates='user', uselist=False, cascade='all, delete-orphan')
    wallets = db.relationship('WalletModel', back_populates='user', cascade='all, delete-orphan')
    notifications = db.relationship('NotificationModel', back_populates='user', cascade='all, delete-orphan')
    security_events = db.relationship('SecurityEventModel', back_populates='user', cascade='all, delete-orphan')
    activity_logs = db.relationship('ActivityLogModel', back_populates='user', cascade='all, delete-orphan')
