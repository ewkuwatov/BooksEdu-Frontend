// src/service/statisticsApi.jsx
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://booksedu-backend-1.onrender.com/statistics',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const statisticsApi = {
  exportStatistics: async () => {
    try {
      const response = await api.get('/export', {
        responseType: 'blob', // важно для скачивания файлов
      })
      return response.data
    } catch (error) {
      console.error('Ошибка при экспорте статистики:', error)
      throw error
    }
  },
}

export default statisticsApi
