import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import newsApi from '../../service/newsApi'

const NewsAdmin = () => {
  const { user } = useContext(AuthContext)
  const [news, setNews] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    university_id: user.university_id,
    img: null,
    tags: [],
  })

  const [tagsInput, setTagsInput] = useState('')
  const [file, setFile] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchApi = async () => {
      try {
        const data = await newsApi.getNews()
        const filter = data.filter(
          (n) => n.university_id === user.university_id
        )
        setNews(Array.isArray(filter) ? filter : [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchApi()
  }, [user])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      university_id: user.university_id,
      img: null,
      tags: [],
    })
    setTagsInput('')
    setFile(null)
  }

  const handleTagsChange = (e) => {
    setTagsInput(e.target.value)
    const tagsArr = e.target.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    setForm({ ...form, tags: tagsArr })
  }

  const handleAddNews = async (e) => {
    e.preventDefault()
    if (form.title.trim() === '') return

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('university_id', form.university_id)
      if (file) {
        formData.append('img', file)
      }
      form.tags.forEach((tag) => formData.append('tags', tag))

      const createNews = await newsApi.createNews(formData)
      setNews((prev) => [createNews, ...prev])
      setFile(null)
      setOpenForm(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteNews = async (id) => {
    try {
      await newsApi.deleteNews(id)
      setNews((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const startEditing = (n) => {
    setEditingId(n.id)
    setForm({
      title: n.title,
      description: n.description,
      img: n.image,
      tags: n.tags ? n.tags.map((t) => t.name) : [],
    })
    setTagsInput(n.tags ? n.tags.map((t) => t.name).join(', ') : '')
    setOpenForm(true)
  }

  const handleEditNews = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      if (file) {
        formData.append('img', file)
      }
      form.tags.forEach((tag) => formData.append('tags', tag))

      const updated = await newsApi.updateNews(editingId, formData)
      setNews((prev) => prev.map((n) => (n.id === editingId ? updated : n)))
      setEditingId(null)
      setOpenForm(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="news-conatainer">
      <h2>News</h2>
      {openForm ? (
        <div className="form-conatiner">
          <form onSubmit={editingId ? handleEditNews : handleAddNews}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <input
              type="text"
              placeholder="Введите теги через запятую"
              value={tagsInput}
              onChange={handleTagsChange}
            />
            <button type="submit">
              {editingId ? 'Edit News' : 'Add News'}
            </button>
            <button type="button" onClick={() => setOpenForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setOpenForm(true)
              resetForm()
            }}
          >
            Add News
          </button>
          <ul>
            {news.length === 0
              ? 'Нет новостей'
              : news.map((n) => (
                  <li key={n.id}>
                    <span onClick={() => startEditing(n)}>{n.title}</span>
                    {n.tags && n.tags.length > 0 && (
                      <small>
                        | Tags: {n.tags.map((t) => t.name).join(', ')}
                      </small>
                    )}
                    <button onClick={() => handleDeleteNews(n.id)}>
                      delete
                    </button>
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NewsAdmin
