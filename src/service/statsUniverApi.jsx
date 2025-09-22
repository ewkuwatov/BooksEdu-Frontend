// src/service/statsUniverApi.jsx
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// создаём инстанс axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // если сервер работает через cookies
})

// --- Получаем статистику университетов ---
export const getUniversitiesStats = async (token) => {
  try {
    const res = await api.get('/stats/owner-universities', {
      headers: {
        Authorization: `Bearer ${token}`, // <-- ключевой момент
      },
    })
    return res.data
  } catch (err) {
    console.error('Ошибка в getUniversitiesStats:', err.response?.data || err)
    throw err
  }
}
