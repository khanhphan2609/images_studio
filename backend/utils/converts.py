import base64
from dataclasses import is_dataclass, asdict

def encode_bytes(obj):
    """
    Recursively encode bytes to base64url string for JSON serialization
    """
    if isinstance(obj, bytes):
        return base64.urlsafe_b64encode(obj).decode("utf-8")
    elif isinstance(obj, dict):
        return {k: encode_bytes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [encode_bytes(v) for v in obj]
    elif is_dataclass(obj):
        return encode_bytes(asdict(obj))
    else:
        return obj
