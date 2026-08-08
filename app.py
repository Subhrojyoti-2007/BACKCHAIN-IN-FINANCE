import os
import secrets
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from time import time
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from blockchain import Blockchain
from smart_contract import TransactionManager, UserAccount, KYCVerificationError
import db

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'dist')
app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-dev-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
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

    db.save_db(users, blockchain)

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
            'is_kyc_verified': users[address].is_kyc_verified,
            'language': users[address].language,
            'currency': users[address].currency,
            'profile_visibility': users[address].profile_visibility,
            'network': users[address].network,
            'wallet_connection': users[address].wallet_connection,
            'kyc_reference_id': users[address].kyc_reference_id
        }
    }), 200

# Mock stores for KYC
mock_otp_store = {}
otp_rate_limit = {}

@app.route('/api/kyc/send-otp', methods=['POST'])
@jwt_required()
def send_otp():
    """Mock API to send Aadhaar OTP."""
    current_user_addr = get_jwt_identity()
    values = request.get_json()
    
    if not values or 'aadhaar_number' not in values:
        return jsonify({'error': 'Missing aadhaar_number'}), 400
        
    aadhaar = str(values['aadhaar_number']).strip()
    if len(aadhaar) != 12 or not aadhaar.isdigit():
        return jsonify({'error': 'Invalid Aadhaar number format. Must be 12 digits.'}), 400

    # Rate limiting (1 request per 30 seconds)
    current_time = time()
    if current_user_addr in otp_rate_limit:
        if current_time - otp_rate_limit[current_user_addr] < 30:
            return jsonify({'error': 'Too many requests. Please wait 30 seconds.'}), 429
            
    otp_rate_limit[current_user_addr] = current_time

    # Generate random OTP (User asked for random OTP)
    import random
    otp = str(random.randint(100000, 999999))
    
    transaction_id = "txn_" + secrets.token_hex(8)
    
    # Store in mock memory
    mock_otp_store[transaction_id] = {
        'otp': otp,
        'user_addr': current_user_addr,
        'expires': current_time + 300 # 5 minutes expiry
    }
    
    print(f"[MOCK KYC API] Sent OTP {otp} to Aadhaar {aadhaar} for user {current_user_addr}. Txn ID: {transaction_id}")
    
    return jsonify({
        'message': 'OTP sent successfully',
        'transaction_id': transaction_id
    }), 200

@app.route('/api/kyc/verify-otp', methods=['POST'])
@jwt_required()
def verify_otp():
    """Mock API to verify Aadhaar OTP."""
    current_user_addr = get_jwt_identity()
    values = request.get_json()
    
    if not values or 'otp' not in values or 'transaction_id' not in values:
        return jsonify({'error': 'Missing otp or transaction_id'}), 400
        
    otp = str(values['otp']).strip()
    transaction_id = values['transaction_id']
    
    if transaction_id not in mock_otp_store:
        return jsonify({'error': 'Invalid or expired transaction.'}), 400
        
    store_data = mock_otp_store[transaction_id]
    
    if store_data['user_addr'] != current_user_addr:
        return jsonify({'error': 'Unauthorized transaction.'}), 403
        
    if time() > store_data['expires']:
        del mock_otp_store[transaction_id]
        return jsonify({'error': 'OTP expired.'}), 400
        
    if store_data['otp'] != otp:
        return jsonify({'error': 'Invalid OTP.'}), 400
        
    # Success! Update user Profile
    del mock_otp_store[transaction_id]
    
    if current_user_addr in users:
        users[current_user_addr].is_kyc_verified = True
        users[current_user_addr].kyc_reference_id = "kyc_ref_" + secrets.token_hex(12)
        users[current_user_addr].kyc_timestamp = int(time())
        db.save_db(users, blockchain)
        
        return jsonify({
            'message': 'KYC Verification Successful',
            'user': users[current_user_addr].to_dict()
        }), 200
        
    return jsonify({'error': 'User not found.'}), 404


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
    if 'hardware_mfa' in values:
        user.hardware_mfa = values['hardware_mfa']
    if 'passkey_biometrics' in values:
        user.passkey_biometrics = values['passkey_biometrics']
    if 'settlement_alerts' in values:
        user.settlement_alerts = values['settlement_alerts']
    if 'threat_advisories' in values:
        user.threat_advisories = values['threat_advisories']
    if 'yield_updates' in values:
        user.yield_updates = values['yield_updates']
    if 'session_timeout' in values:
        user.session_timeout = values['session_timeout']
    if 'tx_threshold' in values:
        user.tx_threshold = values['tx_threshold']
        
    db.save_db(users, blockchain)
        
    return jsonify({
        'message': 'Settings updated successfully',
        'user': user.to_dict()
    }), 200

@app.route('/api/add-balance', methods=['POST'])
@jwt_required()
def add_balance():
    """Add balance to user wallet (mock functionality)"""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
        
    values = request.get_json()
    amount = float(values.get('amount', 0))
    if amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
        
    users[current_user_addr].balance += amount
    db.save_db(users, blockchain)
    
    return jsonify({
        'message': f'Successfully added {amount}',
        'balance': users[current_user_addr].balance
    }), 200



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
        
        db.save_db(users, blockchain)
        
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
