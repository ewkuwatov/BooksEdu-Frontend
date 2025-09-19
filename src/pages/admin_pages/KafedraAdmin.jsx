import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import kafedraApi from "../../service/kafedrasApi";

const KafedraAdmin = () => {
    const {user} = useContext(AuthContext)
    const [kafedras, setKafedras] = useState([])
    const [name, setName] = useState('')
    const [openForm, setOpenForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    
    useEffect(()=>{
        if(!user) return

        const fetchKafedra = async () => {
            try {
                const kafedrasData = await kafedraApi.getKafedras()

                const filtered = kafedrasData.filter(k => k.university_id === user.university_id)

                setKafedras(filtered)
            } catch (error) {
                console.error(error)
            }
        }
        fetchKafedra()
    }, [user])

    const handleAddKafedras = async (e) => {
        e.preventDefault()
        if(!name.trim()) return

        const payload = {
            name: name.trim(),
            university_id: user.university_id || null
        }

        try {
          const created = await kafedraApi.createKafedras(payload)
          setKafedras((prev) => [...prev, created])

          // Сбрасываем форму
          setName('')
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteKafedra = async (id) => {
        try {
            await kafedraApi.deleteKafedras(id)
            setKafedras((prevKaf) => prevKaf.filter(k => k.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const startEditing = (k) => {
        setEditingId(k.id)
        setName(k.name)
        setOpenForm(true)
    }

    const handleEditKafedra = async (e) => {
        e.preventDefault()
        if(!name.trim()) return
        
        const payload = {
            name: name.trim()
        }
        
        try {
            const updated = await kafedraApi.updateKafedras(editingId, payload)
            setKafedras((prevKaf) =>
              prevKaf.map((k) => (k.id === editingId ? updated : k))
            )
            setEditingId(null)
            setOpenForm(false)
        } catch (error) {
            console.error(error)
        }

    }

    return (
      <>
        <h1>Kafedra</h1>
        {!openForm && (
          <button onClick={() => setOpenForm((prev) => !prev)}>
            Add Kafedra
          </button>
        )}

        {openForm && (
          <form onSubmit={startEditing ? handleEditKafedra : handleAddKafedras}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">{editingId ? "save change" : "save"}</button>
            <button onClick={() => setOpenForm(false)}>Cancel</button>
          </form>
        )}

        <ul>
          {kafedras.map((k) => (
            <li key={k.id}>
              <strong>{k.name}</strong>{' '}
              <button onClick={() => handleDeleteKafedra(k.id)}>Delete</button>
              <button onClick={() => startEditing(k)}>Edit</button>
            </li>
          ))}
        </ul>
      </>
    )
}
 
export default KafedraAdmin;