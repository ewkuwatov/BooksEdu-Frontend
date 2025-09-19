import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Loader from '../components/Loader'

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role))
    return <Navigate to="/forbidden" replace />

  return children
}

export default PrivateRoute
