import { BACKEND_URL } from "../config"
const API_BASE = `${BACKEND_URL}/api/otp`

export const sendPhoneOTP = async (phone, token) => {
  try {
    const res = await fetch(`${API_BASE}/send-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to send OTP")
    }

    return result
  } catch (error) {
    console.error("Send phone OTP error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}

export const verifyPhoneOTP = async (phone, otp, token) => {
  try {
    const res = await fetch(`${API_BASE}/verify-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone, otp }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to verify OTP")
    }

    return result
  } catch (error) {
    console.error("Verify phone OTP error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}

export const sendEmailOTP = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to send email OTP")
    }

    return result
  } catch (error) {
    console.error("Send email OTP error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}

export const verifyEmailOTP = async (email, otp) => {
  try {
    const res = await fetch(`${API_BASE}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to verify email OTP")
    }

    return result
  } catch (error) {
    console.error("Verify email OTP error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}

export const sendForgotPasswordEmail = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to send password reset email")
    }

    return result
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      message: error.message || "Network error occurred",
    }
  }
}
