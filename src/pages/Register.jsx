// src/pages/Register.jsx
import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/register/Login.css' // используем тот же стиль, что и для Login

const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await register(firstName, lastName, email, password)
    if (success) navigate('/login')
    else setError('Ошибка регистрации')
  }

  return (
    <div className="loginPage">
      <h2>Регистрация</h2>
      <div className="loginCardWrapper">
        <div className="loginCard">
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="loginForm">
            <input
              type="text"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
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
            <button type="submit">Зарегистрироваться</button>
          </form>
          <p className="loginLink">
            Есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
