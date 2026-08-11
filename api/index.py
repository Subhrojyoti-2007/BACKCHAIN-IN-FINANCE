import sys
import os

# Add the root directory to the python path so imports from the root folder work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

# Vercel needs this application object to run the Flask app
