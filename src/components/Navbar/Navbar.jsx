import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useScroll } from '../../context/ScrollContext'
import logo from '../../assets/logo_2_23C1EHF.png'

import DesktopNav from './DesktopNav'
import PhoneNav from './PhoneNav'
import ProfileMenu from './ProfileMenu'
import ContactMenu from './ContactMenu'

import '../../styles/Navbar/Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { isScrolledPastHeader } = useScroll()
  const navigate = useNavigate()

  const [openProfile, setOpenProfile] = useState(false)
  const [openContact, setOpenContact] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className={isScrolledPastHeader ? 'nav scrolled' : 'nav'}>
      {/* Десктопная версия */}
      <DesktopNav
        logo={logo}
        user={user}
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        openContact={openContact}
        setOpenContact={setOpenContact}
        handleLogout={handleLogout}
      />

      {/* Мобильная версия */}
      <PhoneNav user={user} handleLogout={handleLogout} logo={logo} />
    </nav>
  )
}

export default Navbar
