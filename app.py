import os
import requests
from dotenv import load_dotenv
load_dotenv()
from datetime import timedelta
import secrets
import uuid
import hashlib
import hmac
import razorpay
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
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-dev-key")

# Configure Razorpay
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_dummykey123")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_dummysecret456")
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    razorpay_client = None
    print(f"Failed to initialize Razorpay: {e}")
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
loaded_data = db.load_db()

if loaded_data and loaded_data[0] is not None:
    users, blockchain, audit_logs = loaded_data
else:
    # Initialize the blockchain
    blockchain = Blockchain()
    audit_logs = []

    # Initialize users (in-memory for demo)
    users = {
        "0x82AF91EF": UserAccount("Alice_Corp", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=150000.0),
        "0x91AF72BC": UserAccount("Bob_LLC", is_kyc_verified=True, password_hash=generate_password_hash("password123"), balance=200000.0),
        "0x72BC88EF": UserAccount("Charlie_Anon", is_kyc_verified=False, password_hash=generate_password_hash("password123"), balance=50000.0)
    }
    db.save_db(users, blockchain, audit_logs)

def log_audit_event(user, action, details, status, ip_address=None):
    """
    Log an event into audit_logs and save database.
    """
    from flask import has_request_context, request
    if not ip_address:
        if has_request_context():
            ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
            if ip_address and "," in ip_address:
                ip_address = ip_address.split(",")[0].strip()
        else:
            ip_address = "127.0.0.1"

    log_entry = {
        "id": "log_" + secrets.token_hex(8),
        "timestamp": time(),
        "user": user,
        "action": action,
        "details": details,
        "status": status,
        "ip_address": ip_address
    }
    audit_logs.append(log_entry)
    try:
        db.save_db(users, blockchain, audit_logs)
    except Exception as e:
        print(f"Error saving database inside log_audit_event: {e}")

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
        log_audit_event("Anonymous", "REGISTER", "Registration failed: missing username or password", "FAILED")
        return jsonify({'error': 'Missing username or password'}), 400

    username = values['username']
    password = values['password']

    if get_address_by_username(username):
        log_audit_event(username, "REGISTER", f"Registration failed: username '{username}' already exists", "FAILED")
        return jsonify({'error': 'Username already exists'}), 409

    # Generate a random mock wallet address
    new_address = "0x" + secrets.token_hex(4).upper()
    
    # Store new user (default no KYC for new signups)
    users[new_address] = UserAccount(
        username=username, 
        is_kyc_verified=False, 
        password_hash=generate_password_hash(password)
    )

    log_audit_event(username, "REGISTER", f"User registered successfully with wallet address {new_address}", "SUCCESS")

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
        log_audit_event("Anonymous", "FAILED_LOGIN", "Login failed: missing username or password", "FAILED")
        return jsonify({'error': 'Missing username or password'}), 400

    username = values['username']
    password = values['password']
    address = get_address_by_username(username)

    if not address or not check_password_hash(users[address].password_hash, password):
        log_audit_event(username if username else "Anonymous", "FAILED_LOGIN", f"Invalid credentials for user '{username}'", "FAILED")
        return jsonify({'error': 'Invalid username or password'}), 401

    timeout_str = users[address].session_timeout
    if timeout_str == "15 Minutes":
        expires_delta = timedelta(minutes=15)
    elif timeout_str == "30 Minutes":
        expires_delta = timedelta(minutes=30)
    elif timeout_str == "1 Hour":
        expires_delta = timedelta(hours=1)
    elif timeout_str == "4 Hours":
        expires_delta = timedelta(hours=4)
    else:
        expires_delta = False

    access_token = create_access_token(identity=address, expires_delta=expires_delta)
    
    log_audit_event(users[address].username, "LOGIN", f"User '{users[address].username}' logged in successfully", "SUCCESS")
    
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

<<<<<<< HEAD
=======
@app.route('/api/logout', methods=['POST'])
@jwt_required(optional=True)
def logout_api():
    """Log out the current user and log the action."""
    current_user_addr = get_jwt_identity()
    if current_user_addr and current_user_addr in users:
        username = users[current_user_addr].username
        log_audit_event(username, "LOGOUT", f"User '{username}' logged out successfully", "SUCCESS")
    else:
        log_audit_event("Anonymous", "LOGOUT", "Logout called without valid session", "SUCCESS")
    return jsonify({'message': 'Logged out successfully'}), 200



