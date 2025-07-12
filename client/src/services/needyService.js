const API_BASE = "http://localhost:5000/api/needy"

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

export const searchDonors = async (searchQuery, region, token) => {
  try {
    const res = await fetch(`${API_BASE}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searchQuery, region }),
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
