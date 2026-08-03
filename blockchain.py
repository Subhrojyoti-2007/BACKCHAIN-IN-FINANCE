import hashlib
import json
from time import time

class Block:
    def __init__(self, index, timestamp, transactions, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        """
        Calculates the SHA-256 hash of the block.
        """
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def __repr__(self):
        return f"Block(index={self.index}, hash={self.hash[:10]}...)"

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }

    @classmethod
    def from_dict(cls, data):
        # We instantiate with original properties so we don't recalculate a different hash
        block = cls(
            index=data.get("index"),
            timestamp=data.get("timestamp"),
            transactions=data.get("transactions", []),
            previous_hash=data.get("previous_hash")
        )
        block.hash = data.get("hash", block.hash)
        return block


class Blockchain:
    def __init__(self, chain=None):
        if chain is None:
            self.chain = [self.create_genesis_block()]
        else:
            self.chain = chain

    def to_dict(self):
        return {
            "chain": [block.to_dict() for block in self.chain]
        }

    @classmethod
    def from_dict(cls, data):
        chain_data = data.get("chain", [])
        chain = [Block.from_dict(b_data) for b_data in chain_data]
        return cls(chain=chain)

    def create_genesis_block(self):
        """
        Generates the first block in the blockchain.
        """
        return Block(0, time(), ["Genesis Block"], "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, transactions):
        """
        Adds a new block to the chain.
        """
        latest_block = self.get_latest_block()
        new_block = Block(
            index=latest_block.index + 1,
            timestamp=time(),
            transactions=transactions,
            previous_hash=latest_block.hash
        )
        self.chain.append(new_block)

    def is_chain_valid(self):
        """
        Audits the blockchain to ensure nobody has tampered with it.
        Recalculates the hashes and verifies connections between blocks.
        """
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Recalculate hash of current block to check if data was tampered with
            if current_block.hash != current_block.calculate_hash():
                print(f"Audit Failed: Block {current_block.index} data has been tampered with!")
                return False

            # Check if the block is properly linked to the previous block
            if current_block.previous_hash != previous_block.hash:
                print(f"Audit Failed: Block {current_block.index} is not properly linked to previous block!")
                return False

        print("Audit Passed: The blockchain is valid and secure.")
        return True

# Example Usage
if __name__ == "__main__":
    my_ledger = Blockchain()
    
    print("Adding block 1...")
    my_ledger.add_block([{"sender": "Alice", "receiver": "Bob", "amount": 50}])
    
    print("Adding block 2...")
    my_ledger.add_block([{"sender": "Bob", "receiver": "Charlie", "amount": 20}])
    
    # Audit the chain
    print("\n--- Starting Initial Audit ---")
    my_ledger.is_chain_valid()
    
    # Simulating Tampering
    print("\n--- Simulating Tampering on Block 1 ---")
    print("Malicious actor changes amount from 50 to 1000!")
    my_ledger.chain[1].transactions = [{"sender": "Alice", "receiver": "Bob", "amount": 1000}] 
    
    # Audit the chain again
    print("\n--- Starting Audit after tampering ---")
    my_ledger.is_chain_valid()
