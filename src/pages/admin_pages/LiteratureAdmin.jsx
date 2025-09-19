import { useContext, useEffect, useState, useMemo } from 'react'
import { AuthContext } from '../../context/AuthContext'

import literatureApi from '../../service/literatureApi'
import subjectApi from '../../service/subjectsApi'

import {
  LanguageEnum,
  FontTypeEnum,
  ConditionEnum,
  UsageStatusEnum,
} from '../../constants/enums'

const LiteratureAdmin = () => {
  const { user } = useContext(AuthContext)
  const [literatures, setLiteratures] = useState([])
  const [subjects, setSubjects] = useState([])
  const [openForm, setOpenForm] = useState(false)

  const [formLit, setFormLit] = useState({
    subject_id: '',
    title: '',
    kind: '',
    author: '',
    publisher: '',
    language: 'uzbek',
    font_type: 'latin',
    year: '',
    printed_count: '',
    condition: 'actual',
    usage_status: 'use',
  })

  const [openDropdown, setOpenDropdown] = useState({
    university: false,
    subject: false,
    language: false,
    font_type: false,
    condition: false,
    usage_status: false,
  })

  const [file, setFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [selectSubjects, setSelectSubjects] = useState('')
  const [openFilter, setOpenFilter] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [literaturesData, subjectsData] = await Promise.all([
          literatureApi.getLiterature(),
          subjectApi.getSubjects(),
        ])
        const filtered = literaturesData.filter(
          (l) => l.university_id === user.university_id
        )

        setLiteratures(filtered)
        setSubjects(subjectsData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [user])

  const filteredLiterature = useMemo(() => {
    const subId = parseInt(selectSubjects)
    return isNaN(subId)
      ? literatures
      : literatures.filter((l) => l.subject_id === subId)
  }, [literatures, selectSubjects])

  const getNameById = (list, id) => {
    const item = list.find((i) => i.id === id)
    return item ? item.name : ''
  }

  // --- Добавление новой литературы ---
  const handleAddLiterature = async (e) => {
    e.preventDefault()
    if (!formLit.title.trim() || !formLit.kind.trim()) {
      alert('Введите название и вид литературы')
      return
    }

    const formData = new FormData()
    for (const key in formLit) {
      if (formLit[key] !== '' && formLit[key] !== null) {
        formData.append(key, formLit[key])
      }
    }
    formData.append('university_id', user.university_id)

    if (file) {
      formData.append('file', file)
    }

    try {
      const created = await literatureApi.createLiteratureWithFile(formData)
      setLiteratures((prev) => [...prev, created])
      setFormLit({
        university_id: user.university_id || null,
        subject_id: '',
        title: '',
        kind: '',
        author: '',
        publisher: '',
        language: 'uzbek',
        font_type: 'latin',
        year: '',
        printed_count: '',
        condition: 'actual',
        usage_status: 'use',
      })
      setFile(null)
    } catch (error) {
      console.error('Ошибка добавления:', error)
    }
  }

  const filteredSubjects = useMemo(() => {
    if (!user?.university_id) return subjects
    return subjects.filter((s) => s.university_id === user.university_id)
  }, [subjects, user])

  const Dropdown = ({ label, value, options, onSelect, openKey }) => (
    <div style={{ marginBottom: '10px' }}>
      <label>{label}</label>
      <div
        style={{
          width: '200px',
          border: '1px solid gray',
          padding: '4px',
          cursor: 'pointer',
          background: '#fff',
        }}
        onClick={() =>
          setOpenDropdown((prev) => ({
            ...prev,
            [openKey]: !prev[openKey],
          }))
        }
      >
        {value || `Select ${label}`}
      </div>
      {openDropdown[openKey] && (
        <ul
          style={{
            border: '1px solid gray',
            width: '209px',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            background: '#fff',
          }}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              style={{ cursor: 'pointer', padding: '4px' }}
              onClick={() => {
                onSelect(opt.value)
                setOpenDropdown((prev) => ({ ...prev, [openKey]: false }))
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const startEditing = (l) => {
    setEditingId(l.id)
    setFormLit({
      university_id: user.university_id || null,
      subject_id: l.subject_id,
      title: l.title,
      kind: l.kind,
      author: l.author,
      publisher: l.publisher,
      language: l.language,
      font_type: l.font_type,
      year: l.year,
      printed_count: l.printed_count,
      condition: l.condition,
      usage_status: l.usage_status,
      file_path: l.file_path,
    })
  }

  const handleEditLiterature = async () => {
    try {
      const formData = new FormData()
      for (const key in formLit) {
        if (formLit[key] !== '' && formLit[key] !== null) {
          formData.append(key, formLit[key])
        }
      }
      formData.append('university_id', user.university_id)

      if (file) {
        formData.append('file', file)
      }

      const updated = await literatureApi.updateLiteratureWithFile(
        editingId,
        formData
      )

      setLiteratures((prevLit) =>
        prevLit.map((l) => (l.id === editingId ? updated : l))
      )
      setEditingId(null)
      setFile(null)
    } catch (error) {
      console.error('Ошибка редактирования:', error)
    }
  }

  const handleDeleteLiterature = async (id) => {
    try {
      await literatureApi.deleteLiterature(id)
      setLiteratures(prevLit => prevLit.filter(l => l.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>Literature</h1>

      <div>
        {!openForm && (
          <button onClick={() => setOpenForm((prev) => !prev)}>Add</button>
        )}
        {openForm && (
          <form onSubmit={handleAddLiterature}>
            <input
              type="text"
              placeholder="Title"
              value={formLit.title}
              onChange={(e) =>
                setFormLit({ ...formLit, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Kind"
              value={formLit.kind}
              onChange={(e) => setFormLit({ ...formLit, kind: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              value={formLit.author}
              onChange={(e) =>
                setFormLit({ ...formLit, author: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Publisher"
              value={formLit.publisher}
              onChange={(e) =>
                setFormLit({ ...formLit, publisher: e.target.value })
              }
            />

            {/* Subject */}
            <Dropdown
              label="Subject"
              value={
                filteredSubjects.find((s) => s.id === formLit.subject_id)?.name
              }
              options={filteredSubjects.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, subject_id: val })}
              openKey="subject"
            />

            {/* Language */}
            <Dropdown
              label="Language"
              value={formLit.language}
              options={Object.values(LanguageEnum).map((l) => ({
                value: l,
                label: l,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, language: val })}
              openKey="language"
            />

            {/* Font type */}
            <Dropdown
              label="Font type"
              value={formLit.font_type}
              options={Object.values(FontTypeEnum).map((ft) => ({
                value: ft,
                label: ft,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, font_type: val })}
              openKey="font_type"
            />

            {/* Condition */}
            <Dropdown
              label="Condition"
              value={formLit.condition}
              options={Object.values(ConditionEnum).map((c) => ({
                value: c,
                label: c,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, condition: val })}
              openKey="condition"
            />

            {/* Usage status */}
            <Dropdown
              label="Usage status"
              value={formLit.usage_status}
              options={Object.values(UsageStatusEnum).map((s) => ({
                value: s,
                label: s,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, usage_status: val })}
              openKey="usage_status"
            />

            <input
              type="number"
              placeholder="Year"
              value={formLit.year}
              onChange={(e) => setFormLit({ ...formLit, year: e.target.value })}
            />
            <input
              type="number"
              placeholder="Printed count"
              value={formLit.printed_count}
              onChange={(e) =>
                setFormLit({ ...formLit, printed_count: e.target.value })
              }
            />

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <button type="submit">Save</button>
            <button type="button" onClick={() => setOpenForm(false)}>
              cancel
            </button>
          </form>
        )}
      </div>

      <div onClick={() => setOpenFilter(!openFilter)}>
        {selectSubjects
          ? subjects.find((s) => s.id === selectSubjects)?.name
          : 'All'}
      </div>
      {openFilter && (
        <ul>
          <li onClick={() => (setSelectSubjects(null), setOpenFilter(false))}>
            All
          </li>
          {subjects.map((s) => (
            <li
              key={s.id}
              onClick={() => (setSelectSubjects(s.id), setOpenFilter(false))}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {/* --- Таблица --- */}
      <table border={1}>
        <thead>
          <tr>
            <th>title</th>
            <th>subject</th>
            <th>kind</th>
            <th>author</th>
            <th>publisher</th>
            <th>language</th>
            <th>font_type</th>
            <th>year</th>
            <th>printed_count</th>
            <th>condition</th>
            <th>usage_status</th>
            <th>file</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLiterature.map((l) => (
            <tr key={l.id}>
              {/* Title */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="text"
                    value={formLit.title}
                    onChange={(e) =>
                      setFormLit({ ...formLit, title: e.target.value })
                    }
                  />
                ) : (
                  l.title
                )}
              </td>

              {/* Subject */}
              <td>
                {editingId === l.id ? (
                  <Dropdown
                    label="Subject"
                    value={getNameById(subjects, formLit.subject_id)}
                    options={filteredSubjects.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    onSelect={(val) =>
                      setFormLit({ ...formLit, subject_id: val })
                    }
                    openKey="subject"
                  />
                ) : (
                  getNameById(subjects, l.subject_id)
                )}
              </td>

              {/* Kind */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="text"
                    value={formLit.kind}
                    onChange={(e) =>
                      setFormLit({ ...formLit, kind: e.target.value })
                    }
                  />
                ) : (
                  l.kind
                )}
              </td>

              {/* Author */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="text"
                    value={formLit.author}
                    onChange={(e) =>
                      setFormLit({ ...formLit, author: e.target.value })
                    }
                  />
                ) : (
                  l.author
                )}
              </td>

              {/* Publisher */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="text"
                    value={formLit.publisher}
                    onChange={(e) =>
                      setFormLit({ ...formLit, publisher: e.target.value })
                    }
                  />
                ) : (
                  l.publisher
                )}
              </td>

              {/* Language */}
              <td>
                {editingId === l.id ? (
                  <Dropdown
                    label="Language"
                    value={formLit.language}
                    options={Object.values(LanguageEnum).map((lang) => ({
                      value: lang,
                      label: lang,
                    }))}
                    onSelect={(val) =>
                      setFormLit({ ...formLit, language: val })
                    }
                    openKey="language"
                  />
                ) : (
                  l.language
                )}
              </td>

              {/* Font type */}
              <td>
                {editingId === l.id ? (
                  <Dropdown
                    label="Font type"
                    value={formLit.font_type}
                    options={Object.values(FontTypeEnum).map((ft) => ({
                      value: ft,
                      label: ft,
                    }))}
                    onSelect={(val) =>
                      setFormLit({ ...formLit, font_type: val })
                    }
                    openKey="font_type"
                  />
                ) : (
                  l.font_type
                )}
              </td>

              {/* Year */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="number"
                    value={formLit.year}
                    onChange={(e) =>
                      setFormLit({ ...formLit, year: e.target.value })
                    }
                  />
                ) : (
                  l.year
                )}
              </td>

              {/* Printed count */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="number"
                    value={formLit.printed_count}
                    onChange={(e) =>
                      setFormLit({ ...formLit, printed_count: e.target.value })
                    }
                  />
                ) : (
                  l.printed_count
                )}
              </td>

              {/* Condition */}
              <td>
                {editingId === l.id ? (
                  <Dropdown
                    label="Condition"
                    value={formLit.condition}
                    options={Object.values(ConditionEnum).map((c) => ({
                      value: c,
                      label: c,
                    }))}
                    onSelect={(val) =>
                      setFormLit({ ...formLit, condition: val })
                    }
                    openKey="condition"
                  />
                ) : (
                  l.condition
                )}
              </td>

              {/* Usage status */}
              <td>
                {editingId === l.id ? (
                  <Dropdown
                    label="Usage status"
                    value={formLit.usage_status}
                    options={Object.values(UsageStatusEnum).map((s) => ({
                      value: s,
                      label: s,
                    }))}
                    onSelect={(val) =>
                      setFormLit({ ...formLit, usage_status: val })
                    }
                    openKey="usage_status"
                  />
                ) : (
                  l.usage_status
                )}
              </td>

              {/* File */}
              <td>
                {editingId === l.id ? (
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                ) : l.file_path ? (
                  <button
                    onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/literatures/${l.id}/download`
                      )
                    }
                  >
                    Download
                  </button>
                ) : (
                  '—'
                )}
              </td>

              {/* Actions */}
              <td>
                {editingId === l.id ? (
                  <>
                    <button onClick={handleEditLiterature}>save</button>
                    <button onClick={() => setEditingId(null)}>cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(l)}>edit</button>
                    <button onClick={() => handleDeleteLiterature(l.id)}>
                      delete
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

export default LiteratureAdmin
