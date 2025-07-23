import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import './index.css'
import { useTenantConfig } from '../../../useTenantConfig'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useAppContext } from '../../../context/AppContext'
import { getConfigForHostname } from '../../../helpers/tenantHelper'
import { TENANTS } from '../../../common/constants'

const { tenant } = getConfigForHostname()

const DefaultFeaturesList = ({ tenant, features, isSublayout }) => {
  const tenantLayout = useTenantConfig(tenant)
  const { t } = useTranslation('common')

  return (
    <div className='default-ai-chatbox-list-container'>
      {features?.map((feature, index) => (
        <DefaultFeature
          feature={feature}
          background={tenantLayout?.aiChatBox?.highlightCardBackground}
          key={index}
          isSublayout={isSublayout}
        />
      ))}
      <DefaultFeature
        feature={{ title: t('aiChatbox.viewAllFeaturesCTA') }}
        background={tenantLayout?.aiChatBox?.viewAllBtnCTA.background}
        border={tenantLayout?.aiChatBox?.viewAllBtnCTA.border}
        textDecoration={tenantLayout?.aiChatBox?.viewAllBtnCTA.textDecoration}
        isSublayout={isSublayout}
        viewAllFeatures={true}
      />
    </div>
  )
}

const DefaultFeature = ({
  feature,
  background,
  border,
  textDecoration,
  isSublayout = false,
  viewAllFeatures = false
}) => {
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)
  const handleFeatureNavigation = (feature_id) => {
    const navigationUrl = feature_id
      ? `/ai-chatbox/${feature_id}`
      : '/ai-chatbox-features'
    navigate(navigationUrl, {
      state: { from: isSublayout ? 'feature-page' : '' }
    })
  }

  return (
    <div
      className='default-ai-chatbox-list-card'
      style={{
        background: background,
        border: border,
        textDecoration: textDecoration
      }}
      onClick={() => {
        // Google Analytics
        if (authorizationId && viewAllFeatures) {
          const properties = {
            external_id: authorizationId,
            app_name: 'ai_app_new',
            tenant: tenant,
            explore_version: tenantLayout?.exploreVersion || 'V4'
          }
          trackEvent('ai_view_more_click', properties)
        }
        handleFeatureNavigation(feature.feature_id)
      }}
    >
      <div className='default-ai-chatbox-list-text flex items-center gap-3 w-full p-4 border rounded-full hover:bg-gray-100 transition'>
        {feature.icon_url && <img src={feature.icon_url} alt='feature_icon' />}
        {tenant === TENANTS.POVO
          ? String(feature.title).normalize('NFKC')
          : feature.title}
      </div>
    </div>
  )
}

DefaultFeature.propTypes = {
  feature: PropTypes.object,
  background: PropTypes.string,
  border: PropTypes.string,
  textDecoration: PropTypes.string,
  isSublayout: PropTypes.bool,
  viewAllFeatures: PropTypes.bool
}

DefaultFeaturesList.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  tenant: PropTypes.string,
  isSublayout: PropTypes.bool
}

export default DefaultFeaturesList
