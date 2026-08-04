from app.extensions import db
from time import time

class SecurityEventModel(db.Model):
    __tablename__ = 'security_events'
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String, db.ForeignKey('users.address'), nullable=False)
    event_type = db.Column(db.String, nullable=False) # e.g. 'Login', 'Failed Login', 'Password Change'
    risk_level = db.Column(db.String, default='Low')
    ip_address = db.Column(db.String, nullable=True)
    timestamp = db.Column(db.Float, default=time)
    
    user = db.relationship('UserModel', back_populates='security_events')
