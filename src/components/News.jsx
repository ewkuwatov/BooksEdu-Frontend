import '../styles/News.css'

const News = ({ page }) => {
  return (
    <div className="news-container">
      <h2>{page.title}</h2>

      {page.image && <img src={page.image} alt={page.title} />}

      <div
        className="news-description ql-editor"
        dangerouslySetInnerHTML={{ __html: page.description }}
      />
    </div>
  )
}

export default News
