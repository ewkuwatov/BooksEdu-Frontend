import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import kafedraApi from '../../service/kafedrasApi'
import univerApi from '../../service/univerApi'

const KafedraOwner = () => {
  const { user, accessToken } = useContext(AuthContext)
  const [kafedras, setKafedras] = useState([])
  const [universities, setUniversities] = useState([])
  const [openedKafedraForm, setOpenedKafedraForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [kafedraForm, setKafedraForm] = useState({
    name: '',
    university_id: '',
  })

  const [selectUniver, setSelectUniver] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchKaedras = async () => {
      try {
        const [kafedrasData, UniversitiesData] = await Promise.all([
          kafedraApi.getKafedras(accessToken),
          univerApi.getUniversities(accessToken),
        ])
        setKafedras(kafedrasData)
        setUniversities(UniversitiesData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchKaedras()
  }, [user, accessToken])

  const getUniverName = (id) => {
    const univer = universities.find((u) => u.id === id)
    return univer ? univer.name : '-'
  }

  const filterKafedras = selectUniver
    ? kafedras.filter((k) => k.university_id === parseInt(selectUniver))
    : kafedras

  const resetForm = () => {
    setKafedraForm({
      name: '',
      university_id: '',
    })
  }

  const openKafedra = () => {
    setOpenedKafedraForm((prev) => !prev)
  }

  const handleAddKafedras = async (e) => {
    e.preventDefault()
    if (
      kafedraForm.name.trim() === '' ||
      kafedraForm.university_id.trim() === ''
    )
      return

    try {
      const created = await kafedraApi.createKafedras(kafedraForm, accessToken)
      setKafedras((prev) => [...prev, created])
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteKafedras = async (id) => {
    try {
      await kafedraApi.deleteKafedras(id, accessToken)
      setKafedras((prevKaf) => prevKaf.filter((k) => k.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const startEditing = (k) => {
    setEditingId(k.id)
    setKafedraForm({
      name: k.name,
      university_id: k.university_id,
    })
    setOpenedKafedraForm(true)
  }

  const handleEditKafedra = async (e) => {
    e.preventDefault()
    if (
      kafedraForm.name.trim() === '' ||
      kafedraForm.university_id.trim() === ''
    )
      return

    try {
      const updated = await kafedraApi.updateKafedras(
        editingId,
        kafedraForm,
        accessToken
      )
      setKafedras((prevKaf) =>
        prevKaf.map((k) => (k.id === editingId ? updated : k))
      )
      setOpenedKafedraForm(false)
      setEditingId(null)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="kafedra-admin">
      <h2>Kafedras</h2>
      <button className="primary-btn" onClick={openKafedra}>
        {openedKafedraForm ? 'Close Form' : 'Add Kafedra'}
      </button>

      {openedKafedraForm && (
        <div className="form-container">
          <form
            className="kafedra-form"
            onSubmit={editingId ? handleEditKafedra : handleAddKafedras}
          >
            <input
              type="text"
              placeholder="Kafedra name"
              value={kafedraForm.name}
              onChange={(e) =>
                setKafedraForm({ ...kafedraForm, name: e.target.value })
              }
            />
            <select
              value={kafedraForm.university_id}
              onChange={(e) =>
                setKafedraForm({
                  ...kafedraForm,
                  university_id: e.target.value,
                })
              }
            >
              <option value="">Select University</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <button className="success-btn" type="submit">
              {editingId ? 'Save' : 'Add'}
            </button>
            <button type="button" onClick={() => setOpenedKafedraForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="filter-block">
        <label>
          University:{' '}
          <select
            value={selectUniver}
            onChange={(e) => setSelectUniver(e.target.value)}
          >
            <option value="">All</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table className="kafedra-table">
        <thead>
          <tr>
            <th>Kafedra</th>
            <th>University</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filterKafedras.map((k) => (
            <tr key={k.id}>
              <td>{k.name}</td>
              <td>{getUniverName(k.university_id)}</td>
              <td>
                <button className="edit-btn" onClick={() => startEditing(k)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteKafedras(k.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default KafedraOwner
