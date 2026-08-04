import json
import hashlib
from time import time
from app.extensions import db
from app.models.explorer import ExplorerBlockModel

class BlockchainService:
    @staticmethod
    def get_all_blocks():
        blocks = ExplorerBlockModel.query.order_by(ExplorerBlockModel.index.desc()).all()
        return blocks

    @staticmethod
    def get_block_by_index(index):
        return ExplorerBlockModel.query.get(index)

    @staticmethod
    def add_block(transactions):
        latest_block = ExplorerBlockModel.query.order_by(ExplorerBlockModel.index.desc()).first()
        
        if latest_block is None:
            # Should be initialized by seed.py, but fallback
            new_index = 0
            previous_hash = "0"
        else:
            new_index = latest_block.index + 1
            previous_hash = latest_block.hash
            
        new_timestamp = time()
        
        block_string = json.dumps({
            "index": new_index,
            "timestamp": new_timestamp,
            "transactions": transactions,
            "previous_hash": previous_hash
        }, sort_keys=True).encode()
        
        new_hash = hashlib.sha256(block_string).hexdigest()
        
        new_block = ExplorerBlockModel(
            index=new_index,
            timestamp=new_timestamp,
            transactions=transactions,
            previous_hash=previous_hash,
            hash=new_hash
        )
        
        db.session.add(new_block)
        db.session.commit()
        return new_block
