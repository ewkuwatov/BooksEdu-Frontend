import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Administration = () => {
  const { t } = useTranslation()

  return (
    <>
      <Link to="/administration/owner/universities">{t('universities')}</Link>
      <Link to="/administration/owner/admins">{t('admins')}</Link>
      <Link to="/administration/owner/directions">{t('directions')}</Link>
      <Link to="/administration/owner/kafedra">{t('kafedras')}</Link>
      <Link to="/administration/owner/subjects">{t('subjects')}</Link>
      <Link to="/administration/owner/literature">{t('literature')}</Link>
      <Link to="/administration/owner/news">{t('news')}</Link>
    </>
  )
}

export default Administration
