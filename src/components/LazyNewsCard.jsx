import { useEffect, useRef, useState } from 'react'

const LazyNewsCard = ({ img, date, title, description, big }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target) // перестаём следить
          }
        })
      },
      { threshold: 0.2 } // 20% карточки в зоне видимости
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`newsCard ${big ? 'big' : ''}`}
      style={{
        backgroundImage: isVisible ? `url(${img})` : 'none',
        backgroundColor: '#e0e0e0', // серый фон-заглушка
      }}
    >
      <div className="newsDate">
        <span>{date}</span>
      </div>
      <div className={`newsInfo ${big ? 'bigNews' : ''}`}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default LazyNewsCard
