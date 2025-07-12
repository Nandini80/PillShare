import { BACKEND_URL } from "../config";
const API_BASE = `${BACKEND_URL}/api/needy`;

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

export const getAvailableCities = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/available-cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch available cities")
    }
    return result
  } catch (error) {
    console.error("Error fetching available cities:", error)
    return { success: false, data: [] }
  }
}

export const getAvailableMedicines = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/available-medicines`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch available medicines")
    }
    return result
  } catch (error) {
    console.error("Error fetching available medicines:", error)
    return { success: false, data: [] }
  }
}

export const searchDonors = async (searchQuery, region, prescriptionFile, token) => {
  try {
    const formData = new FormData()
    formData.append("searchQuery", searchQuery)
    formData.append("region", region)
    if (prescriptionFile) {
      formData.append("prescription", prescriptionFile)
    }

    const res = await fetch(`${API_BASE}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to search donors")
    }
    return result
  } catch (error) {
    console.error("Error searching donors:", error)
    return { success: false, data: [] }
  }
}

export const createDonationRequest = async (donorId, medicineId, message, token) => {
  try {
    const res = await fetch(`${API_BASE}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ donorId, medicineId, message }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to create request")
    }
    return result
  } catch (error) {
    console.error("Error creating request:", error)
    return { success: false, message: error.message }
  }
}

export const getMyRequests = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/my-requests`, {
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

export const rateDonor = async (requestId, rating, comment, token) => {
  try {
    const res = await fetch(`${API_BASE}/rate-donor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId, rating, comment }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to rate donor")
    }
    return result
  } catch (error) {
    console.error("Error rating donor:", error)
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

export const getRecentSearches = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/recent-searches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch recent searches")
    }
    return result
  } catch (error) {
    console.error("Error fetching recent searches:", error)
    return { success: false, data: [] }
  }
}
