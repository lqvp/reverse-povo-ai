import React from 'react'
import './index.css'
import BackButton from '../../../static/BackButton'
import { funGamesListData } from '../../../static/funGamesListData'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useAppContext } from '../../../context/AppContext'
import { useTranslation } from 'react-i18next'
import { getTenantName } from '../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../useTenantConfig'

const tenant = getTenantName()

const FunGamesList = () => {
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const handleGameItemClick = (game) => {
    trackEvent('clicked fun_app', {
      external_id: authorizationId,
      card_name: game?.key
    })
    navigate(game?.appRoute)
  }
  return (
    <div className='fun-games-list-container'>
      <div className='fun-games-list-header'>
        <BackButton color='#333' textVisible={false} fontSize='28px' />
        <div className='fun-games-list-title'>{t('funGames.funQuest')}</div>
      </div>
      <div className='fun-games-list-cards-container'>
        {funGamesListData?.map((game) => (
          <div
            className='fun-games-list-item-tile'
            onClick={() => handleGameItemClick(game)}
            key={game?.key}
          >
            <img
              alt={game?.key}
              style={{
                borderRadius: tenantLayout?.funGames?.list?.borderRadius,
                boxShadow: tenantLayout?.funGames?.list?.boxShadow
              }}
              src={game?.imagePath}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FunGamesList
