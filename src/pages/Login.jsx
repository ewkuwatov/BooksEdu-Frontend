import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/register/Login.css'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await login(email, password) // login возвращает данные пользователя
    if (data) {
      const role = data.role
      if (role === 'owner') navigate('/')
      else if (role === 'superadmin') navigate('/')
      else navigate('/')
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className="loginPage">
      <h2>Вход в систему</h2>
      <div className="loginCardWrapper">
        <div className="loginCard">
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="loginForm">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Войти</button>
          </form>
        </div>
      </div>
      <p className="loginLink">
        No accaunt? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login
