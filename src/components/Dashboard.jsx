import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import StatsUniver from './StatsUniver'
import Main from './Main'


const Dashboard = () => {
  const { user } = useContext(AuthContext)

  if (!user) return <Main />

  return (
    <div>
      {(user.role === 'owner' || user.role === 'superadmin')   && (
        <>
          <StatsUniver />
        </>
      )}
      <Main />
    </div>
  )
}

export default Dashboard
