import json
import os
from blockchain import Blockchain
from smart_contract import UserAccount

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.json")
TEMP_DB_PATH = os.path.join(BASE_DIR, "temp_db.json")

def load_db():
    """
    Loads the structured document DB. 
    Returns (users_dict, blockchain_object).
    Returns (None, None) if the DB doesn't exist.
    """
    if not os.path.exists(DB_PATH):
        return None, None
        
    with open(DB_PATH, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            return None, None
            
    # Deserialize users
    users_data = data.get("users", {})
    users = {}
    for address, u_data in users_data.items():
        users[address] = UserAccount.from_dict(u_data)
        
    # Deserialize blockchain
    blockchain_data = data.get("blockchain", {})
    if blockchain_data:
        blockchain = Blockchain.from_dict(blockchain_data)
    else:
        blockchain = Blockchain()
        
    return users, blockchain

def save_db(users, blockchain):
    """
    Performs an Atomic Commit to save the document DB.
    """
    # Serialize users
    users_data = {addr: user.to_dict() for addr, user in users.items()}
    
    # Serialize blockchain
    blockchain_data = blockchain.to_dict()
    
    # Relational Schema Design
    data = {
        "users": users_data,
        "blockchain": blockchain_data
    }
    
    # 1. Save to a temporary file
    with open(TEMP_DB_PATH, "w") as f:
        json.dump(data, f, indent=4)
        
    # 2. Verify the temporary file was written and is not empty
    if os.path.exists(TEMP_DB_PATH) and os.path.getsize(TEMP_DB_PATH) > 0:
        # 3. Swap safely using atomic os.replace
        os.replace(TEMP_DB_PATH, DB_PATH)
    else:
        raise Exception("Database write failed. Temp file is empty or missing.")
