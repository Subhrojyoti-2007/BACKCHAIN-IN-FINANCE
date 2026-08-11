import os
import certifi
from pymongo import MongoClient
from blockchain import Blockchain
from smart_contract import UserAccount
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["blockchain_finance"]

def load_db():
    """
    Loads the database from MongoDB.
    Returns (users_dict, blockchain_object, audit_logs_list).
    Returns (None, None, None) if the DB collections are empty (on first run).
    """
    try:
        # Check if database has any users
        if db.users.count_documents({}) == 0 and db.blockchain.count_documents({}) == 0:
            return None, None, None
            
        # Deserialize users
        users = {}
        for u_data in db.users.find():
            address = u_data.pop("_id") # MongoDB uses _id as primary key
            users[address] = UserAccount.from_dict(u_data)
            
        # Deserialize blockchain
        blockchain_data = db.blockchain.find_one({"_id": "main_chain"})
        if blockchain_data:
            blockchain = Blockchain.from_dict(blockchain_data)
        else:
            blockchain = Blockchain()

        # Deserialize audit logs
        audit_logs = list(db.audit_logs.find({}, {"_id": 0}))
            
        return users, blockchain, audit_logs
    except Exception as e:
        print(f"MongoDB Load Error: {e}")
        return None, None, None

def save_db(users, blockchain, audit_logs=None):
    """
    Saves the application state to MongoDB.
    """
    try:
        # Save users
        for addr, user in users.items():
            user_dict = user.to_dict()
            db.users.replace_one({"_id": addr}, user_dict, upsert=True)
            
        # Save blockchain
        blockchain_data = blockchain.to_dict()
        db.blockchain.replace_one({"_id": "main_chain"}, blockchain_data, upsert=True)
        
        # Save audit logs
        if audit_logs is not None and len(audit_logs) > 0:
            # Drop existing logs and insert new ones to match the previous JSON array behavior
            # (In a production app, you would only insert the *new* logs)
            db.audit_logs.delete_many({})
            db.audit_logs.insert_many(audit_logs)
            
    except Exception as e:
        print(f"MongoDB Save Error: {e}")
        raise Exception(f"Database write failed: {e}")

