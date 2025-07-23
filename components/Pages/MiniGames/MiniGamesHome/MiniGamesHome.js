import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import common from '@kelchy/common'
import { axiosGet } from '../../../../utils/axios'
import BackButton from '../../../../static/BackButton'
import MiniGamesCarousel from './MiniGamesCarousel'
import PropTypes from 'prop-types'
import MiniGamesPopular from './MiniGamesPopular'
import MiniGamesBanners from './MiniGamesBanners'
import MiniGamesCategories from './MiniGamesCategories'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const MiniGamesHome = ({ redirectToGame }) => {
  const { t } = useTranslation('common')
  const [byuVideoSections, setByuVideoSections] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { authorizationId } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)

  useEffect(() => {
    const fetchAppSections = async () => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'byu_mini_games'
        }
        trackEvent('byu_mini_games_sections_fetch', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosGet('/games?page=1&section=popular', {})
      )
      if (response?.data) {
        setByuVideoSections(response.data)
      }
      setIsLoading(false)
    }
    fetchAppSections()
  }, [authorizationId])

  return (
    !isLoading &&
    byuVideoSections.length > 0 && (
      <div className='byu-mini-game-home-wrap'>
        <div
          className='byu-mini-game-home-header-wrap'
          style={{
            background: tenantLayout?.byu?.common?.bgGradient
          }}
        >
          <div className='byu-mini-game-list-header'>
            <BackButton color='#FFF' textVisible={false} />
            <div className='byu-mini-game-list-title'>{t('byu.games')}</div>
          </div>
          <MiniGamesCarousel redirectToGame={redirectToGame} tenant={tenant} />
        </div>
        <div className='byu-mini-game-other-sections-wrap'>
          <MiniGamesPopular redirectToGame={redirectToGame} />
          <MiniGamesBanners redirectToGame={redirectToGame} />
          <MiniGamesCategories />
        </div>
      </div>
    )
  )
}

MiniGamesHome.propTypes = {
  redirectToGame: PropTypes.func
}

export default MiniGamesHome
