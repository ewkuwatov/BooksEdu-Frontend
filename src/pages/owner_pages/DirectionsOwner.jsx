import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import directionApi from '../../service/directionsApi'
import univerApi from '../../service/univerApi'
import { Trash, Pencil } from 'lucide-react'

const DirectionsOwner = () => {
  const { user, accessToken } = useContext(AuthContext)
  const [directions, setDirections] = useState([])
  const [universities, setUniversities] = useState([])

  const [selectUniver, setSelectUniver] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [openedDirForm, setOpenedDirForm] = useState(false)

  const [directionsForm, setDirectionsForm] = useState({
    name: '',
    number: '',
    course: '',
    student_count: '',
    university_id: '',
  })

  useEffect(() => {
    if (!user) return

    const fetchDirections = async () => {
      try {
        const [directionsData, universitiesData] = await Promise.all([
          directionApi.getDirections(accessToken),
          univerApi.getUniversities(accessToken),
        ])
        setDirections(directionsData)
        setUniversities(universitiesData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchDirections()
  }, [user, accessToken])

  const getUniverName = (id) => {
    const univer = universities.find((u) => u.id === id)
    return univer ? univer.name : '-'
  }

  const filterDirections = selectUniver
    ? directions.filter((d) => d.university_id === parseInt(selectUniver))
    : directions

  const handleAddDirections = async (e) => {
    e.preventDefault()
    if (!directionsForm.number.trim() || !directionsForm.name.trim()) return

    try {
      const created = await directionApi.createDirection(
        directionsForm,
        accessToken
      )
      setDirections((prev) => [...prev, created])
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteDirection = async (id) => {
    try {
      await directionApi.deleteDirection(id, accessToken)
      setDirections((prevDir) => prevDir.filter((d) => d.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const startEditing = (d) => {
    setEditingId(d.id)
    setDirectionsForm({
      name: d.name,
      number: d.number,
      course: d.course,
      student_count: d.student_count,
      university_id: d.university_id,
    })
    setOpenedDirForm(true)
  }

  const resetForm = () => {
    setDirectionsForm({
      name: '',
      number: '',
      course: '',
      student_count: '',
      university_id: '',
    })
    setEditingId(null)
    setOpenedDirForm(false)
  }

  const handleEditDirection = async (e) => {
    e.preventDefault()
    if (!directionsForm.number.trim() || !directionsForm.name.trim()) return
    try {
      const updated = await directionApi.updateDirection(
        editingId,
        directionsForm,
        accessToken
      )
      setDirections((prevDir) =>
        prevDir.map((d) => (d.id === editingId ? updated : d))
      )
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="directions-container">
      <h1 className="directions-title">Направления</h1>

      <button
        className="toggle-form-btn"
        onClick={() => {
          setOpenedDirForm((prev) => !prev)
          setEditingId(null)
        }}
      >
        {openedDirForm ? 'Закрыть форму' : 'Добавить направление'}
      </button>

      {openedDirForm && (
        <div className="modal-overlay">
          <form
            className="directions-form"
            onSubmit={editingId ? handleEditDirection : handleAddDirections}
          >
            <input
              placeholder="Номер"
              value={directionsForm.number}
              onChange={(e) =>
                setDirectionsForm({ ...directionsForm, number: e.target.value })
              }
              required
            />
            <input
              placeholder="Название"
              value={directionsForm.name}
              onChange={(e) =>
                setDirectionsForm({ ...directionsForm, name: e.target.value })
              }
              required
            />
            <input
              placeholder="Курс"
              value={directionsForm.course}
              onChange={(e) =>
                setDirectionsForm({ ...directionsForm, course: e.target.value })
              }
            />
            <input
              placeholder="Количество студентов"
              value={directionsForm.student_count}
              onChange={(e) =>
                setDirectionsForm({
                  ...directionsForm,
                  student_count: e.target.value,
                })
              }
            />
            <select
              value={directionsForm.university_id}
              onChange={(e) =>
                setDirectionsForm({
                  ...directionsForm,
                  university_id: Number(e.target.value),
                })
              }
            >
              <option value="">Выберите университет</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="form-actions">
              <button type="submit">
                {editingId ? 'Сохранить изменения' : 'Добавить'}
              </button>
              <button type="button" onClick={resetForm}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-block">
        <label>
          Фильтр по университету:{' '}
          <select
            value={selectUniver}
            onChange={(e) => setSelectUniver(e.target.value)}
          >
            <option value="">Все</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table className="directions-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Номер</th>
            <th>Курс</th>
            <th>Студенты</th>
            <th>Университет</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filterDirections.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.number}</td>
              <td>{d.course}</td>
              <td>{d.student_count}</td>
              <td>{getUniverName(d.university_id)}</td>
              <td>
                <button className="edit-btn" onClick={() => startEditing(d)}>
                  <Pencil />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteDirection(d.id)}
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DirectionsOwner
