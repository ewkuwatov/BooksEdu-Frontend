import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/stats/general',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

async function handleRequest(promise) {
    try {
        const res = await promise
        return res.data
    } catch (error) {
        console.error('API error:', error?.response || error)
        throw error
    }
}

const general_statsApi = {
    getStats: () => handleRequest(api.get(''))
}

export default general_statsApi