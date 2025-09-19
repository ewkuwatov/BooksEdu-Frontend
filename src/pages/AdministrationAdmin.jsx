import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AdminstrationAdmin = () => {
  const { t } = useTranslation()

  return (
    <>
      <Link to="/administration/superadmin/university">{t('university')}</Link>
      <Link to="/administration/superadmin/direction">{t('directions')}</Link>
      <Link to="/administration/superadmin/kafedra">{t('kafedras')}</Link>
      <Link to="/administration/superadmin/subject">{t('subjects')}</Link>
      <Link to="/administration/superadmin/literature">{t('literature')}</Link>
      <Link to="/administration/superadmin/news">{t('news')}</Link>
    </>
  )
}

export default AdminstrationAdmin
