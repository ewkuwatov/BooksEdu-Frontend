import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/subjects',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== Интерцептор для токена =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accesstoken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== Универсальный обработчик =====
async function handleRequest(promise) {
  try {
    const res = await promise
    return res.data
  } catch (error) {
    console.error('API error:', error?.response?.data || error)
    throw error
  }
}

// ===== API для subjects =====
const subjectApi = {
  getSubjects: () => handleRequest(api.get('/')),
  getSubjectsByUniversity: (universityId) =>
    handleRequest(api.get(`/university/${universityId}`)),
  
  createSubjects: (data) => handleRequest(api.post('/bulk', data)), // массив оборачиваем
  updateSubjects: (id, data) => handleRequest(api.put(`/${id}`, data)),
  deleteSubjects: (id) => handleRequest(api.delete(`/${id}`)),
}

export default subjectApi
