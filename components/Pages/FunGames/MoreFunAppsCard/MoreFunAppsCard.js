import React from 'react'
import './MoreFunAppsCard.css'
import { getFunGamesListPath } from '../../../../common/paths'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useTranslation } from 'react-i18next'
import { getWidgetBaseUrl } from '../../../../helpers/helperFunctions'
import PropTypes from 'prop-types'
import { useFeatureAllowed } from '../../../../helpers/tenantHelper'
import { useTokenisationContext } from '../../../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../helpers/constant'
import { getCombinedWidgetComponentMapper } from '../../../../widgets/bannerToWidgetComponentMapper'
import { tenantType } from '../../../../common/constants'
import { useTenantConfig } from '../../../../useTenantConfig'

const MoreFunAppsCard = ({
  environment,
  tenant,
  setRedirectLoading,
  lockedStatus
}) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const {
    setIsTokenisationModelOpen,
    setTokenisationUseCaseType,
    setTokenisationUseCaseData,
    getTokenSpec,
    setWidgetComponentIds,
    setUnlockedMvpMetaData
  } = useTokenisationContext()
  const tenantLayout = useTenantConfig(tenant)

  const goToGamesPage = () => {
    trackEvent('fun_app_view_more', {
      external_id: authorizationId
    })
    const currentTenant = sessionStorage.getItem('tenant') || tenant
    if (lockedStatus && isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.premiumContent)
      setIsTokenisationModelOpen(true)
      setTokenisationUseCaseData({
        previewImage: `${getWidgetBaseUrl(environment)}/images/fun_games/more-fun-apps.png`,
        title: 'More Fun Games',
        icon: null
      })
      setWidgetComponentIds(getCombinedWidgetComponentMapper('more_fun_apps'))
      setUnlockedMvpMetaData({
        redirectUrl: `${getWidgetBaseUrl(environment)}${getFunGamesListPath().toString()}?tenant=${currentTenant}`,
        unlockedMvpName: null
      })
      getTokenSpec(
        {
          user_event: `user_more_fun_apps_unlock_click`,
          app_name: `fun_apps`,
          event: `user_more_fun_apps_poll_unlock_click`
        },
        true
      )
      return
    } else {
      setRedirectLoading(true)
      window.parent.location.href = `${getWidgetBaseUrl(
        environment
      )}${getFunGamesListPath().toString()}?tenant=${currentTenant}`
    }
  }

  return (
    <div className='fg-mfac-container'>
      <div className='fg-mfac-body-container'>
        <div
          style={{
            fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
            fontWeight: tenantLayout?.funGames?.widget?.beatTheClockFontWeight,
            fontSize: tenantLayout?.funGames?.widget?.titleFontSize
          }}
          className='fg-mfac-title'
        >
          {t('funGames.likedWhatYouPlayed')}
        </div>
        <div
          style={{
            fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
            fontWeight: tenantLayout?.funGames?.widget?.reactionTimeFontWeight,
            fontSize: tenantLayout?.funGames?.widget?.descFontSize
          }}
          className='fg-mfac-desc'
        >
          {t('funGames.checkOutMore')} <br /> {t('funGames.funApps')}
        </div>
        <div
          className='fg-mfac-continue-button'
          style={{
            marginTop: tenantLayout?.funGames?.widget?.spacingTopCTA
          }}
          onClick={goToGamesPage}
        >
          <img
            alt=''
            src={`${
              environment ? getWidgetBaseUrl(environment) : ''
            }/images/fun_games/continue-button${tenant === tenantType.mobicom ? '-mn' : ''}.png`}
          />
        </div>
      </div>
    </div>
  )
}

MoreFunAppsCard.propTypes = {
  environment: PropTypes.string,
  tenant: PropTypes.string,
  setRedirectLoading: PropTypes.func,
  lockedStatus: PropTypes.bool
}

export default MoreFunAppsCard