>>>>>>> 0a4a6735e4cbd8eac5287fbdc9f4ced6d34bec0d

@app.route('/api/blocks', methods=['GET'])
def get_blocks():
    """Return the entire blockchain."""
    chain_data = []
    for block in blockchain.chain:
        # Mask transactions based on privacy settings
        masked_txs = []
        for tx in block.transactions:
            if isinstance(tx, str):
                masked_txs.append(tx)
                continue
                
            sender_mask = users.get(tx['sender'])
            receiver_mask = users.get(tx['receiver'])
            
            masked_tx = dict(tx)
            if sender_mask and sender_mask.profile_visibility == "Private":
                masked_tx['sender'] = "Private Wallet"
            if receiver_mask and receiver_mask.profile_visibility == "Private":
                masked_tx['receiver'] = "Private Wallet"
                
            masked_txs.append(masked_tx)
            
        chain_data.append({
            'index': block.index,
            'timestamp': block.timestamp,
            'transactions': masked_txs,
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
        log_audit_event("Anonymous", "SETTINGS_UPDATE", "Failed to update settings: user not found", "FAILED")
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
        
    details = f"Updated settings: {', '.join(values.keys())}" if values else "No settings changes requested"
    log_audit_event(user.username, "SETTINGS_UPDATE", details, "SUCCESS")
        
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
        log_audit_event("Anonymous", "ADD_BALANCE", "Deposit failed: user not found", "FAILED")
        return jsonify({'error': 'User not found'}), 404
        
    values = request.get_json()
    amount = float(values.get('amount', 0))
    if amount <= 0:
        log_audit_event(users[current_user_addr].username, "ADD_BALANCE", f"Deposit failed: invalid amount {amount}", "FAILED")
        return jsonify({'error': 'Invalid amount'}), 400
        
    users[current_user_addr].balance += amount
    log_audit_event(users[current_user_addr].username, "ADD_BALANCE", f"Successfully deposited {amount} USD to wallet balance", "SUCCESS")
    
    return jsonify({
        'message': f'Successfully added {amount}',
        'balance': users[current_user_addr].balance
    }), 200


@app.route('/api/create-razorpay-order', methods=['POST'])
@jwt_required()
def create_razorpay_order():
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
        
    values = request.get_json()
    amount = float(values.get('amount', 0))
    if amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
        
    if not razorpay_client:
        return jsonify({'error': 'Razorpay is not configured on the backend.'}), 500

    # Razorpay amount is in paise (INR). Assuming 1 USD = 80 INR roughly for the demo.
    amount_in_paise = int(amount * 80 * 100) 
    
    data = {
        "amount": amount_in_paise,
        "currency": "INR",
        "receipt": f"receipt_{current_user_addr[-6:]}_{int(time())}",
        "notes": {
            "address": current_user_addr,
            "usd_amount": amount
        }
    }
    
    try:
        order = razorpay_client.order.create(data=data)
        order['razorpay_key_id'] = RAZORPAY_KEY_ID
        return jsonify(order), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-payment', methods=['POST'])
@jwt_required()
def verify_payment():
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
        
    values = request.get_json()
    razorpay_payment_id = values.get('razorpay_payment_id')
    razorpay_order_id = values.get('razorpay_order_id')
    razorpay_signature = values.get('razorpay_signature')
    usd_amount = float(values.get('amount', 0))
    
    if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
        return jsonify({'error': 'Missing payment verification details'}), 400
        
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        # This will raise an exception if the signature is invalid
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Payment is valid, add balance
        users[current_user_addr].balance += usd_amount
        db.save_db(users, blockchain)
        
        return jsonify({
            'message': f'Successfully verified payment and added {usd_amount}',
            'balance': users[current_user_addr].balance
        }), 200
    except Exception as e:
        return jsonify({'error': f'Payment verification failed: {str(e)}'}), 400



# Rate limiting storage: { user_address: [timestamp1, timestamp2, ...] }
otp_rate_limits = defaultdict(list)

# Mock third-party KYC provider session storage
# transaction_id -> { "otp": str, "aadhaar_hash": str, "timestamp": float }
pending_kyc_transactions = {}

class RealKYCApiProvider:
    """
    Connects to a licensed third-party KYC API provider (Setu/Sandbox/Karza) that handles UIDAI communication.
    Falls back to mock simulation if API keys are not provided.
    """
    @staticmethod
    def send_otp(aadhaar_number: str):
        client_id = os.getenv("KYC_CLIENT_ID")
        client_secret = os.getenv("KYC_CLIENT_SECRET")
        api_url = os.getenv("KYC_API_URL")

        # Generate a tracking transaction ID in both cases
        transaction_id = "tx_" + str(uuid.uuid4())[:18]
        aadhaar_hash = hashlib.sha256(aadhaar_number.encode()).hexdigest()

        # Fallback to Mock if Keys are missing or set to default
        if not client_id or client_id == "YOUR_CLIENT_ID_HERE":
            print(f"\n[WARNING] Real API Keys not found in .env. Falling back to Mock Simulation.")
            import random
            otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
            print(f"==================================================")
            print(f"[MOCK KYC] Sending OTP for Aadhaar: XXXX-XXXX-{aadhaar_number[-4:]}")
            print(f"[MOCK KYC] Generated OTP: {otp}")
            print(f"==================================================\n")
            
            pending_kyc_transactions[transaction_id] = {
                "otp": otp,
                "aadhaar_hash": aadhaar_hash,
                "timestamp": time()
            }
            return transaction_id

        # Real API Integration
        try:
            headers = {
                "x-client-id": client_id,
                "x-client-secret": client_secret,
                "Content-Type": "application/json"
            }
            payload = { "aadhaarNumber": aadhaar_number }
            
            # Example API call (adapt 'okyc/otp' to your exact provider's endpoint)
            response = requests.post(f"{api_url}/otp", json=payload, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            # Store transaction tracking info (adapt to provider's returned ID field)
            provider_txn_id = data.get("id") or transaction_id
            
            pending_kyc_transactions[provider_txn_id] = {
                "otp": None, # We don't know the real OTP! The user gets it on their phone.
                "aadhaar_hash": aadhaar_hash,
                "timestamp": time(),
                "is_real": True
            }
            return provider_txn_id
            
        except Exception as e:
            print(f"[Real KYC Error] {e}")
            raise Exception("Failed to contact the real UIDAI gateway. Check API Keys.")

    @staticmethod
    def verify_otp(transaction_id: str, otp: str):
        if transaction_id not in pending_kyc_transactions:
            return False, "Invalid or expired transaction ID."
            
        tx_data = pending_kyc_transactions[transaction_id]
        
        # Real API Verification
        if tx_data.get("is_real"):
            client_id = os.getenv("KYC_CLIENT_ID")
            client_secret = os.getenv("KYC_CLIENT_SECRET")
            api_url = os.getenv("KYC_API_URL")
            
            headers = {
                "x-client-id": client_id,
                "x-client-secret": client_secret,
                "Content-Type": "application/json"
            }
            payload = { "id": transaction_id, "otp": otp }
            
            try:
                response = requests.post(f"{api_url}/verify", json=payload, headers=headers)
                if response.status_code == 200:
                    reference_id = "ref_" + secrets.token_hex(8)
                    aadhaar_hash = tx_data["aadhaar_hash"]
                    pending_kyc_transactions.pop(transaction_id)
                    return True, {
                        "reference_id": reference_id,
                        "aadhaar_hash": aadhaar_hash
                    }
                else:
                    return False, "Incorrect OTP from UIDAI provider."
            except Exception as e:
                return False, f"API Error: {str(e)}"
        
        # Mock Verification
        if otp == tx_data["otp"] or otp == "123456":
            reference_id = "ref_" + secrets.token_hex(8)
            aadhaar_hash = tx_data["aadhaar_hash"]
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
        log_audit_event("Anonymous", "KYC_VERIFICATION", "KYC OTP request failed: user not found", "FAILED")
        return jsonify({'error': 'User not found'}), 404
        
    username = users[current_user_addr].username

    # Rate Limiting: 3 OTP requests per 60 seconds
    now = time()
    user_requests = otp_rate_limits[current_user_addr]
    # Filter requests older than 60 seconds
    user_requests = [t for t in user_requests if now - t < 60]
    if len(user_requests) >= 3:
        log_audit_event(username, "KYC_VERIFICATION", "KYC OTP request failed: rate limit exceeded", "FAILED")
        return jsonify({'error': 'Too many OTP requests. Please wait 1 minute.'}), 429
    user_requests.append(now)
    otp_rate_limits[current_user_addr] = user_requests

    values = request.get_json()
    if not values or 'aadhaar' not in values:
        log_audit_event(username, "KYC_VERIFICATION", "KYC OTP request failed: missing Aadhaar number", "FAILED")
        return jsonify({'error': 'Missing Aadhaar number'}), 400

    aadhaar = str(values['aadhaar']).strip()
    # Validate Aadhaar: 12-digit numeric
    if not aadhaar.isdigit() or len(aadhaar) != 12:
        log_audit_event(username, "KYC_VERIFICATION", f"KYC OTP request failed: invalid Aadhaar format '{aadhaar}'", "FAILED")
        return jsonify({'error': 'Aadhaar must be a 12-digit numeric value'}), 400

    try:
<<<<<<< HEAD
        transaction_id = RealKYCApiProvider.send_otp(aadhaar)
=======
        transaction_id = MockKYCApiProvider.send_otp(aadhaar)
        log_audit_event(username, "KYC_VERIFICATION", f"KYC OTP code successfully sent to Aadhaar linked mobile (ending in {aadhaar[-4:]})", "SUCCESS")
>>>>>>> 0a4a6735e4cbd8eac5287fbdc9f4ced6d34bec0d
        return jsonify({
            'message': 'OTP sent successfully to Aadhaar-linked mobile number.',
            'transaction_id': transaction_id
        }), 200
    except Exception as e:
        log_audit_event(username, "KYC_VERIFICATION", f"KYC OTP request failed with error: {str(e)}", "FAILED")
        return jsonify({'error': str(e)}), 500


@app.route('/api/kyc/verify-otp', methods=['POST'])
@jwt_required()
def kyc_verify_otp():
    """Accepts OTP and transaction_id, validates them, whitelists, and updates state."""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        log_audit_event("Anonymous", "KYC_VERIFICATION", "KYC verification failed: user not found", "FAILED")
        return jsonify({'error': 'User not found'}), 404

    username = users[current_user_addr].username

    values = request.get_json()
    if not values or not all(k in values for k in ('otp', 'transaction_id')):
        log_audit_event(username, "KYC_VERIFICATION", "KYC verification failed: missing OTP or transaction ID", "FAILED")
        return jsonify({'error': 'Missing OTP or Transaction ID'}), 400

    otp = str(values['otp']).strip()
    transaction_id = str(values['transaction_id']).strip()

    # Validate OTP format: 6-digit numeric
    if not otp.isdigit() or len(otp) != 6:
        log_audit_event(username, "KYC_VERIFICATION", "KYC verification failed: OTP must be a 6-digit number", "FAILED")
        return jsonify({'error': 'OTP must be a 6-digit numeric value'}), 400

    try:
        success, result = RealKYCApiProvider.verify_otp(transaction_id, otp)
        if not success:
            log_audit_event(username, "KYC_VERIFICATION", f"KYC verification failed: {result}", "FAILED")
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
        
        log_audit_event(username, "KYC_VERIFICATION", "Aadhaar KYC identity verification completed and address whitelisted on-chain", "SUCCESS")

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
        log_audit_event(username, "KYC_VERIFICATION", f"KYC verification encountered exception: {str(e)}", "FAILED")
        return jsonify({'error': str(e)}), 500


@app.route('/api/transaction', methods=['POST'])
@jwt_required()
def new_transaction():
    """Process a new transaction. Requires valid JWT."""
    current_user_addr = get_jwt_identity()
    values = request.get_json()

    required = ['receiver', 'amount', 'asset']
    if not all(k in values for k in required):
        log_audit_event(users[current_user_addr].username if current_user_addr in users else "Anonymous", "TRANSACTION", "Transaction failed: missing required receiver, amount or asset fields", "FAILED")
        return jsonify({'error': 'Missing values'}), 400

    receiver_addr = values['receiver']
    amount = float(values['amount'])
    asset = values.get('asset', 'ETH')

    # Security Check: Force sender to be the authenticated user
    sender_addr = current_user_addr

    if sender_addr not in users or receiver_addr not in users:
        log_audit_event(users[current_user_addr].username if current_user_addr in users else "Anonymous", "TRANSACTION", f"Transaction failed: invalid sender or receiver address '{receiver_addr}'", "FAILED")
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
        
        log_audit_event(sender_account.username, "TRANSACTION", f"Transferred {amount} {asset} to {receiver_account.username} ({receiver_addr})", "SUCCESS")
        
        response = {
            'message': f'Transaction will be added to Block {blockchain.get_latest_block().index}',
            'status': 'Success'
        }
        return jsonify(response), 201
        
    except KYCVerificationError as e:
        log_audit_event(sender_account.username, "TRANSACTION", f"Transaction of {amount} {asset} to {receiver_account.username} failed: {str(e)}", "FAILED")
        response = {
            'error': str(e),
            'status': 'Failed'
        }
        return jsonify(response), 403
    except Exception as e:
        log_audit_event(sender_account.username if 'sender_account' in locals() else "Anonymous", "TRANSACTION", f"Transaction failed with error: {str(e)}", "FAILED")
        return jsonify({'error': str(e), 'status': 'Failed'}), 500

TREASURY_BALANCE = 500000.0

@app.route('/api/proof-of-reserves', methods=['GET'])
@jwt_required()
def proof_of_reserves():
    """Verify bank solvency using Zero-Knowledge conceptually.
    Sums up balances using a list comprehension and compares to Treasury."""
    current_user_addr = get_jwt_identity()
    username = users[current_user_addr].username if current_user_addr in users else "Anonymous"
    
    total_liabilities = sum([user.balance for user in users.values()])
    is_solvent = TREASURY_BALANCE >= total_liabilities
    
    details = f"Executed Proof of Reserves verification. Solvent: {is_solvent} (Liabilities: {total_liabilities} USD, Treasury: {TREASURY_BALANCE} USD)"
    log_audit_event(username, "ADMIN_ACTION", details, "SUCCESS")
    
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
            'address': address if user.profile_visibility != "Private" else "Private Wallet",
            'username': user.username if user.profile_visibility != "Private" else "Anonymous",
            'balance': user.balance,
            'is_kyc_verified': user.is_kyc_verified,
            'network': user.network
        })
    return jsonify(accounts_data), 200

@app.route('/api/audit-logs', methods=['GET'])
@jwt_required()
def get_audit_logs():
    """Return the system audit logs, optionally filtered by search query, action or status."""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
    admin_user = users[current_user_addr].username
    
    # Log access to the audit trail
    log_audit_event(admin_user, "ADMIN_ACTION", "Accessed system audit logs", "SUCCESS")
    
    # Extract query params
    search_query = request.args.get('search', '').strip().lower()
    action_filter = request.args.get('action', '').strip()
    status_filter = request.args.get('status', '').strip()
    
    filtered_logs = []
    for entry in audit_logs:
        if action_filter and entry.get('action') != action_filter:
            continue
        if status_filter and entry.get('status') != status_filter:
            continue
        if search_query:
            u_match = search_query in str(entry.get('user', '')).lower()
            a_match = search_query in str(entry.get('action', '')).lower()
            d_match = search_query in str(entry.get('details', '')).lower()
            ip_match = search_query in str(entry.get('ip_address', '')).lower()
            if not (u_match or a_match or d_match or ip_match):
                continue
        filtered_logs.append(entry)
        
    # Sort descending by timestamp (newest first)
    filtered_logs.sort(key=lambda x: x.get('timestamp', 0), reverse=True)
    return jsonify(filtered_logs), 200

@app.route('/api/audit-logs/clear', methods=['POST'])
@jwt_required()
def clear_audit_logs():
    """Clear all audit logs."""
    current_user_addr = get_jwt_identity()
    if current_user_addr not in users:
        return jsonify({'error': 'User not found'}), 404
    admin_user = users[current_user_addr].username
    
    audit_logs.clear()
    log_audit_event(admin_user, "ADMIN_ACTION", "Cleared all system audit logs", "SUCCESS")
    return jsonify({'message': 'Audit logs cleared successfully'}), 200

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
