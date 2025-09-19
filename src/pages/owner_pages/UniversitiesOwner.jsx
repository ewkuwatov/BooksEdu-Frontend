import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import univerApi from '../../service/univerApi'
import '../../styles/AdminStyle/UniversitiesAdmin.css'

import { UniverAddress } from '../../constants/enums'
import Dropdown from '../../components/Dropdown'
import { Trash, Pencil } from 'lucide-react'

const UniversitiesAdmin = () => {
  const { user, accessToken } = useContext(AuthContext)

  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [openedUniverform, setOpenedUniverform] = useState(false)
  const [openedUniverId, setOpenedUniverId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const [newUniver, setNewUniver] = useState(initialUniver())
  const [openDropdown, setOpenDropdown] = useState({ address: false })

  // === ХЕЛПЕРЫ ===
  function initialUniver() {
    return {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      location: '',
    }
  }

  const resetForm = () => {
    setNewUniver(initialUniver())
    setEditingId(null)
    setOpenedUniverform(false)
  }

  // === ЗАГРУЗКА ===
  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError(null)

    univerApi
      .getUniversities(accessToken)
      .then((data) => setUniversities(data))
      .catch(() => setError('Ошибка при загрузке университетов'))
      .finally(() => setLoading(false))
  }, [user, accessToken])

  // === CRUD ===
  const addUniver = async (e) => {
    e.preventDefault()
    if (!newUniver.name.trim()) return

    try {
      const created = await univerApi.createUniversity(newUniver, accessToken)
      setUniversities((prev) => [...prev, created])

      // очищаем только поля, а форму не закрываем
      setNewUniver(initialUniver())
      setEditingId(null)
    } catch {
      setError('Ошибка при добавлении университета')
    }
  }

  const removeUniver = async (id) => {
    try {
      await univerApi.deleteUniversity(id)
      setUniversities((prev) => prev.filter((u) => u.id !== id))
      if (openedUniverId === id) setOpenedUniverId(null)
    } catch {
      setError('Ошибка при удалении университета')
    }
  }

  const startEditing = (u) => {
    setEditingId(u.id)
    setNewUniver({ ...u })
    setOpenedUniverform(true)
    setOpenedUniverId(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingId) return

    try {
      const updated = await univerApi.updateUniversity(
        editingId,
        newUniver,
        accessToken
      )
      setUniversities((prev) =>
        prev.map((u) => (u.id === editingId ? updated : u))
      )
      resetForm()
    } catch {
      setError('Ошибка при обновлении университета')
    }
  }

  const toggleUniverInfo = (id) => {
    setOpenedUniverId((prev) => (prev === id ? null : id))
  }

  // === UI ===
  if (loading) return <p>Загрузка университетов...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="universities-admin">
      <h2>University</h2>

      <button
        className="toggle-form-btn"
        onClick={() => {
          setOpenedUniverform((prev) => !prev)
          setOpenedUniverId(null)
          setEditingId(null)
          setNewUniver(initialUniver())
        }}
      >
        {openedUniverform ? 'Close form' : 'Add New University'}
      </button>

      {openedUniverform && (
        <div className="modal-overlay">
          <div className="modal">
            <form
              onSubmit={editingId ? handleUpdate : addUniver}
              className="univer-form"
            >
              <input
                type="text"
                placeholder="Название"
                value={newUniver.name}
                onChange={(e) =>
                  setNewUniver({ ...newUniver, name: e.target.value })
                }
                required
              />

              <Dropdown
                label="Адрес"
                value={newUniver.address}
                options={Object.values(UniverAddress).map((label) => ({
                  value: label,
                  label: label,
                }))}
                onSelect={(val) =>
                  setNewUniver((prev) => ({ ...prev, address: val }))
                }
                openKey="address"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />

              <input
                type="text"
                placeholder="Описание"
                value={newUniver.description}
                onChange={(e) =>
                  setNewUniver({ ...newUniver, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Телефон"
                value={newUniver.phone}
                onChange={(e) =>
                  setNewUniver({ ...newUniver, phone: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={newUniver.email}
                onChange={(e) =>
                  setNewUniver({ ...newUniver, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Локация"
                value={newUniver.location}
                onChange={(e) =>
                  setNewUniver({ ...newUniver, location: e.target.value })
                }
              />

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
        </div>
      )}

      {universities.length === 0 ? (
        <p>Университеты не найдены</p>
      ) : (
        <ul className="univer-list">
          {universities.map((u) => (
            <li key={u.id}>
              <div className="univer-header">
                <strong
                  onClick={() => toggleUniverInfo(u.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {u.name}
                </strong>
                <button
                  aria-label="Удалить университет"
                  onClick={() => removeUniver(u.id)}
                >
                  <Trash />
                </button>
              </div>
              {openedUniverId === u.id && (
                <div className="univer-info">
                  <header className="univer-header">
                    <h3>{u.name}</h3>
                    <div className="univer-actions">
                      <button onClick={() => startEditing(u)}>
                        <Pencil /> Edit
                      </button>
                      <button onClick={() => setOpenedUniverId(null)}>
                        ← Back
                      </button>
                    </div>
                  </header>

                  <section className="univer-details">
                    <div className="detail-item">
                      <span className="label">Описание:</span>
                      <span className="value">{u.description}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Адрес:</span>
                      <span className="value">{u.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Телефон:</span>
                      <span className="value">{u.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value">{u.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Локация:</span>
                      <span className="value">{u.location}</span>
                    </div>
                  </section>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UniversitiesAdmin
