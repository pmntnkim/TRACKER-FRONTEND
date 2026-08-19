import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"

export const checkBackendHealth = async () => {
  try {
    await axios.get(`${BASE_URL}/api/health/`, { timeout: 8000 })
    return true
  } catch (error) {
    return false
  }
}
