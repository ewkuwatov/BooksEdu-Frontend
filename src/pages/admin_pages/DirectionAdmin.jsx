import { useEffect, useState, useContext } from 'react'
import directionApi from '../../service/directionsApi'
import univerApi from '../../service/univerApi'
import { AuthContext } from '../../context/AuthContext'


const DirectionAdmin = () => {
  const { user } = useContext(AuthContext)

  const [directions, setDirections] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [course, setCourse] = useState('')
  const [student, setStudent] = useState('')
  const [adding, setAdding] = useState(false)

  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (!user) return
    const fetchDirections = async () => {
      try {
        const [directionsData, universitiesData] = await Promise.all([
          directionApi.getDirections(),
          univerApi.getUniversities(),
        ])
        setUniversities(universitiesData)
        const filtered = directionsData.filter(
          (d) => d.university_id === user.university_id
        )
        setDirections(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDirections()
  }, [user])

  const getNameById = (list, id) => {
    const item = list.find((i) => i.id === id)
    return item ? item.name : '-'
  }

  const handleAddDirection = async (e) => {
    e.preventDefault()
    if (!name.trim() || !number.trim() || !course.trim()) return
    setAdding(true)
    try {
      const payload = {
        name: name.trim(),
        number: number.trim(),
        course: Number(course),
        student_count: student ? Number(student) : 0,
      }
      const created = await directionApi.createDirection(payload)
      setDirections((prev) => [...prev, created])
      setName('')
      setNumber('')
      setCourse('')
      setStudent('')
    } catch (err) {
      console.error('Error adding direction:', err)
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteDirection = async (id) => {
    try {
      await directionApi.deleteDirection(id)
      setDirections((prevDir) => prevDir.filter((d) => d.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const startEditing = (d) => {
    setEditingId(d.id)
    setName(d.name)
    setNumber(d.number)
    setCourse(d.course)
    setStudent(d.student_count)
    setOpenForm(true)
  }

  const handleEditDirection = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: name.trim(),
        number: number.trim(),
        course: Number(course),
        student_count: student ? Number(student) : 0,
      }
      const updated = await directionApi.updateDirection(editingId, payload)
      setDirections((prevDir) =>
        prevDir.map((d) => (d.id === editingId ? updated : d))
      )
      setEditingId(null)
      setOpenForm(false)
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="direction-admin">
      <h1 className="univer-title">
        🎓 {getNameById(universities, user?.university_id)}
      </h1>

      {!openForm && (
        <button className="add-btn" onClick={() => setOpenForm(true)}>
          Add Direction
        </button>
      )}

      {openForm && (
        <form
          className="direction-form"
          onSubmit={editingId ? handleEditDirection : handleAddDirection}
        >
          <input
            type="text"
            placeholder="Direction Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            type="text"
            placeholder="Students"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
          />

          <div className="form-actions">
            <button type="submit" disabled={adding}>
              {editingId
                ? '💾 Save Changes'
                : adding
                ? 'Adding...'
                : '✅ Add Direction'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setOpenForm(false)}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table className="direction-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Course</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {directions.map((d) => (
              <tr key={d.id}>
                <td>{d.number}</td>
                <td>{d.name}</td>
                <td>{d.course}</td>
                <td>{d.student_count}</td>
                <td className="table-actions">
                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => handleDeleteDirection(d.id)}
                  >
                    🗑
                  </button>
                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() => startEditing(d)}
                  >
                    ✏
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DirectionAdmin
