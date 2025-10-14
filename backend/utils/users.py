import json
from pathlib import Path
import tempfile
import os

USER_FILE = Path(__file__).parent.parent / "data" / "users.json"

def load_users():
  if USER_FILE.exists():
    try:
      with open(USER_FILE, "r") as f:
        return json.load(f)
    except Exception:
      # File hỏng → fallback rỗng
      return {}
  return {}

def save_users(users: dict):
  USER_FILE.parent.mkdir(parents=True, exist_ok=True)
  # Atomic write: ghi ra file tạm rồi replace
  with tempfile.NamedTemporaryFile("w", delete=False, dir=str(USER_FILE.parent)) as tf:
    json.dump(users, tf, indent=2)
    temp_name = tf.name
  os.replace(temp_name, USER_FILE)