import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import newsApi from '../../service/newsApi'
import univerApi from '../../service/univerApi'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

// ✅ фикс для списков и текста
const quillFix = `
  .ql-editor ol {
    list-style-type: decimal !important;
    margin-left: 20px;
  }
  .ql-editor ul {
    list-style-type: disc !important;
    margin-left: 20px;
  }
  .ql-editor li {
    margin: 4px 0;
  }
`

const NewsOwner = () => {
  const { user } = useContext(AuthContext)
  const [news, setNews] = useState([])
  const [universities, setUniversities] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    university_id: '',
    img: null,
    tags: [],
  })

  const [tagsInput, setTagsInput] = useState('')
  const [file, setFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchApi = async () => {
      const [newsData, universityData] = await Promise.all([
        newsApi.getNews(),
        univerApi.getUniversities(),
      ])
      setNews(Array.isArray(newsData) ? newsData : [])
      setUniversities(Array.isArray(universityData) ? universityData : [])
    }
    fetchApi()
  }, [user])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      university_id: '',
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
      if (file) formData.append('img', file)
      form.tags.forEach((tag) => formData.append('tags', tag))

      const createNews = await newsApi.createNews(formData)
      setNews((prev) => [createNews, ...prev])
      resetForm()
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
      university_id: n.university_id,
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
      formData.append('university_id', form.university_id)
      if (file) formData.append('img', file)
      form.tags.forEach((tag) => formData.append('tags', tag))

      const updated = await newsApi.updateNews(editingId, formData)
      setNews((prev) => prev.map((n) => (n.id === editingId ? updated : n)))
      resetForm()
      setEditingId(null)
      setOpenForm(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="news-conatainer">
      <style>{quillFix}</style>

      <h2>News</h2>
      {openForm ? (
        <div className="form-conatiner">
          <form onSubmit={editingId ? handleEditNews : handleAddNews}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Заголовок"
            />
            <ReactQuill
              theme="snow"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ color: [] }, { background: [] }], // 👈 добавили
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />

            <select
              value={form.university_id}
              onChange={(e) =>
                setForm({ ...form, university_id: e.target.value })
              }
            >
              <option value="">Выберите университет</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

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
            <button
              type="button"
              onClick={() => {
                resetForm()
                setEditingId(null)
                setOpenForm(false)
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="news-list">
          <button
            onClick={() => {
              resetForm()
              setEditingId(null)
              setOpenForm(true)
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

export default NewsOwner
