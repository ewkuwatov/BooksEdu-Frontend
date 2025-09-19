// src/api/api.js
import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

// Создаем экземпляр axios с базовым URL и cookie
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // важно для отправки cookie (refresh_token)
  headers: {
    'Content-Type': 'application/json',
  },
})

// ----------------------
// Получаем статистику университетов (owner или superadmin)
// ----------------------
export async function getUniversitiesStats() {
  try {
    const res = await api.get('/stats/owner-universities')
    return res.data
  } catch (err) {
    console.error(err)
    throw new Error(
      err.response?.data?.detail || 'Ошибка при получении статистики'
    )
  }
}
