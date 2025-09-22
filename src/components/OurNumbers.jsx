import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../context/AuthContext'
import general_statsApi from '../service/general_stats'
import img from '../assets/b64d65c9f5815f60cbae1a4fca79bb34.jpeg'

import '../styles/OurNumbers.css'


const OurNumbers = () => {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [animatedStats, setAnimatedStats] = useState({
    total_universities: 0,
    total_directions: 0,
    total_students: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getStats = await general_statsApi.getStats()
        setStats(getStats)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [user])

  // Анимация счётчика
  useEffect(() => {
    if (!stats) return
    const duration = 1500
    const start = performance.now()

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1)

      setAnimatedStats({
        total_universities: Math.floor(stats.total_universities * progress),
        total_directions: Math.floor(stats.total_directions * progress),
        total_students: Math.floor(stats.total_students * progress),
      })

      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [stats])

  if (!stats) return <p>Loading...</p>

  return (
    <div className="statsNumber" style={{ backgroundImage: `url(${img})` }}>
      <div className="titleStats">
        <p>{t('statistics_title')}</p>
      </div>
      <div className="stats">
        <div role="group">
          <span>{t('universities')}</span>
          <strong>{animatedStats.total_universities}</strong>
        </div>
        <div role="group">
          <span>{t('directions')}</span>
          <strong>{animatedStats.total_directions}</strong>
        </div>
        <div role="group">
          <span>{t('students')}</span>
          <strong>{animatedStats.total_students}</strong>
        </div>
      </div>
    </div>
  )
}

export default OurNumbers
