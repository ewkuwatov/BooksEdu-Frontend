import { useState } from "react"

const tr = () => {
    const [sub, setSub] = useState([])
    const [subjectsForm, setSubjectsForm] = useState([
      { name: '' }, // начинаем с одного пустого
    ])

    // обновляем поле предмета по индексу
    const handleChange = (index, value) => {
      setSubjectsForm((prev) =>
        prev.map((item, i) => (i === index ? { ...item, name: value } : item))
      )
    }

    // добавляем новый пустой предмет
    const addSubjectField = () => {
      setSubjectsForm((prev) => [...prev, { name: '' }])
    }

    // при отправке показываем результат
    const handleSubmit = (e) => {
      e.preventDefault()

      // вытаскиваем только непустые названия
      const validSubjects = subjectsForm
        .map((s) => s.name.trim())
        .filter((name) => name !== '')

      if (validSubjects.length === 0) return

      setSub((prev) => [
        ...prev,
        ...validSubjects.map((name, i) => ({
          id: Date.now() + i, // генерируем id
          name,
        })),
      ])
      setSubjectsForm([{ name: '' }])
      // сброс формы
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <h2>Добавь предметы</h2>

          {subjectsForm.map((subj, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Название предмета"
                value={subj.name}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}

          <button type="button" onClick={addSubjectField}>
            + Добавить ещё
          </button>

          <button type="submit">Сохранить</button>
        </form>

        <ul>
          {sub.map(s => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      </>
    )
}
 
export default tr;