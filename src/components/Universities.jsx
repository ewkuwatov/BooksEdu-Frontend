import React, { useEffect, useState, useContext } from 'react'
import { useOutletContext } from 'react-router-dom' // <--- используем
import { AuthContext } from '../context/AuthContext'
import univerApi from '../service/univerApi'
import { getUniversitiesStats } from '../service/statsUniverApi'

import '../styles/Universities.css'
import logo from '../assets/logo.png'

const Universities = () => {
  const { user } = useContext(AuthContext)
  const [universities, setUniversities] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Получаем выбранные регионы из UserLayout
  const { selectedRegions } = useOutletContext()

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError(null)

    const fetchUniversities = async () => {
      try {
        let data = []

        if (user.role === 'superadmin') {
          if (!user.university_id) {
            setError('Не указан university_id для superadmin')
            return
          }
          data = await univerApi.getUniversities(user.token)
          const dataSt = await getUniversitiesStats()
          setStats(dataSt)
        } else if (user.role === 'owner') {
          data = await univerApi.getUniversities(user.token)
          const dataSt = await getUniversitiesStats()
          setStats(dataSt)
        } else if (user.role === 'user') {
          data = await univerApi.getUniversities(user.token)
          const dataSt = await getUniversitiesStats()
          setStats(dataSt)
        } else {
          setError('Доступ запрещён для этой роли')
          return
        }

        setUniversities(data)
      } catch (err) {
        console.error(err)
        setError('Ошибка при загрузке университетов')
      } finally {
        setLoading(false)
      }
    }

    fetchUniversities()
  }, [user])

  if (!user) return <p>Пользователь не авторизован</p>
  if (loading) return <p>Загрузка университетов...</p>
  if (error) return <p>{error}</p>

  // Фильтрация по выбранным регионам
  const filteredUniversities =
    selectedRegions && selectedRegions.length > 0
      ? universities.filter((u) => selectedRegions.includes(u.address))
      : universities

  // Пагинация
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentUniversities = filteredUniversities.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <section className="universities">
      <div className="univerCards">
        {currentUniversities.map((u) => (
          <div className="card" key={u.id}>
            <div className="cardHead">
              <img src={logo} alt="LogoUniver" />
              <div className="univerName">
                <strong>{u.name}</strong>
                <p>{u.address}</p>
              </div>
            </div>

            <div className="cardBody">
              <p className="univerDescrip">{u.description}</p>
              {stats
                .filter((s) => s.university === u.name)
                .map((s, idx) => (
                  <div className="univerStats" key={idx}>
                    <p>
                      <span>Description: </span>
                      {s.total_directions}
                    </p>
                    <p>
                      <span>Students: </span>
                      {s.total_students}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default Universities
