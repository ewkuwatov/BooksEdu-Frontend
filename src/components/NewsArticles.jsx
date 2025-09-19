import '../styles/NewsArticles.css'
import { AuthContext } from '../context/AuthContext'
import { ChevronRight, ChevronLeft, CircleChevronRight } from 'lucide-react'
import { useContext, useEffect, useState, useMemo } from 'react'
import newsApi, { getImageUrl } from '../service/newsApi'
import { Link } from 'react-router-dom'

// ✅ фикс для форматированного текста
const articleFix = `
  .newsInfo ol {
    list-style-type: decimal !important;
    margin-left: 20px;
  }
  .newsInfo ul {
    list-style-type: disc !important;
    margin-left: 20px;
  }
  .newsInfo li {
    margin: 4px 0;
  }
`

const NewsArticles = () => {
  const { user } = useContext(AuthContext)
  const [news, setNews] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchApi = async () => {
      try {
        const data = await newsApi.getNews()
        setNews(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchApi()
  }, [user])

  const sortedNews = useMemo(
    () =>
      [...news].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [news]
  )

  const featuredNews = sortedNews[0] || null
  const latestNews = sortedNews.slice(1, 6)
  const mobileLatestNews = sortedNews.slice(0, 6)

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % mobileLatestNews.length)
  }
  const handlePrev = () => {
    setIndex(
      (prev) => (prev - 1 + mobileLatestNews.length) % mobileLatestNews.length
    )
  }

  if (loading) return <div className="newsArticles">Загрузка...</div>
  if (news.length === 0) return <div className="newsArticles">Нет новостей</div>

  return (
    <div className="newsArticles">
      <style>{articleFix}</style>
      <h2>Новости и статьи</h2>

      <div className="newsContainer">
        {featuredNews && (
          <Link to={`news/${featuredNews.id}`} className="lastNews">
            <div
              className="newsCard big"
              style={{
                backgroundImage: `url(${getImageUrl(featuredNews.img)})`,
              }}
            >
              <div className="newsDate">
                <span>
                  {new Date(featuredNews.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="newsInfo bigNews">
                <h3>{featuredNews.title}</h3>
              </div>
            </div>
          </Link>
        )}

        <div className="otherNews">
          <div className="newsGrid">
            {latestNews.map((n) => (
              <Link
                to={`news/${n.id}`}
                key={n.id}
                className="newsCard"
                style={{
                  backgroundImage: `url(${getImageUrl(n.img)})`,
                }}
              >
                <div className="newsDate">
                  <span>{new Date(n.date).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="newsInfo">
                  <h3>{n.title}</h3>
                </div>
              </Link>
            ))}
            <Link className="moreNews" to="/news">
              <p>
                More <CircleChevronRight />
              </p>
            </Link>
          </div>

          {mobileLatestNews.length > 0 && (
            <div className="newsSliderMobile">
              <div
                className="newsCard"
                style={{
                  backgroundImage: `url(${getImageUrl(
                    mobileLatestNews[index].img
                  )})`,
                }}
              >
                <div className="newsDate">
                  <span>
                    {new Date(mobileLatestNews[index].date).toLocaleDateString(
                      'ru-RU'
                    )}
                  </span>
                </div>
                <div className="sliderControls">
                  <button onClick={handlePrev}>
                    <ChevronLeft color="#ffffff" />
                  </button>
                  <button onClick={handleNext}>
                    <ChevronRight color="#ffffff" />
                  </button>
                </div>
                <div className="newsInfo">
                  <h3>{mobileLatestNews[index].title}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsArticles
