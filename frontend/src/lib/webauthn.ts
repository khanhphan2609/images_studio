"use client";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

const API_URL = "http://localhost:8000/api/auth";

/**
 * Đảm bảo options hợp lệ cho simplewebauthn (KHÔNG convert sang Uint8Array)
 */
function normalizeRegistrationOptions(options: any) {
  const user = options?.user ?? {};

  const displayName =
    user.displayName ??
    user.display_name ??
    user.displayname ??
    user.display ??
    user.name ??
    "";

  const name =
    user.name ??
    user.username ??
    user.user_name ??
    user.displayName ??
    user.display_name ??
    "";

  return {
    ...options,
    user: {
      ...user,
      name: String(name),
      displayName: String(displayName),
    },
    pubKeyCredParams: Array.isArray(options?.pubKeyCredParams)
      ? options.pubKeyCredParams
      : [{ type: "public-key", alg: -7 }],
  };
}

function normalizeAuthenticationOptions(options: any) {
  return {
    ...options,
    allowCredentials: Array.isArray(options?.allowCredentials)
      ? options.allowCredentials
      : [],
  };
}

/**
 * Đăng ký WebAuthn
 */
export async function registerUser(username: string) {
  const res = await fetch(`${API_URL}/register/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  const options = await res.json();
  if (!res.ok) {
    throw new Error(options?.error || "Register start failed");
  }

  const publicKeyOptions = normalizeRegistrationOptions(options);

  const attResp = await startRegistration(publicKeyOptions);

  const verifyRes = await fetch(`${API_URL}/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, attResp }),
  });
  const verifyJson = await verifyRes.json();
  if (!verifyRes.ok) {
    throw new Error(verifyJson?.error || "Register verify failed");
  }
  return verifyJson;
}

/**
 * Đăng nhập WebAuthn
 */
export async function loginUser(username: string) {
  const res = await fetch(`${API_URL}/login/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  const options = await res.json();
  if (!res.ok) {
    throw new Error(options?.error || "Login start failed");
  }

  const publicKeyOptions = normalizeAuthenticationOptions(options);

  const asseResp = await startAuthentication(publicKeyOptions);

  const verifyRes = await fetch(`${API_URL}/login/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, asseResp }),
  });
  const verifyJson = await verifyRes.json();
  if (!verifyRes.ok) {
    throw new Error(verifyJson?.error || "Login verify failed");
  }
  return verifyJson;
}