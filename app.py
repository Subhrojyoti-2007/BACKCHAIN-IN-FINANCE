from flask import Flask, jsonify, request
from flask_cors import CORS
from time import time
from blockchain import Blockchain
from smart_contract import TransactionManager, UserAccount, KYCVerificationError

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Backend API is running successfully! Please visit the frontend application at http://localhost:5173"

# Initialize the blockchain
blockchain = Blockchain()

# Initialize dummy users
users = {
    "0x82AF91EF": UserAccount("Alice_Corp", is_kyc_verified=True),
    "0x91AF72BC": UserAccount("Bob_LLC", is_kyc_verified=True),
    "0x72BC88EF": UserAccount("Charlie_Anon", is_kyc_verified=False)
}

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
def new_transaction():
    """Process a new transaction."""
    values = request.get_json()

    # Check that the required fields are in the POST data
    required = ['sender', 'receiver', 'amount', 'asset']
    if not all(k in values for k in required):
        return jsonify({'error': 'Missing values'}), 400

    sender_addr = values['sender']
    receiver_addr = values['receiver']
    amount = float(values['amount'])
    asset = values.get('asset', 'ETH')

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
