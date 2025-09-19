// AdminLayout.jsx
import { useContext } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Administration from './AdministartionOwner'
import AdminstrationAdmin from './AdministrationAdmin'
import '../styles/AdminStyle/AdminLayout.css'


const roleComponents = {
  owner: Administration,
  superadmin: AdminstrationAdmin,
}

const AdminLayout = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="loader">Загрузка...</div> // 🔄 можно заменить спиннером
  }

  if (!user) {
    return <div className="no-access">Нет доступа 🚫</div>
  }

  const SidebarComponent = roleComponents[user.role] || null

  return (
    <div className="adminLayout">
      {/* Левая колонка */}
      <aside className="aside">
        <h2>Admin panel</h2>
        {SidebarComponent ? (
          <SidebarComponent />
        ) : (
          <p>Нет панели для этой роли</p>
        )}

        <Link className="backToSite" to="/">
          Exit
        </Link>
      </aside>

      {/* Правая колонка */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
