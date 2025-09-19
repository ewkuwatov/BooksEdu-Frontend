import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import literatureApi from '../../service/literatureApi'
import subjectApi from '../../service/subjectsApi'
import univerApi from '../../service/univerApi'

import {
  LanguageEnum,
  FontTypeEnum,
  ConditionEnum,
  UsageStatusEnum,
} from '../../constants/enums'

import Dropdown from '../../components/Dropdown' // 🔹 импортируем готовый компонент
import '../../styles/AdminStyle/literatureOwner.css'

const LiteartureOwner = () => {
  const { user } = useContext(AuthContext)

  const [literatures, setLiteratures] = useState([])
  const [subjects, setSubjects] = useState([])
  const [universities, setUniversities] = useState([])

  const [selectUniver, setSelectUniver] = useState('')
  const [openForm, setOpenForm] = useState(false)

  // локальные состояния для dropdown
  const [openDropdown, setOpenDropdown] = useState({
    university: false,
    subject: false,
    language: false,
    font_type: false,
    condition: false,
    usage_status: false,
    filterUniver: false,
  })

  const [file, setFile] = useState(null)

  const [formLit, setFormLit] = useState({
    university_id: '',
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

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [literaturesData, subjectsData, universityData] =
          await Promise.all([
            literatureApi.getLiterature(),
            subjectApi.getSubjects(),
            univerApi.getUniversities(),
          ])
        setLiteratures(literaturesData)
        setSubjects(subjectsData)
        setUniversities(universityData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [user])

  const getNameById = (list, id) => {
    const item = list.find((i) => i.id === id)
    return item ? item.name : '-'
  }

  const filterLiteratures = useMemo(() => {
    const uniId = parseInt(selectUniver)
    return isNaN(uniId)
      ? literatures
      : literatures.filter((l) => l.university_id === uniId)
  }, [literatures, selectUniver])

  const handleAddLiteratures = async (e) => {
    e.preventDefault()
    if (!formLit.title.trim() || !formLit.kind.trim()) return

    const formData = new FormData()
    for (const key in formLit) {
      if (formLit[key] !== '' && formLit[key] !== null) {
        formData.append(key, formLit[key])
      }
    }

    if (file) {
      formData.append('file', file)
    }

    try {
      const created = await literatureApi.createLiteratureWithFile(formData)
      setLiteratures((prev) => [...prev, created])
      setFormLit({
        university_id: '',
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
      console.error(error)
    }
  }

  const filteredSubjects = useMemo(() => {
    if (!formLit.university_id) return subjects
    return subjects.filter((s) => s.university_id === formLit.university_id)
  }, [subjects, formLit.university_id])

  return (
    <div className="literature-admin">
      <h1>Literature</h1>
      <div>
        {!openForm && (
          <button
            className="primary-btn"
            onClick={() => setOpenForm((prev) => !prev)}
          >
            Add
          </button>
        )}
        {openForm && (
          <form className="literature-form" onSubmit={handleAddLiteratures}>
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

            {/* University */}
            <Dropdown
              label="University"
              value={
                universities.find((u) => u.id === formLit.university_id)?.name
              }
              options={universities.map((u) => ({
                value: u.id,
                label: u.name,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, university_id: val })}
              openKey="university"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* Subject */}
            <Dropdown
              label="Subject"
              value={subjects.find((s) => s.id === formLit.subject_id)?.name}
              options={filteredSubjects.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              onSelect={(val) => setFormLit({ ...formLit, subject_id: val })}
              openKey="subject"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
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
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
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
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
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
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
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
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
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
            <button onClick={() => setOpenForm(false)}>cancel</button>
          </form>
        )}
      </div>

      {/* Filter by university */}
      <Dropdown
        className="filter-block"
        label="Filter by university"
        value={
          selectUniver
            ? universities.find((u) => u.id === selectUniver)?.name
            : 'All'
        }
        options={[
          { value: null, label: 'All' },
          ...universities.map((u) => ({ value: u.id, label: u.name })),
        ]}
        onSelect={(val) => setSelectUniver(val)}
        openKey="filterUniver"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      <table className="literature-table" border={1}>
        <thead>
          <tr>
            <th>title</th>
            <th>subject</th>
            <th>university</th>
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
          </tr>
        </thead>
        <tbody>
          {filterLiteratures.map((l) => (
            <tr key={l.id}>
              <td>{l.title}</td>
              <td>{getNameById(subjects, l.subject_id)}</td>
              <td>{getNameById(universities, l.university_id)}</td>
              <td>{l.kind}</td>
              <td>{l.author}</td>
              <td>{l.publisher}</td>
              <td>{l.language}</td>
              <td>{l.font_type}</td>
              <td>{l.year}</td>
              <td>{l.printed_count}</td>
              <td>{l.condition}</td>
              <td>{l.usage_status}</td>
              <td>
                {l.file_path ? (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LiteartureOwner
