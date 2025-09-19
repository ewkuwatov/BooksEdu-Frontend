import React, { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { apiFetch } from '../service/apiFetch'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)

  // ---- Refresh токена ----
  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch('/auth/refresh', { method: 'POST' })
      setAccessToken(data.access_token)
      setUser({
        email: data.email,
        role: data.role,
        university_id: data.university_id,
      })
    } catch {
      setUser(null)
      setAccessToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // ---- Регистрация ----
  const register = async (first_name, last_name, email, password) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, email, password }),
    })
  }

  // ---- Логин ----
  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAccessToken(data.access_token)
      setUser({
        email: data.email,
        role: data.role,
        university_id: data.university_id,
      })
      return true
    } catch {
      return false
    }
  }

  // ---- Логаут ----
  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' })
    setUser(null)
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, accessToken, register, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
