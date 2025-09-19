import { useEffect, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { getUniversitiesStats } from '../service/statsUniverApi'
import { AuthContext } from '../context/AuthContext'
import '../styles/UniversitiesStats.css'
import statisticsApi from '../service/statisticsApi'

const UniversitiesStats = () => {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !['owner', 'superadmin', 'user'].includes(user.role)) {
        setError(t('unauthorized'))
        setLoading(false)
        return
      }

      try {
        const data = await getUniversitiesStats()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, t])

  const handleDownloadStatistics = async () => {
    try {
      const blob = await statisticsApi.exportStatistics()
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'statistics.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading statistics:', error)
    }
  }

  if (!user) return <p className="infoText">{t('unauthorized')}</p>
  if (loading) return <p className="infoText">{t('loading_stats')}</p>
  if (error) return <p className="infoText">{t('error_stats', { error })}</p>
  if (stats.length === 0) return <p className="infoText">{t('no_data')}</p>

  return (
    <div className="universitiesStatsContainer">
      <h2 className="universitiesStatsTitle">
        {t('universities_stats_title')}
      </h2>
      <div className="universitiesStatsTable">
        <div className="universitiesStatsHeader">
          <span>{t('university')}</span>
          <span>{t('students')}</span>
          <span>{t('directions')}</span>
          <span>{t('subjects')}</span>
          <span>{t('literature')}</span>
          <span>{t('accessibility_percent')}</span>
        </div>

        {stats.map((uni, idx) => (
          <div className="universitiesStatsRow" key={idx}>
            <span>{uni.university}</span>
            <span>{uni.total_students}</span>
            <span>{uni.total_directions}</span>
            <span>{uni.total_subjects}</span>
            <span>{uni.total_literature}</span>
            <span>{uni.percent_accessible}%</span>
          </div>
        ))}

        <button onClick={handleDownloadStatistics}>
          {t('download_excel')}
        </button>
      </div>
    </div>
  )
}

export default UniversitiesStats
