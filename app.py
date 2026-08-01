import os
import secrets
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from time import time
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from blockchain import Blockchain
from smart_contract import TransactionManager, UserAccount, KYCVerificationError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'BACKCHAIN-IN-FINANCE', 'dist')
app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = secrets.token_hex(32)
jwt = JWTManager(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not Found"}), 404
        
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Initialize the blockchain
blockchain = Blockchain()

# Initialize users (in-memory for demo)
users = {
    "0x82AF91EF": UserAccount("Alice_Corp", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=150000.0),
    "0x91AF72BC": UserAccount("Bob_LLC", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=200000.0),
    "0x72BC88EF": UserAccount("Charlie_Anon", is_kyc_verified=False, password_hash=generate_password_hash("password123"), balance=50000.0)
}

# Add a way to map usernames to addresses for login
def get_address_by_username(username):
    for addr, user in users.items():
        if user.username.lower() == username.lower():
            return addr
    return None

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user."""
    values = request.get_json()
    if not values or not all(k in values for k in ('username', 'password')):
        return jsonify({'error': 'Missing username or password'}), 400

    username = values['username']
    password = values['password']

    if get_address_by_username(username):
        return jsonify({'error': 'Username already exists'}), 409

    # Generate a random mock wallet address
    new_address = "0x" + secrets.token_hex(4).upper()
    
    # Store new user (default no KYC for new signups)
    users[new_address] = UserAccount(
        username=username, 
        is_kyc_verified=False, 
        password_hash=generate_password_hash(password)
    )

    return jsonify({
        'message': 'User registered successfully',
        'address': new_address,
        'username': username
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate a user and return a JWT."""
    values = request.get_json()
    if not values or not all(k in values for k in ('username', 'password')):
        return jsonify({'error': 'Missing username or password'}), 400

    username = values['username']
    password = values['password']
    address = get_address_by_username(username)

    if not address or not check_password_hash(users[address].password_hash, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=address)
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'address': address,
            'username': users[address].username,
            'is_kyc_verified': users[address].is_kyc_verified
        }
    }), 200


@app.route('/api/blocks', methods=['GET'])
def get_blocks():
    """Return the entire blockchain."""
    chain_data = []
    for block in blockchain.chain:
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
    """Return available users."""
    users_data = []
    for address, user in users.items():
        users_data.append({
            'address': address,
            'username': user.username,
            'is_kyc_verified': user.is_kyc_verified
        })
    return jsonify(users_data), 200

@app.route('/api/transaction', methods=['POST'])
@jwt_required()
def new_transaction():
    """Process a new transaction. Requires valid JWT."""
    current_user_addr = get_jwt_identity()
    values = request.get_json()

    required = ['receiver', 'amount', 'asset']
    if not all(k in values for k in required):
        return jsonify({'error': 'Missing values'}), 400

    receiver_addr = values['receiver']
    amount = float(values['amount'])
    asset = values.get('asset', 'ETH')

    # Security Check: Force sender to be the authenticated user
    sender_addr = current_user_addr

    if sender_addr not in users or receiver_addr not in users:
        return jsonify({'error': 'Invalid sender or receiver address. User not found.'}), 404

    sender_account = users[sender_addr]
    receiver_account = users[receiver_addr]

    try:
        # Enforce KYC via Smart Contract Protocol
        TransactionManager.process_transaction(sender_account, receiver_account, amount)
        
        # If successful, add transaction to the block
        transaction_data = [{
            "sender": sender_addr,
            "receiver": receiver_addr,
            "amount": amount,
            "asset": asset,
            "time": time()
        }]
        
        blockchain.add_block(transaction_data)
        
        response = {
            'message': f'Transaction will be added to Block {blockchain.get_latest_block().index}',
            'status': 'Success'
        }
        return jsonify(response), 201
        
    except KYCVerificationError as e:
        response = {
            'error': str(e),
            'status': 'Failed'
        }
        return jsonify(response), 403
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'Failed'}), 500

TREASURY_BALANCE = 500000.0

@app.route('/api/proof-of-reserves', methods=['GET'])
@jwt_required()
def proof_of_reserves():
    """Verify bank solvency using Zero-Knowledge conceptually.
    Sums up balances using a list comprehension and compares to Treasury."""
    total_liabilities = sum([user.balance for user in users.values()])
    is_solvent = TREASURY_BALANCE >= total_liabilities
    return jsonify({
        "solvent": is_solvent
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
