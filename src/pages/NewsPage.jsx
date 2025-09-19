import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import newsApi from '../service/newsApi'
import News from '../components/News'
import '../styles/NewsPage.css'

const NewsPage = () => {
  const { id } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await newsApi.getNews()
        const found = data.find((n) => String(n.id) === String(id))
        setPage(found)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchApi()
  }, [id])

  if (loading) return <p>Загрузка...</p>
  if (!page) return <p>Новость не найдена</p>

  return (
    <div className="newsPage-container">
      <News page={page} />
    </div>
  )
}

export default NewsPage
