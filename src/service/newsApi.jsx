import axios from 'axios'
const BASE_URL = 'https://booksedu-backend-1.onrender.com'

const api = axios.create({
  baseURL: `${BASE_URL}/news`,
  withCredentials: true,
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accesstoken')
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

const newsApi = {
  getNews: () => handleRequest(api.get('/')),
  createNews: (data) =>
    handleRequest(
      api.post('/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),
  updateNews: (id, data) =>
    handleRequest(
      api.put(`/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),
  deleteNews: (id) => handleRequest(api.delete(`/${id}`)),
}

export default newsApi

export function getImageUrl(path) {
  if (!path) return '/no-image.png' // запасная картинка
  return `${BASE_URL}${path}`
}