import { useContext, useEffect, useState } from 'react'
import univerApi from '../service/univerApi'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import logo from '../assets/logo.png'
import '../styles/Universities.css'
import '../styles/UniversitiesUser.css'

const UniversityUser = () => {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const [univer, setUniver] = useState([])

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const univerData = await univerApi.getUniversities()
        setUniver(univerData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [user])

  if (!univer || univer.length === 0) return null

  // Берём последние 6
  const latestUniversities = univer.slice(-6).reverse()

  return (
    <div className="university">
      <h2>{t('universities')}</h2>
      <div className="univer-container">
        <div className="univerCard">
          {latestUniversities.map((u) => (
            <article className="card" key={u.id}>
              <div className="cardHead">
                <img src={logo} alt={`${u.name} logo`} />
                <div className="univerName">
                  <strong>{u.name}</strong>
                  <p>{u.address}</p>
                </div>
              </div>
              <div className="cardBody">
                <p className="univerDescrip">{u.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="moreUnivers">
          <Link to="/universities" className="moreBtn">
            {t('directions')} {/* Здесь можно выбрать подходящий ключ */}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UniversityUser
