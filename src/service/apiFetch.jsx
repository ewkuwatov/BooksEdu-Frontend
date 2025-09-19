const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const apiFetch = async (endpoint, options = {}, accessToken) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch {
      error = { detail: res.statusText }
    }
    throw new Error(error.detail || 'Ошибка API')
  }

  return res.json()
}
