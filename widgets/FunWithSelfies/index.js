import React, { useState } from 'react'
import './index.css'
import {
  funWithSelfiesMapper,
  recordAppVisit
} from '../../helpers/recentVisitedHistory'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import {
  getLockedComponent,
  getWidgetComponentsLockedStatus
} from '../../helpers/getWidgetComponentsLockedStatus'
import { filterByDeviceCompatibility } from '../../utils/converter'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../useTenantConfig'
import SubscriptionDrawer from '../../components/SubscriptionDrawer'
import { useSubscriptionContext } from '../../context/SubscriptionContext'
import { tenantType } from '../../common/constants'
import { useTokenisationContext } from '../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../helpers/constant'
import {
  getConfigForHostname,
  useFeatureAllowed
} from '../../helpers/tenantHelper'
import { getCombinedWidgetComponentMapper } from '../bannerToWidgetComponentMapper'

const { tenant } = getConfigForHostname()

// Trending tab panel
const TrendingTabPanel = ({ children, index, value, ...rest }) => {
  return (
    <div
      className={`widget-fun-selfie-tab-panel ${tenant} ${
        value !== index ? 'inactive' : ''
      }`}
      id={`simple-tabpanel-${index}`}
      aria-label={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

TrendingTabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

const FunWithSelfies = ({
  externalId,
  tenant,
  environment,
  setRedirectLoading,
  widgetComponents,
  userUnlockedComponents,
  isUnlockedComponentsLoading,
  isExploreSublayout = false
}) => {
  const { setIsDrawerOpen } = useSubscriptionContext()
  const {
    setIsTokenisationModelOpen,
    setTokenisationUseCaseType,
    setWidgetComponentIds,
    setTokenisationUseCaseData,
    setUnlockedMvpMetaData,
    getTokenSpec
  } = useTokenisationContext()
  // Get tenant layout
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const tenantLayout = useTenantConfig(tenant)
  const [selectedCard, setSelectedCard] = useState(0)
  const [selectedCardData, setSelectedCardData] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState('avatarMe')
  const { t } = useTranslation('common')

  const handleCardClick = (id, app, cardName) => {
    // Google Analytics: Push event
    window.dataLayer.push({
      event: 'ai_store_app_click',
      product_name: cardName,
      external_id: externalId,
      explore_version: 'V4'
    })
    setSelectedCard(id)
    setSelectedCardData(app)
    setSelectedCardId(cardName)
  }

  // card redirection handler
  const cardClickHandler = (isLocked, isUnlockedComponentsLoading) => {
    if (isUnlockedComponentsLoading) return
    // Google Analytics: Push event
    window.dataLayer.push({
      event: 'gtm.click',
      'gtm.elementId': selectedCardId,
      external_id: externalId,
      explore_version: 'V4'
    })
    const url = getWidgetBaseUrl(environment)
    if (tenant === 'att') return
    // If the app is locked, open the drawer for tselhalo tenant and return
    if (isLocked) {
      if (tenant === tenantType.tselhalo) {
        setIsDrawerOpen(true)
      } else {
        if (isTokenisationEnabled) {
          setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.premiumContent)
          setIsTokenisationModelOpen(true)
          setTokenisationUseCaseData({
            previewImage: `${getWidgetBaseUrl(environment)}${selectedCardData?.cardImage}`,
            title: selectedCardData?.title,
            icon: `${getWidgetBaseUrl(environment)}${selectedCardData?.iconImage}`
          })
          setWidgetComponentIds(
            getCombinedWidgetComponentMapper(selectedCardData?.analyticsKey)
          )
          setUnlockedMvpMetaData({
            redirectUrl: `${url}${selectedCardData.url}?tenant=${tenant}`,
            unlockedMvpName: selectedCardData?.title
          })
          getTokenSpec(
            {
              user_event: `user_${selectedCardData?.widgetComponentId}_unlock_click`,
              app_name: `${selectedCardData?.widgetComponentId}`,
              event: `user_${selectedCardData?.widgetComponentId}_unlock_click`,
              swipe_depth: 0
            },
            true
          )
        }
      }
      return
    }

    if (tenant !== tenantType.tselhalo) {
      setRedirectLoading(true)
    }
    // Record the history for the app visit in local storage
    recordAppVisit(funWithSelfiesMapper[selectedCardId])
    window.location.assign(`${url}${selectedCardData.url}?tenant=${tenant}`)
  }

  // Filter components based on device compatibility and locked status
  const allowedComponents = useMemo(() => {
    if (!tenantLayout?.funWithSelfies?.apps?.length) {
      return []
    }
    const selectedCard = tenantLayout?.funWithSelfies?.apps[0]
    setSelectedCardData(selectedCard)
    setSelectedCardId(selectedCard?.key)
    const filteredFunWithSelfies = getWidgetComponentsLockedStatus(
      tenantLayout?.funWithSelfies?.apps,
      widgetComponents
    )
    return filterByDeviceCompatibility(filteredFunWithSelfies)
  }, [widgetComponents, tenantLayout?.funWithSelfies?.apps])

  return (
    <div
      className='widget-fws-container'
      data-cx={`explore-section-aistore`}
      style={{
        padding: !isExploreSublayout
          ? tenantLayout?.funWithSelfies?.widgetPadding
          : 0
      }}
    >
      {!isExploreSublayout && (
        <p
          className='widget-fws-title'
          style={{
            fontFamily: tenantLayout?.fonts?.widgetTitle,
            fontSize: tenantLayout?.fontSize?.widgetTitle,
            margin: tenantLayout?.funWithSelfies?.widgetTitleSpacing
          }}
        >
          {t('explore.funWithSelfies')}
        </p>
      )}
      {tenant === 'att' && (
        <p className='widget-fws-subtitle'>{t('explore.comingSoon')}</p>
      )}
      <div
        className={`widget-fws-blur-container ${tenant === 'att' && 'blur'}`}
      >
        <div
          className='widget-fws-tabs'
          style={{
            marginBottom: tenantLayout?.funWithSelfies?.tabBottomSpacing
          }}
        >
          {allowedComponents.map((app, index) => {
            const isLocked =
              app?.lockedStatus &&
              !userUnlockedComponents?.includes(app?.widgetComponentId)
            return (
              <div className='widget-fws-tab' key={app.key}>
                <div
                  className={`widget-fws-tab-item ${
                    selectedCard === index && 'selected'
                  }`}
                  data-cy={`explore-tile-${app?.key} ${
                    selectedCard === index
                      ? `explore-tile-highlighted-${app?.key}`
                      : ''
                  }`}
                  onClick={() => handleCardClick(index, app, app.key)}
                  style={{
                    backgroundColor:
                      selectedCard === index
                        ? tenantLayout?.funWithSelfies?.activeTabBackground
                        : '',
                    boxShadow:
                      selectedCard === index
                        ? tenantLayout?.funWithSelfies?.boxShadow
                        : ''
                  }}
                >
                  <div className='widget-fws-tab-image-container'>
                    {getLockedComponent(
                      isUnlockedComponentsLoading,
                      isLocked,
                      '32px',
                      '62px',
                      'center'
                    )}
                    <img
                      className='widget-fws-tab-image'
                      src={`${getWidgetBaseUrl(environment)}${app.iconImage}`}
                      alt={app?.title}
                    />
                  </div>
                  <div
                    className='widget-fws-tab-title'
                    style={{
                      color:
                        selectedCard === index
                          ? tenantLayout?.funWithSelfies?.activeTabColor
                          : '#333333',
                      fontFamily: tenantLayout?.fonts?.primary
                    }}
                  >
                    {app?.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {allowedComponents?.map((item, index) => {
          const isLocked =
            item?.lockedStatus &&
            !userUnlockedComponents?.includes(item?.widgetComponentId)
          return (
            <TrendingTabPanel
              key={`trending-list${index}`}
              value={selectedCard}
              index={index}
            >
              <div
                className={`widget-fws-tab-content ${tenant}`}
                onClick={
                  tenant === tenantType.tselhalo
                    ? () => {}
                    : () =>
                        cardClickHandler(isLocked, isUnlockedComponentsLoading)
                }
              >
                {getLockedComponent(
                  isUnlockedComponentsLoading,
                  isLocked,
                  tenantLayout?.funWithSelfies?.lockedIconConfig?.width,
                  tenantLayout?.funWithSelfies?.lockedIconConfig?.loadingWidth,
                  tenantLayout?.funWithSelfies?.lockedIconConfig?.position
                )}
                <img
                  className={`widget-fws-tab-content-image ${tenant}`}
                  src={`${getWidgetBaseUrl(environment)}${item?.cardImage}`}
                  alt={`Selected ${item?.title}`}
                  style={{ boxShadow: tenantLayout?.funWithSelfies?.boxShadow }}
                />
                <button
                  data-cy={`explore-try-now-cta`}
                  onClick={() =>
                    cardClickHandler(isLocked, isUnlockedComponentsLoading)
                  }
                  className={`widget-fws-tab-content-button ${tenant}`}
                  style={{
                    backgroundColor:
                      tenantLayout?.funWithSelfies?.callToAction?.background,
                    borderRadius:
                      tenantLayout?.funWithSelfies?.callToAction?.borderRadius,
                    fontFamily:
                      tenantLayout?.funWithSelfies?.callToAction?.fontFamily,
                    fontWeight:
                      tenantLayout?.funWithSelfies?.callToAction?.fontWeight,
                    fontSize:
                      tenantLayout?.funWithSelfies?.callToAction?.fontSize,
                    boxShadow:
                      tenantLayout?.funWithSelfies?.callToAction?.boxShadow,
                    zIndex: tenantLayout?.funWithSelfies?.callToAction?.zIndex
                  }}
                >
                  {isLocked &&
                  tenantLayout?.funWithSelfies?.callToAction?.isAlternateText
                    ? t('exclusiveContent.unlock')
                    : t('explore.tryNow')}
                </button>
              </div>
            </TrendingTabPanel>
          )
        })}
      </div>
      {tenant === tenantType.tselhalo && (
        <SubscriptionDrawer environment={environment} />
      )}
    </div>
  )
}

FunWithSelfies.propTypes = {
  externalId: PropTypes.string,
  tenant: PropTypes.string,
  environment: PropTypes.string,
  setRedirectLoading: PropTypes.func,
  widgetComponents: PropTypes.array,
  userUnlockedComponents: PropTypes.array,
  isUnlockedComponentsLoading: PropTypes.bool,
  isExploreSublayout: PropTypes.bool
}

FunWithSelfies.displayName = 'FunWithSelfies'

export default FunWithSelfies
