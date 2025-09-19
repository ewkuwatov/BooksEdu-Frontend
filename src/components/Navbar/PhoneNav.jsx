import { Link } from 'react-router-dom'
import { University, Search, BookCheck, LogIn, LogOut } from 'lucide-react'

const PhoneNav = ({ user, handleLogout }) => {
  return (
    <div className="phoneNavigation">
      <ul>
        <li>
          <Link to="/universities">
            <University />
            <span>University</span>
          </Link>
        </li>
        <li>
          <Link to="/search">
            <Search />
            <span>Search</span>
          </Link>
        </li>
        <li>
          <Link to="/tests">
            <BookCheck />
            <span>Tests</span>
          </Link>
        </li>

        {!user ? (
          <li>
            <Link to="/login" className="loginBtn">
              <LogIn />
              <span>Login</span>
            </Link>
          </li>
        ) : (
          <li>
            <button onClick={handleLogout} className="logoutBtn">
              <LogOut />
              <span>Logout</span>
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default PhoneNav
