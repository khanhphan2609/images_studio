"use client";

// frontend/utils/auth.ts
const API_URL = "http://127.0.0.1:8000/api/auth";

export interface User {
  id?: string;
  email?: string;
  username?: string;
  // thêm các field khác tùy bảng users
}

// GET example: test Supabase connection
export async function testSupabase(): Promise<any> {
  const res = await fetch(`${API_URL}/test`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// POST example: registration
export async function registerUser(email: string, username: string): Promise<any> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

// POST example: login
export async function loginUser(email: string): Promise<any> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json();
}
