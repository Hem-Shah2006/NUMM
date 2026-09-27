import os
import sys

# Add root and backend directories to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend.engine import app, init_db

# Trigger initialization on cold start
try:
    init_db()
except Exception as e:
    print(f"Vercel DB Init: {e}")
