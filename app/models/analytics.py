from app.extensions import db
from time import time

class ActivityLogModel(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_address = db.Column(db.String, db.ForeignKey('users.address'), nullable=False)
    action = db.Column(db.String, nullable=False) # e.g. 'Viewed Dashboard', 'Downloaded Report'
    timestamp = db.Column(db.Float, default=time)
    
    user = db.relationship('UserModel', back_populates='activity_logs')
