import axios from 'axios'

const api = axios.create({
  baseURL: 'https://booksedu-backend-1.onrender.com/directions',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// перехватчик для токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accesstoken') // или передавать через AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// обработчик запросов
async function handleRequest(promise) {
  try {
    const res = await promise
    return res.data
  } catch (error) {
    console.error('API error:', error?.response || error)
    throw error // пробрасываем дальше
  }
}

const directionApi = {
  getDirections: () => handleRequest(api.get('')),
  createDirection: (data) => handleRequest(api.post('', data)),
  updateDirection: (id, data) => handleRequest(api.put(`/${id}`, data)),
  deleteDirection: (id) => handleRequest(api.delete(`/${id}`)),
}

export default directionApi
