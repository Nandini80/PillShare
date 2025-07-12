import { BACKEND_URL } from "../config";
const API_BASE = `${BACKEND_URL}/api/auth`;

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Registration failed")
    }

    return result
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Login failed")
    }

    return result
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}
