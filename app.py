import os
import json
import secrets
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from time import time
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

from blockchain import Blockchain
from smart_contract import TransactionManager, UserAccount, KYCVerificationError
import db

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'dist')
app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = "super-secret-dev-key"
jwt = JWTManager(app)

# Configure SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'blockchain.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Models
class UserModel(db.Model):
    __tablename__ = 'users'
    address = db.Column(db.String, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    is_kyc_verified = db.Column(db.Boolean, default=False)
    password_hash = db.Column(db.String, nullable=False)
    balance = db.Column(db.Float, default=0.0)

class BlockModel(db.Model):
    __tablename__ = 'blocks'
    index = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.Float, nullable=False)
    transactions = db.Column(db.JSON, nullable=False)
    previous_hash = db.Column(db.String, nullable=False)
    hash = db.Column(db.String, nullable=False)

def add_block_to_db(transactions):
    latest_block = BlockModel.query.order_by(BlockModel.index.desc()).first()
    new_index = latest_block.index + 1
    new_timestamp = time()
    previous_hash = latest_block.hash
    
    block_string = json.dumps({
        "index": new_index,
        "timestamp": new_timestamp,
        "transactions": transactions,
        "previous_hash": previous_hash
    }, sort_keys=True).encode()
    import hashlib
    new_hash = hashlib.sha256(block_string).hexdigest()
    
    new_block = BlockModel(
        index=new_index,
        timestamp=new_timestamp,
        transactions=transactions,
        previous_hash=previous_hash,
        hash=new_hash
    )
    db.session.add(new_block)
    db.session.commit()
    return new_block

with app.app_context():
    db.create_all()
    if not UserModel.query.first():
        alice = UserModel(address="0x82AF91EF", username="Alice_Corp", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=150000.0)
        bob = UserModel(address="0x91AF72BC", username="Bob_LLC", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=200000.0)
        charlie = UserModel(address="0x72BC88EF", username="Charlie_Anon", is_kyc_verified=False, password_hash=generate_password_hash("password123"), balance=50000.0)
        db.session.add_all([alice, bob, charlie])
        
    if not BlockModel.query.first():
        genesis_string = json.dumps({
            "index": 0,
            "timestamp": time(),
            "transactions": ["Genesis Block"],
            "previous_hash": "0"
        }, sort_keys=True).encode()
        import hashlib
        genesis_hash = hashlib.sha256(genesis_string).hexdigest()
        genesis = BlockModel(index=0, timestamp=time(), transactions=["Genesis Block"], previous_hash="0", hash=genesis_hash)
        db.session.add(genesis)
        
    db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not Found"}), 404
        
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Load state from database
loaded_users, loaded_chain = db.load_db()

if loaded_users is not None and loaded_chain is not None:
    users = loaded_users
    blockchain = loaded_chain
else:
    # Initialize the blockchain
    blockchain = Blockchain()

    # Initialize users (in-memory for demo)
    users = {
        "0x82AF91EF": UserAccount("Alice_Corp", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=150000.0),
        "0x91AF72BC": UserAccount("Bob_LLC", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=200000.0),
        "0x72BC88EF": UserAccount("Charlie_Anon", is_kyc_verified=False, password_hash=generate_password_hash("password123"), balance=50000.0)
    }
    db.save_db(users, blockchain)

# Add a way to map usernames to addresses for login
def get_address_by_username(username):
    user = UserModel.query.filter(db.func.lower(UserModel.username) == username.lower()).first()
    if user:
        return user.address
    return None

@app.route('/api/register', methods=['POST'])
def register():
    values = request.get_json()
    if not values or not all(k in values for k in ('username', 'password')):
        return jsonify({'error': 'Missing username or password'}), 400

    username = values['username']
    password = values['password']

    if get_address_by_username(username):
        return jsonify({'error': 'Username already exists'}), 409

    new_address = "0x" + secrets.token_hex(4).upper()
    
    new_user = UserModel(
        address=new_address,
        username=username, 
        is_kyc_verified=False, 
        password_hash=generate_password_hash(password),
        balance=0.0
    )

    db.save_db(users, blockchain)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'User registered successfully',
        'address': new_address,
        'username': username
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    values = request.get_json()
    if not values or not all(k in values for k in ('username', 'password')):
        return jsonify({'error': 'Missing username or password'}), 400

    username = values['username']
    password = values['password']
    address = get_address_by_username(username)

    if not address:
        return jsonify({'error': 'Invalid username or password'}), 401
        
    user = UserModel.query.get(address)
    if not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=address)
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'address': address,
            'username': user.username,
            'is_kyc_verified': user.is_kyc_verified,
            'language': users[address].language,
            'currency': users[address].currency,
            'profile_visibility': users[address].profile_visibility,
            'network': users[address].network,
            'wallet_connection': users[address].wallet_connection
        }
    }), 200

