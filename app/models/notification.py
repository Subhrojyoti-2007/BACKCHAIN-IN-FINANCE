from app.extensions import db
from time import time

class NotificationModel(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String, db.ForeignKey('users.address'), nullable=False)
    type = db.Column(db.String, nullable=False) # e.g. 'security', 'payment', 'system'
    message = db.Column(db.String, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.Float, default=time)
    
    user = db.relationship('UserModel', back_populates='notifications')
