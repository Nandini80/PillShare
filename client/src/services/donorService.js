import { BACKEND_URL } from "../config";
const API_BASE = `${BACKEND_URL}/api/donor`;

export const getProfile = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch profile")
    }
    return result
  } catch (error) {
    console.error("Error fetching profile:", error)
    return { success: false, message: error.message }
  }
}

export const updateProfile = async (data, token) => {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to update profile")
    }
    return result
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, message: error.message }
  }
}

export const addMedicine = async (medicineData, token) => {
  try {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to add medicine")
    }
    return result
  } catch (error) {
    console.error("Error adding medicine:", error)
    return { success: false, message: error.message }
  }
}

export const getMedicines = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch medicines")
    }
    return result
  } catch (error) {
    console.error("Error fetching medicines:", error)
    return { success: false, data: [] }
  }
}

export const updateMedicine = async (medicineId, medicineData, token) => {
  try {
    const res = await fetch(`${API_BASE}/medicines/${medicineId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to update medicine")
    }
    return result
  } catch (error) {
    console.error("Error updating medicine:", error)
    return { success: false, message: error.message }
  }
}

export const deleteMedicine = async (medicineId, token) => {
  try {
    const res = await fetch(`${API_BASE}/medicines/${medicineId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to delete medicine")
    }
    return result
  } catch (error) {
    console.error("Error deleting medicine:", error)
    return { success: false, message: error.message }
  }
}

export const deleteExpiredMedicines = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/medicines-expired`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to delete expired medicines")
    }
    return result
  } catch (error) {
    console.error("Error deleting expired medicines:", error)
    return { success: false, message: error.message }
  }
}

export const changePassword = async (passwordData, token) => {
  try {
    const res = await fetch(`${API_BASE}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to change password")
    }
    return result
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, message: error.message }
  }
}

export const getNeedyRequests = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/needy-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch needy requests")
    }
    return result
  } catch (error) {
    console.error("Error fetching needy requests:", error)
    return { success: false, data: [] }
  }
}

export const getAllRequests = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch requests")
    }
    return result
  } catch (error) {
    console.error("Error fetching requests:", error)
    return { success: false, data: [] }
  }
}

export const approveDonationRequest = async (requestId, message, token) => {
  try {
    const res = await fetch(`${API_BASE}/requests/${requestId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to approve request")
    }
    return result
  } catch (error) {
    console.error("Error approving request:", error)
    return { success: false, message: error.message }
  }
}

export const rejectDonationRequest = async (requestId, message, token) => {
  try {
    const res = await fetch(`${API_BASE}/requests/${requestId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to reject request")
    }
    return result
  } catch (error) {
    console.error("Error rejecting request:", error)
    return { success: false, message: error.message }
  }
}

export const completeDonationRequest = async (requestId, token) => {
  try {
    const res = await fetch(`${API_BASE}/requests/${requestId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to complete request")
    }
    return result
  } catch (error) {
    console.error("Error completing request:", error)
    return { success: false, message: error.message }
  }
}
