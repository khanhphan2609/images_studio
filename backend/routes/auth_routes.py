import base64
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
)
from webauthn.helpers.structs import AuthenticatorTransport
from utils.users import load_users, save_users
from utils.converts import encode_bytes
import jwt

SECRET_KEY = "SUPER_SECRET_KEY"
RP_ID = "localhost"
RP_NAME = "ImageStudio"
# Cho phép cả localhost và network khi dev (dùng mạng để đăng nhập từ điện thoại)
EXPECTED_ORIGINS = ["http://localhost:3000", "http://172.31.99.120:3000"]

router = APIRouter(prefix="/api/auth", tags=["auth"])


def b64url_to_bytes(b64url: str) -> bytes:
    """Chuyển base64url string → bytes (an toàn với padding)."""
    if isinstance(b64url, (bytes, bytearray)):
        return bytes(b64url)
    if not isinstance(b64url, str):
        return b""
    padding = "=" * ((4 - (len(b64url) % 4)) % 4)
    return base64.urlsafe_b64decode(b64url + padding)


# ===================== REGISTER START =====================
@router.post("/register/start")
async def register_start(request: Request):
    body = await request.json()
    username = body.get("username")

    if not username:
        return JSONResponse({"error": "Missing username"}, status_code=400)

    users = load_users()
    if username in users:
        return JSONResponse({"error": "User already exists"}, status_code=400)

    options = generate_registration_options(
        rp_id=RP_ID,
        rp_name=RP_NAME,
        user_id=username.encode("utf-8"),
        user_name=username,
        user_display_name=username,
        attestation="none",
    )

    # Encode tất cả bytes → base64url để JSON hợp lệ
    options_dict = encode_bytes(options)

    # Lưu CHÍNH XÁC challenge đã gửi cho client (tránh chênh lệch do encode lại)
    users[username] = {"challenge": options_dict["challenge"]}
    save_users(users)

    return JSONResponse(options_dict)


# ===================== REGISTER VERIFY =====================
@router.post("/register/verify")
# ===================== LOGIN VERIFY =====================
@router.post("/login/verify")
async def login_verify(request: Request):
    body = await request.json()
    username = body.get("username")
    asse_resp = body.get("asseResp")

    if not username or not asse_resp:
        return JSONResponse({"error": "Missing data"}, status_code=400)

    users = load_users()
    if username not in users:
        return JSONResponse({"error": "User not found"}, status_code=404)

    # Decode challenge và public_key về bytes để verify
    expected_challenge_str = users[username]["challenge"]
    expected_challenge = b64url_to_bytes(expected_challenge_str)

    public_key_b64 = users[username]["public_key"]
    public_key_bytes = b64url_to_bytes(public_key_b64)

    try:
        verification = verify_authentication_response(
            credential=asse_resp,
            expected_challenge=expected_challenge,
            expected_rp_id=RP_ID,
            expected_origin=EXPECTED_ORIGINS,
            credential_public_key=public_key_bytes,
            credential_current_sign_count=users[username]["sign_count"],
        )
    except Exception as e:
        return JSONResponse({"error": f"Verification failed: {str(e)}"}, status_code=400)

    # Cập nhật sign_count sau khi xác thực thành công
    users[username]["sign_count"] = verification.new_sign_count
    save_users(users)

    # ✅ Tạo JWT token
    token = jwt.encode({"username": username}, SECRET_KEY, algorithm="HS256")

    # ✅ Trả về response + set cookie cho frontend
    response = JSONResponse({
        "success": True,
        "token": token,
        "message": "Login successful",
        "username": username
    })

    # ✅ Cookie token giúp Next.js middleware đọc được
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",  # Cho phép cookie hoạt động trên localhost
        max_age=60 * 60 * 24 * 7,  # 7 ngày
        path="/",
    )

    return response

# ===================== LOGIN START =====================
@router.post("/login/start")
async def login_start(request: Request):
    body = await request.json()
    username = body.get("username")

    if not username:
        return JSONResponse({"error": "Missing username"}, status_code=400)

    users = load_users()
    if username not in users or "credential_id" not in users[username]:
        return JSONResponse({"error": "User not registered or has no credential"}, status_code=404)

    # Decode credential_id từ base64url → bytes để đưa vào allow_credentials
    credential_id_b64 = users[username]["credential_id"]
    credential_id = b64url_to_bytes(credential_id_b64)

    options = generate_authentication_options(
        rp_id=RP_ID,
        allow_credentials=[{
            "id": credential_id,
            "transports": [AuthenticatorTransport.USB, AuthenticatorTransport.INTERNAL]
        }],
    )

    options_dict = encode_bytes(options)

    # Lưu CHÍNH XÁC challenge đã gửi cho client
    users[username]["challenge"] = options_dict["challenge"]
    save_users(users)

    return JSONResponse(options_dict)


# ===================== LOGIN VERIFY =====================
@router.post("/login/verify")
async def login_verify(request: Request):
    body = await request.json()
    username = body.get("username")
    asse_resp = body.get("asseResp")

    if not username or not asse_resp:
        return JSONResponse({"error": "Missing data"}, status_code=400)

    users = load_users()
    if username not in users:
        return JSONResponse({"error": "User not found"}, status_code=404)

    # Decode challenge và public_key về bytes để verify
    expected_challenge_str = users[username]["challenge"]
    expected_challenge = b64url_to_bytes(expected_challenge_str)

    public_key_b64 = users[username]["public_key"]
    public_key_bytes = b64url_to_bytes(public_key_b64)

    try:
        verification = verify_authentication_response(
            credential=asse_resp,
            expected_challenge=expected_challenge,
            expected_rp_id=RP_ID,
            expected_origin=EXPECTED_ORIGINS,
            credential_public_key=public_key_bytes,
            credential_current_sign_count=users[username]["sign_count"],
        )
    except Exception as e:
        return JSONResponse({"error": f"Verification failed: {str(e)}"}, status_code=400)

    users[username]["sign_count"] = verification.new_sign_count
    save_users(users)

    token = jwt.encode({"username": username}, SECRET_KEY, algorithm="HS256")
    return JSONResponse({"success": True, "token": token})