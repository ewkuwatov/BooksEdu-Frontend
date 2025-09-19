import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import univerApi from '../../service/univerApi'

const UniversityAdmin = () => {
  const { user } = useContext(AuthContext)
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    location: '',
  })

  useEffect(() => {
    if (!user?.university_id) return

    const fetchUniversity = async () => {
      try {
        const data = await univerApi.getUniversityById(user.university_id)
        setUniversity(data)
        setForm({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUniversity()
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const updated = await univerApi.updateUniversity(user.university_id, form)
      setUniversity(updated)
      setEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!university) return <p>University not found</p>

  return (
    <div className="universities-admin">
      <h1>University Info</h1>
      {!editing ? (
        <div>
          <p>
            <strong>Name:</strong> {university.name}
          </p>
          <p>
            <strong>Description:</strong> {university.description}
          </p>
          <p>
            <strong>Address:</strong> {university.address}
          </p>
          <p>
            <strong>Email:</strong> {university.email}
          </p>
          <p>
            <strong>Phone:</strong> {university.phone}
          </p>
          <p>
            <strong>Location:</strong> {university.location}
          </p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      ) : (
        <div className="form-container">
          <form className="univer-form" onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Loacation"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default UniversityAdmin
