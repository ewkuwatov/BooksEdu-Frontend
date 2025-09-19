import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import subjectApi from '../../service/subjectsApi'
import kafedraApi from '../../service/kafedrasApi'
import univerApi from '../../service/univerApi'
import directionApi from '../../service/directionsApi'

const SubjectsAdmin = () => {
  const { user } = useContext(AuthContext)
  const [subjects, setSubjects] = useState([])
  const [kafedras, setKafedras] = useState([])
  const [university, setUniversity] = useState(null)
  const [directions, setDirections] = useState([])

  const [selectKafedra, setSelectKafedra] = useState('')
  const [openFilter, setOpenFilter] = useState(false)

  // форма добавления (массив до 10 элементов)
  const [subjectsForm, setSubjectsForm] = useState([
    { name: '', kafedra_id: '', direction_ids: [], university_id: '' },
  ])

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    kafedra_id: '',
    direction_ids: [],
  })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [subjectsData, kafedrasData, universityData, directionsData] =
          await Promise.all([
            subjectApi.getSubjectsByUniversity(user.university_id),
            kafedraApi.getKafedras(),
            univerApi.getUniversityById(user.university_id),
            directionApi.getDirections(),
          ])

        setSubjects(subjectsData)
        setKafedras(
          kafedrasData.filter((k) => k.university_id === user.university_id)
        )
        setUniversity(universityData)
        setDirections(
          directionsData.filter((d) => d.university_id === user.university_id)
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [user])

  const filteredKafedra = useMemo(() => {
    const kafId = parseInt(selectKafedra)
    return isNaN(kafId)
      ? subjects
      : subjects.filter((s) => s.kafedra_id === kafId)
  }, [subjects, selectKafedra])

  const getNameById = (list, id) => {
    const item = list.find((i) => i.id === id)
    return item ? item.name : '-'
  }

  const handleDeleteSubject = async (id) => {
    try {
      await subjectApi.deleteSubjects(id)
      setSubjects((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validSubjects = subjectsForm.filter((s) => s.name && s.kafedra_id)
    if (!validSubjects.length) {
      alert('Заполните хотя бы один предмет')
      return
    }

    const payload = validSubjects.map((s) => ({
      ...s,
      university_id: user.university_id,
    }))

    try {
      const created = await subjectApi.createSubjects(payload)
      setSubjects((prev) => [...prev, ...created])
      setSubjectsForm([
        { name: '', kafedra_id: '', direction_ids: [], university_id: '' },
      ])
    } catch (error) {
      console.error('Ошибка добавления:', error)
    }
  }

  const handleChange = (index, field, value) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const toggleDirection = (index, id) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              direction_ids: item.direction_ids.includes(id)
                ? item.direction_ids.filter((d) => d !== id)
                : [...item.direction_ids, id],
            }
          : item
      )
    )
  }

  // --- Добавить ещё одно поле предмета в форме ---
  const addSubjectField = () => {
    if (subjectsForm.length < 10) {
      setSubjectsForm((prev) => [
        ...prev,
        {
          name: '',
          kafedra_id: '',
          direction_ids: [],
          university_id: user.university_id,
        },
      ])
    }
  }


  const startEdit = (subject) => {
    setEditingId(subject.id)
    setEditForm({
      name: subject.name,
      kafedra_id: subject.kafedra_id,
      direction_ids: [...subject.direction_ids],
    })
  }

  const handleEditSubjects = async (id) => {
    try {
      const updated = await subjectApi.updateSubjects(id, {
        ...editForm,
        university_id: user.university_id, // ✅ обязателен для backend
      })

      setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)))
      setEditingId(null) // закрываем режим редактирования
    } catch (error) {
      console.error('Ошибка редактирования:', error)
    }
  }


  return (
    <>
      <h1>Subjects {university?.name}</h1>

      {/* --- Форма добавления нескольких предметов --- */}
      <form onSubmit={handleSubmit}>
        {subjectsForm.map((subj, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              border: '1px solid #ccc',
              padding: '10px',
            }}
          >
            <input
              type="text"
              placeholder="Название предмета"
              value={subj.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />

            <select
              value={subj.kafedra_id}
              onChange={(e) =>
                handleChange(index, 'kafedra_id', parseInt(e.target.value))
              }
            >
              <option value="">Выберите кафедру</option>
              {kafedras.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>

            <div>
              {directions.map((d) => (
                <label key={d.id}>
                  <input
                    type="checkbox"
                    checked={subj.direction_ids.includes(d.id)}
                    onChange={() => toggleDirection(index, d.id)}
                  />
                  {d.name}
                </label>
              ))}
            </div>
          </div>
        ))}

        {subjectsForm.length < 10 && (
          <button type="button" onClick={addSubjectField}>
            + Добавить ещё
          </button>
        )}

        <button type="submit">Сохранить</button>
      </form>

      {/* --- Фильтр кафедры --- */}
      <div onClick={() => setOpenFilter(!openFilter)}>
        {selectKafedra
          ? kafedras.find((k) => k.id === selectKafedra)?.name
          : 'All'}
      </div>

      {openFilter && (
        <ul>
          <li
            onClick={() => {
              setSelectKafedra(null)
              setOpenFilter(false)
            }}
          >
            All
          </li>
          {kafedras.map((k) => (
            <li
              key={k.id}
              onClick={() => {
                setSelectKafedra(k.id)
                setOpenFilter(false)
              }}
            >
              {k.name}
            </li>
          ))}
        </ul>
      )}

      {/* --- Таблица предметов --- */}
      <table border={1}>
        <thead>
          <tr>
            <th>Subjects</th>
            <th>Kafedras</th>
            <th>University</th>
            <th>Directions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredKafedra.map((s) => (
            <tr key={s.id}>
              <td>
                {editingId === s.id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  s.name
                )}
              </td>

              <td>
                {editingId === s.id ? (
                  <select
                    value={editForm.kafedra_id}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        kafedra_id: parseInt(e.target.value),
                      })
                    }
                  >
                    {kafedras.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  getNameById(kafedras, s.kafedra_id)
                )}
              </td>

              <td>{university?.name}</td>

              <td>
                {editingId === s.id
                  ? directions.map((d) => (
                      <label key={d.id}>
                        <input
                          type="checkbox"
                          checked={editForm.direction_ids.includes(d.id)}
                          onChange={() => {
                            setEditForm((prev) => ({
                              ...prev,
                              direction_ids: prev.direction_ids.includes(d.id)
                                ? prev.direction_ids.filter((x) => x !== d.id)
                                : [...prev.direction_ids, d.id],
                            }))
                          }}
                        />
                        {d.name}
                      </label>
                    ))
                  : s.direction_ids
                      .map((id) => getNameById(directions, id))
                      .join(', ')}
              </td>

              <td>
                {editingId === s.id ? (
                  <>
                    <button onClick={() => handleEditSubjects(s.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(s)}>Edit</button>
                    <button onClick={() => handleDeleteSubject(s.id)}>
                      Del
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default SubjectsAdmin
