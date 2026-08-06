import os
import secrets
import uuid
import hashlib
from collections import defaultdict
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from time import time
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from blockchain import Blockchain
from smart_contract import TransactionManager, UserAccount, KYCVerificationError, IdentityRegistry
import db

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'dist')
app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = "super-secret-dev-key"
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
            'wallet_connection': users[address].wallet_connection
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


# Rate limiting storage: { user_address: [timestamp1, timestamp2, ...] }
otp_rate_limits = defaultdict(list)

# Mock third-party KYC provider session storage
# transaction_id -> { "otp": str, "aadhaar_hash": str, "timestamp": float }
pending_kyc_transactions = {}

class MockKYCApiProvider:
    """
    Simulates a licensed third-party KYC API provider (Setu/Sandbox/Karza) that handles UIDAI communication.
    """
    @staticmethod
    def send_otp(aadhaar_number: str):
        # Generate standard UUID for transaction
        transaction_id = "tx_" + str(uuid.uuid4())[:18]
        
        # Generate random 6-digit OTP
        import random
        otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Log to the terminal/console for testing
        print(f"\n==================================================")
        print(f"[KYC API Provider] Sending OTP for Aadhaar: XXXX-XXXX-{aadhaar_number[-4:]}")
        print(f"[KYC API Provider] Generated OTP: {otp}")
        print(f"[KYC API Provider] Transaction ID: {transaction_id}")
        print(f"==================================================\n")
        
        # Secure Hash of Aadhaar (privacy requirement)
        aadhaar_hash = hashlib.sha256(aadhaar_number.encode()).hexdigest()
        
        pending_kyc_transactions[transaction_id] = {
            "otp": otp,
            "aadhaar_hash": aadhaar_hash,
            "timestamp": time()
        }
        
        return transaction_id

    @staticmethod
    def verify_otp(transaction_id: str, otp: str):
        if transaction_id not in pending_kyc_transactions:
            return False, "Invalid or expired transaction ID."
            
        tx_data = pending_kyc_transactions[transaction_id]
        
        # Allow either the generated OTP or standard debug OTP '123456'
        if otp == tx_data["otp"] or otp == "123456":
            # Generate a mock verification reference ID
            reference_id = "ref_" + secrets.token_hex(8)
            aadhaar_hash = tx_data["aadhaar_hash"]
            # Clear pending transaction
            pending_kyc_transactions.pop(transaction_id)
            return True, {
                "reference_id": reference_id,
                "aadhaar_hash": aadhaar_hash
            }
        else:
            return False, "Incorrect OTP. Please check and try again."


@app.route('/api/kyc/send-otp', methods=['POST'])
@jwt_required()
def kyc_send_otp():
    """Accepts Aadhaar number and sends simulated OTP."""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
        
    # Rate Limiting: 3 OTP requests per 60 seconds
    now = time()
    user_requests = otp_rate_limits[current_user_addr]
    # Filter requests older than 60 seconds
    user_requests = [t for t in user_requests if now - t < 60]
    if len(user_requests) >= 3:
        return jsonify({'error': 'Too many OTP requests. Please wait 1 minute.'}), 429
    user_requests.append(now)
    otp_rate_limits[current_user_addr] = user_requests

    values = request.get_json()
    if not values or 'aadhaar' not in values:
        return jsonify({'error': 'Missing Aadhaar number'}), 400

    aadhaar = str(values['aadhaar']).strip()
    # Validate Aadhaar: 12-digit numeric
    if not aadhaar.isdigit() or len(aadhaar) != 12:
        return jsonify({'error': 'Aadhaar must be a 12-digit numeric value'}), 400

    try:
        transaction_id = MockKYCApiProvider.send_otp(aadhaar)
        return jsonify({
            'message': 'OTP sent successfully to Aadhaar-linked mobile number.',
            'transaction_id': transaction_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/kyc/verify-otp', methods=['POST'])
@jwt_required()
def kyc_verify_otp():
    """Accepts OTP and transaction_id, validates them, whitelists, and updates state."""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404

    values = request.get_json()
    if not values or not all(k in values for k in ('otp', 'transaction_id')):
        return jsonify({'error': 'Missing OTP or Transaction ID'}), 400

    otp = str(values['otp']).strip()
    transaction_id = str(values['transaction_id']).strip()

    # Validate OTP format: 6-digit numeric
    if not otp.isdigit() or len(otp) != 6:
        return jsonify({'error': 'OTP must be a 6-digit numeric value'}), 400

    try:
        success, result = MockKYCApiProvider.verify_otp(transaction_id, otp)
        if not success:
            return jsonify({'error': result}), 400

        # Successful validation
        user = users[current_user_addr]
        
        # 1. Update database record with reference metadata
        user.is_kyc_verified = True
        user.kyc_reference_id = result['reference_id']
        user.kyc_timestamp = time()
        user.kyc_aadhaar_hash = result['aadhaar_hash']
        
        # 2. Trigger simulated blockchain transaction to whitelist wallet address in IdentityRegistry
        IdentityRegistry.whitelist_address(current_user_addr)
        
        db.save_db(users, blockchain)

        # 3. Generate updated JWT Token reflecting the new KYC status
        new_access_token = create_access_token(identity=current_user_addr)

        return jsonify({
            'message': 'Identity verification completed successfully.',
            'access_token': new_access_token,
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
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
