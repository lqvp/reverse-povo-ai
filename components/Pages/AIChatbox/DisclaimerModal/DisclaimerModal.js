import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './DisclaimerModal.css'
import { useTranslation } from 'react-i18next'
import AIStylistIcon from '../../../../static/AIStylistIcon'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useAppContext } from '../../../../context/AppContext'
import { useTenantConfig } from '../../../../useTenantConfig'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const { tenant } = getConfigForHostname()

const DisclaimerModal = ({ open, setOpen }) => {
  const [accepted, setAccepted] = useState(false)
  const [startY, setStartY] = useState(null)
  const [currentY, setCurrentY] = useState(0)
  const { authorizationId, appVersion } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)
  const { t } = useTranslation('common')

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e) => {
    if (startY !== null) {
      const diff = e.touches[0].clientY - startY
      if (diff > 0) {
        setCurrentY(diff)
      }
    }
  }

  const handleTouchEnd = () => {
    if (currentY > 100) {
      setOpen(false)
    }
    setStartY(null)
    setCurrentY(0)
  }

  if (!open) return null

  return (
    <div
      className='ai-chatbox-consent-drawer-overlay'
      onClick={() => setOpen(false)}
    >
      <div
        className='ai-chatbox-consent-drawer-drawer'
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateY(${currentY}px)` }}
      >
        <div className='ai-chatbox-consent-drawer-header'>
          <div className='ai-chatbox-consent-drawer-header-wrapper'>
            <h2>{t('aiChatbox.consentModal.title')}</h2>
            <div
              className='widget-navigation-drawer-close'
              onClick={() => setOpen(false)}
            >
              <AIStylistIcon
                kind={`close-${tenant}-icon`}
                width={24}
                height={24}
                color='#1F2D3D'
              />
            </div>
          </div>
        </div>
        <div className='ai-chatbox-consent-drawer-content'>
          <p>{t('aiChatbox.consentModal.desc')}</p>
          <label className='ai-chatbox-consent-drawer-checkbox-container'>
            <input
              type='checkbox'
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            {t('aiChatbox.consentModal.checkbox')}
          </label>
          <button
            className='ai-chatbox-consent-drawer-continue-button'
            disabled={!accepted}
            onClick={() => {
              // Google Analytics
              if (authorizationId) {
                const properties = {
                  external_id: authorizationId,
                  feature_name: 'ai-chatbox-consent-modal',
                  app_version: appVersion,
                  tenant: tenant,
                  explore_version: tenantLayout?.exploreVersion || 'V4',
                  event_source: 'ai_chatbox_page'
                }
                trackEvent('ai_assistant_consent_modal_submit', properties)
              }
              setOpen(false)
            }}
          >
            {t('aiChatbox.consentModal.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}

DisclaimerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
}

export default DisclaimerModal
