import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import adminApi from '../../service/adminApi'
import univerApi from '../../service/univerApi'
import { Trash, Pencil } from 'lucide-react'

import '../../styles/AdminStyle/AdminsOwner.css'

const AdminsOwner = () => {
  const { user, accessToken } = useContext(AuthContext)
  const [admins, setAdmins] = useState([])
  const [universities, setUniversities] = useState([])

  const [openedAdminform, setOpenedAdminform] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedUniver, setSelectedUniver] = useState('')

  const [formAdmin, setFormAdmin] = useState({
    email: '',
    role: 'superadmin',
    university_id: '',
    password: '',
  })

  useEffect(() => {
    if (!user) return

    const fetchAdmins = async () => {
      try {
        const [adminsData, universitiesData] = await Promise.all([
          adminApi.getAdmins(accessToken),
          univerApi.getUniversities(accessToken),
        ])
        setAdmins(adminsData)
        setUniversities(universitiesData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAdmins()
  }, [user, accessToken])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (!formAdmin.email.trim() || !formAdmin.password.trim()) return

    try {
      const created = await adminApi.createAdmin(formAdmin, accessToken)
      setAdmins((prev) => [...prev, created])
      setFormAdmin({
        email: '',
        role: 'superadmin',
        university_id: '',
        password: '',
      })
      setEditingId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteAdmin(id)
      setAdmins((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const getUniverName = (id) => {
    const univer = universities.find((u) => u.id === id)
    return univer ? univer.name : '—'
  }

  const startEditing = (a) => {
    setEditingId(a.id)
    setFormAdmin({
      email: a.email,
      role: a.role,
      university_id: a.university_id,
      password: '',
    })
    setOpenedAdminform(true)
  }

  const handleEditAdmin = async (e) => {
    e.preventDefault()
    if (!editingId) return

    try {
      const updated = await adminApi.updateAdmin(
        editingId,
        formAdmin,
        accessToken
      )
      setAdmins((prev) => prev.map((a) => (a.id === editingId ? updated : a)))
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormAdmin({
      email: '',
      role: 'superadmin',
      university_id: '',
      password: '',
    })
    setEditingId(null)
    setOpenedAdminform(false)
  }

  const filteredAdmins = selectedUniver
    ? admins.filter((a) => a.university_id === parseInt(selectedUniver))
    : admins

  return (
    <div className="admins-container">
      <h1 className="admins-title">Администраторы</h1>

      <button
        className="toggle-form-btn"
        onClick={() => {
          setOpenedAdminform((prev) => !prev)
          setEditingId(null)
        }}
      >
        {openedAdminform ? 'Закрыть форму' : 'Добавить администратора'}
      </button>

      {openedAdminform && (
        <div className="form-container">
          <form
            className="admin-form"
            onSubmit={editingId ? handleEditAdmin : handleAddAdmin}
          >
            <input
              type="text"
              placeholder="Email"
              value={formAdmin.email}
              onChange={(e) =>
                setFormAdmin({ ...formAdmin, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={formAdmin.password}
              onChange={(e) =>
                setFormAdmin({ ...formAdmin, password: e.target.value })
              }
              required={!editingId}
            />

            <select
              value={formAdmin.role}
              onChange={(e) =>
                setFormAdmin({ ...formAdmin, role: e.target.value })
              }
            >
              <option value="superadmin">Superadmin</option>
              <option value="owner">Owner</option>
            </select>

            <select
              value={formAdmin.university_id}
              onChange={(e) =>
                setFormAdmin({ ...formAdmin, university_id: e.target.value })
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
            value={selectedUniver}
            onChange={(e) => setSelectedUniver(e.target.value)}
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

      <table className="admins-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>University</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((a) => (
            <tr key={a.id}>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>{getUniverName(a.university_id)}</td>
              <td>
                <button className="edit-btn" onClick={() => startEditing(a)}>
                  <Pencil />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(a.id)}
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

export default AdminsOwner