@app.route('/api/blocks', methods=['GET'])
def get_blocks():
    blocks = BlockModel.query.order_by(BlockModel.index.asc()).all()
    chain_data = []
    for block in blocks:
        chain_data.append({
            'index': block.index,
            'timestamp': block.timestamp,
            'transactions': block.transactions,
            'previous_hash': block.previous_hash,
            'hash': block.hash
        })
    return jsonify({
        'length': len(chain_data),
        'chain': chain_data
    }), 200

@app.route('/api/users', methods=['GET'])
def get_users():
    users = UserModel.query.all()
    users_data = []
    for user in users:
        users_data.append({
            'address': user.address,
            'username': user.username,
            'is_kyc_verified': user.is_kyc_verified
        })
    return jsonify(users_data), 200

@app.route('/api/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update user settings like language, currency, and visibility."""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
        
    values = request.get_json()
    user = users[current_user_addr]
    
    if 'language' in values:
        user.language = values['language']
    if 'currency' in values:
        user.currency = values['currency']
    if 'profile_visibility' in values:
        user.profile_visibility = values['profile_visibility']
    if 'network' in values:
        user.network = values['network']
    if 'wallet_connection' in values:
        user.wallet_connection = values['wallet_connection']
        
    db.save_db(users, blockchain)
        
    return jsonify({
        'message': 'Settings updated successfully',
        'user': {
            'address': current_user_addr,
            'username': user.username,
            'is_kyc_verified': user.is_kyc_verified,
            'language': user.language,
            'currency': user.currency,
            'profile_visibility': user.profile_visibility,
            'network': user.network,
            'wallet_connection': user.wallet_connection
        }
    }), 200


@app.route('/api/transaction', methods=['POST'])
@jwt_required()
def new_transaction():
    current_user_addr = get_jwt_identity()
    values = request.get_json()

    required = ['receiver', 'amount', 'asset']
    if not all(k in values for k in required):
        return jsonify({'error': 'Missing values'}), 400

    receiver_addr = values['receiver']
    amount = float(values['amount'])
    asset = values.get('asset', 'ETH')
    sender_addr = current_user_addr

    sender_account = UserModel.query.get(sender_addr)
    receiver_account = UserModel.query.get(receiver_addr)

    if not sender_account or not receiver_account:
        return jsonify({'error': 'Invalid sender or receiver address. User not found.'}), 404

    try:
        TransactionManager.process_transaction(sender_account, receiver_account, amount)
        
        transaction_data = [{
            "sender": sender_addr,
            "receiver": receiver_addr,
            "amount": amount,
            "asset": asset,
            "time": time()
        }]
        
        new_block = add_block_to_db(transaction_data)
        
        db.save_db(users, blockchain)
        db.session.commit()
        
        response = {
            'message': f'Transaction will be added to Block {new_block.index}',
            'status': 'Success'
        }
        return jsonify(response), 201
        
    except KYCVerificationError as e:
        db.session.rollback()
        response = {
            'error': str(e),
            'status': 'Failed'
        }
        return jsonify(response), 403
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'status': 'Failed'}), 500

TREASURY_BALANCE = 500000.0

@app.route('/api/proof-of-reserves', methods=['GET'])
@jwt_required()
def proof_of_reserves():
    users = UserModel.query.all()
    total_liabilities = sum([user.balance for user in users])
    is_solvent = TREASURY_BALANCE >= total_liabilities
    return jsonify({
        "solvent": is_solvent
    }), 200

@app.route('/api/audit-trail', methods=['GET'])
def get_audit_trail():
    """Alias for /api/blocks to serve the admin dashboard."""
    return get_blocks()

@app.route('/api/accounts', methods=['GET'])
def get_accounts_api():
    """Alias for /api/users to serve the admin dashboard with balances."""
    accounts_data = []
    for address, user in users.items():
        accounts_data.append({
            'address': address,
            'username': user.username,
            'balance': user.balance,
            'is_kyc_verified': user.is_kyc_verified,
            'network': user.network
        })
    return jsonify(accounts_data), 200

@app.route('/api/amm-ticker', methods=['GET'])
def get_amm_ticker():
    """Return live Automated Market Maker data."""
    import random
    return jsonify({
        "status": "Operational",
        "btc_price": round(64200.50 + random.uniform(-100, 100), 2),
        "eth_price": round(3450.75 + random.uniform(-10, 10), 2),
        "sol_price": round(145.20 + random.uniform(-2, 2), 2),
        "active_pools": 14,
        "volume_24h": "1.2B"
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
