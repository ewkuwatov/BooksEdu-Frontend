import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/admins/',
  withCredentials: true,
  headers: {
    'Content-Type' : 'application/json'
  },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

async function handleRequest(promise) {
    try {
        const res = await promise
        return res.data
    } catch (error) {
        console.error(error)
        throw new Error(error.response?.data?.detail || 'Ошибка API')
    }
}

const adminApi = {
    getAdmins: () => handleRequest(api.get('/')),
    createAdmin: (data) => handleRequest(api.post('/', data)),
    updateAdmin: (id, data) => handleRequest(api.put(`/${id}`, data)),
    deleteAdmin: (id) => handleRequest(api.delete(`/${id}`)),
}

export default adminApi