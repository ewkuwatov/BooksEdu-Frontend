import '../../styles/Header.css'
import DesctopHeader from './DesctopHeader'
import PhoneHeader from './PhoneHeader'

import logo from '../../assets/logo_2_23C1EHF.png'

const Header = () => {
  return (
    <header>
      <DesctopHeader />
      <PhoneHeader logo={logo} />
    </header>
  )
}

export default Header
