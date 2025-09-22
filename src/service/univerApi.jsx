// src/api/univerApi.js
import axios from 'axios'

// =======================
// Создаём экземпляр axios
// =======================
const api = axios.create({
  baseURL: 'https://booksedu-backend-1.onrender.com/universities',
  withCredentials: true, // для HttpOnly cookie (refresh_token)
  headers: {
    'Content-Type': 'application/json',
  },
})

// =======================
// Interceptor для токена
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') // храним access_token в localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// =======================
// Централизованная обработка запросов
// =======================
async function handleRequest(promise) {
  try {
    const res = await promise
    return res.data
  } catch (err) {
    console.error(err)
    throw new Error(err.response?.data?.detail || 'Ошибка API')
  }
}

// =======================
// Методы API
// =======================
const univerApi = {
  // ---- Получение списка всех университетов (owner) ----
  getUniversities: () => handleRequest(api.get('/')),

  // ---- Получение одного университета (superadmin) ----
  getUniversityById: (id) => handleRequest(api.get(`/${id}`)),

  // ---- Создание университета (только owner) ----
  createUniversity: (data) => handleRequest(api.post('/', data)),

  // ---- Обновление университета (owner → любой, superadmin → только свой) ----
  updateUniversity: (id, data) => handleRequest(api.put(`/${id}`, data)),

  // ---- Удаление университета (только owner) ----
  deleteUniversity: (id) => handleRequest(api.delete(`/${id}`)),
}

export default univerApi
