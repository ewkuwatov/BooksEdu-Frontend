import { useContext, useEffect, useState, useMemo } from 'react'
import { AuthContext } from '../../context/AuthContext'
import kafedraApi from '../../service/kafedrasApi'
import subjectApi from '../../service/subjectsApi'
import univerApi from '../../service/univerApi'
import directionApi from '../../service/directionsApi'
import '../../styles/AdminStyle/subjectsOwner.css'

const SubjectsOwner = () => {
  const { user } = useContext(AuthContext)

  const [subjects, setSubjects] = useState([])
  const [kafedras, setKafedras] = useState([])
  const [universities, setUniversities] = useState([])
  const [directions, setDirections] = useState([])

  const [selectUniver, setSelectUniver] = useState(null)
  const [open, setOpen] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openDirection, setOpenDirection] = useState(false)

  const [subjectsForm, setSubjectsForm] = useState([
    { name: '', kafedra_id: '', direction_ids: [], university_id: '' },
  ])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [subjectsData, kafedrasData, universitiesData, directionsData] =
          await Promise.all([
            subjectApi.getSubjects(),
            kafedraApi.getKafedras(),
            univerApi.getUniversities(),
            directionApi.getDirections(),
          ])
        setSubjects(subjectsData)
        setKafedras(kafedrasData)
        setUniversities(universitiesData)
        setDirections(directionsData)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    }

    fetchData()
  }, [user])

  const resetForm = () => {
    setSubjectsForm([
      {
        name: '',
        kafedra_id: '',
        direction_ids: [],
        university_id: '',
      },
    ])
  }

  const filteredSubjects = useMemo(() => {
    return selectUniver === null
      ? subjects
      : subjects.filter((s) => s.university_id === selectUniver)
  }, [subjects, selectUniver])

  const getNameById = (list, id) => {
    const item = list.find((i) => i.id === id)
    return item ? item.name : '-'
  }

  const handleChange = (index, field, value) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              ...(field === 'university_id'
                ? { kafedra_id: '', direction_ids: [] }
                : {}),
            }
          : item
      )
    )
  }

  const toggleDirection = (index, directionId) => {
    setSubjectsForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              direction_ids: item.direction_ids.includes(directionId)
                ? item.direction_ids.filter((id) => id !== directionId)
                : [...item.direction_ids, directionId],
            }
          : item
      )
    )
  }

  const addSubjectField = () => {
    if (subjectsForm.length < 10) {
      setSubjectsForm((prev) => [
        ...prev,
        { name: '', kafedra_id: '', direction_ids: [], university_id: '' },
      ])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validSubjects = subjectsForm.filter(
      (s) => s.name && s.kafedra_id && s.university_id
    )
    if (validSubjects.length === 0) return

    try {
      await subjectApi.createSubjects(validSubjects)
      const refreshed = await subjectApi.getSubjects()
      setSubjects(refreshed)
      setSubjectsForm([
        { name: '', kafedra_id: '', direction_ids: [], university_id: '' },
      ])
      setOpenForm(false)
    } catch (error) {
      console.error('Ошибка сохранения предметов:', error)
    }
  }

  const handleDeleteSubject = async (id) => {
    try {
      await subjectApi.deleteSubjects(id)
      setSubjects((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Ошибка удаления предметов:', error)
    }
  }

  return (
    <div className="subjects-admin">
      <h1>Subjects</h1>

      <button className="primary-btn" onClick={() => setOpenForm(!openForm)}>
        Add Subjects
      </button>

      {openForm && (
        <div className="modal-overlay">
          <form className="subjects-form" onSubmit={handleSubmit}>
            {subjectsForm.map((subj, index) => {
              const availableKafedras = kafedras.filter(
                (k) => k.university_id === subj.university_id
              )
              const availableDirections = directions.filter(
                (d) => d.university_id === subj.university_id
              )

              return (
                <div key={index} className="subject-item">
                  <input
                    type="text"
                    className="subject-input"
                    placeholder="Название предмета"
                    value={subj.name}
                    onChange={(e) =>
                      handleChange(index, 'name', e.target.value)
                    }
                  />

                  <select
                    className="subject-select"
                    value={subj.university_id}
                    onChange={(e) =>
                      handleChange(
                        index,
                        'university_id',
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Выбери университет</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="subject-select"
                    value={subj.kafedra_id}
                    onChange={(e) =>
                      handleChange(index, 'kafedra_id', Number(e.target.value))
                    }
                    disabled={!subj.university_id}
                  >
                    <option value="">Выбери кафедру</option>
                    {availableKafedras.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                  <div className="direction-checkboxes">
                    <strong
                      className="directionBtn"
                      onClick={() => setOpenDirection(!openDirection)}
                    >
                      Направления
                    </strong>
                    {openDirection && ( // теперь открывается по клику
                      <ul className="direction-list">
                        {availableDirections.map((d) => (
                          <li key={d.id}>
                            <label className="direction-item">
                              <input
                                type="checkbox"
                                checked={subj.direction_ids.includes(d.id)}
                                onChange={() => toggleDirection(index, d.id)}
                              />
                              <span>
                                {d.name} ({d.course} курс)
                              </span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}

            <div className="form-actions">
              {subjectsForm.length < 10 && (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={addSubjectField}
                >
                  + Добавить ещё
                </button>
              )}
              <button type="submit" className="success-btn">
                Сохранить
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setOpenForm(false)
                  setOpenDirection(false)
                  resetForm()
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Фильтрация по университету */}
      <div className="filter-block">
        <label>University: </label>
        <div className="dropdown-display" onClick={() => setOpen(!open)}>
          {selectUniver !== null
            ? universities.find((u) => u.id === selectUniver)?.name
            : 'All'}
        </div>
        {open && (
          <ul className="dropdown-list">
            <li
              onClick={() => {
                setSelectUniver(null)
                setOpen(false)
              }}
            >
              All
            </li>
            {universities.map((u) => (
              <li
                key={u.id}
                onClick={() => {
                  setSelectUniver(u.id)
                  setOpen(false)
                }}
              >
                {u.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Таблица предметов */}
      <table className="subjects-table">
        <thead>
          <tr>
            <th>Subjects</th>
            <th>Kafedras</th>
            <th>Universities</th>
            <th>Directions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{getNameById(kafedras, s.kafedra_id)}</td>
              <td>{getNameById(universities, s.university_id)}</td>
              <td>
                {s.direction_ids
                  .map((id) => getNameById(directions, id))
                  .join(', ')}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSubject(s.id)}
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SubjectsOwner
