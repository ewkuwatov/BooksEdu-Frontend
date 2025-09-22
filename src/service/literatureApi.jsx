import axios from 'axios'

const api = axios.create({
  baseURL: 'https://booksedu-backend-1.onrender.com/literatures',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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

const literatureApi = {
  getLiterature: () => handleRequest(api.get('/')),
  createLiterature: (data) => handleRequest(api.post('/', data)),
  updateLiterature: (id, data) => handleRequest(api.put(`/${id}`, data)),
  deleteLiterature: (id) => handleRequest(api.delete(`/${id}`)),

  // Новый метод для загрузки файла
  createLiteratureWithFile: (formData) =>
    handleRequest(
      api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),

  updateLiteratureWithFile: (id, formData) =>
    handleRequest(
      api.put(`/upload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),
}

export default literatureApi
