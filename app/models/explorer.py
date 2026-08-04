from app.extensions import db

class ExplorerBlockModel(db.Model):
    __tablename__ = 'blocks'
    index = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.Float, nullable=False)
    transactions = db.Column(db.JSON, nullable=False)
    previous_hash = db.Column(db.String, nullable=False)
    hash = db.Column(db.String, nullable=False)
