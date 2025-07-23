import React, { useCallback, useEffect } from 'react'
import './index.css'
import Header from '../Header'
import Button from '../Button'
import AIStylistIcon from '../../../../static/AIStylistIcon'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useTokenisationContext } from '../../../../context/TokenisationContext'
import { useFeatureAllowed } from '../../../../helpers/tenantHelper'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../helpers/constant'

const STEPS = [
  {
    title: 'aiStylist.step1',
    description: 'aiStylist.step1Message',
    icon: 'face_id'
  },
  {
    title: 'aiStylist.step2',
    description: 'aiStylist.step2Message',
    icon: 'cloth_hanger'
  },
  {
    title: 'aiStylist.step3',
    description: 'aiStylist.step3Message',
    icon: 'ai_star'
  }
]

const AIStylistHome = ({ handlePageChange }) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    }
    trackEvent('stylist_landing_impression', properties)
  }, [authorizationId])

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_ai_stylist_lp_impression`,
        app_name: `ai_stylist`,
        event: `user_engaged_ai_stylist`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType])

  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  return (
    <div className='ai-stylist-home-container'>
      <Header color='#333' title='AI Stylist' />
      <div className='ai-stylist-home-right-top-circle'></div>
      <div className='ai-stylist-home-bottom-left-circle'></div>
      <div className='ai-stylist-home-text'>{t('aiStylist.homeTitle')}</div>
      <img
        className='ai-stylist-home-model-image'
        src='/images/ai_stylist/home-page-model.png'
        alt=''
      />
      <div className='ai-stylist-steps'>
        {STEPS?.map((step) => (
          <div className='ai-stylist-step' key={t(step?.title)}>
            <AIStylistIcon kind={step?.icon} width={40} height={40} />
            <div className='ai-stylist-step-description'>
              {t(step?.description)}
            </div>
          </div>
        ))}
      </div>
      <div className='ai-stylist-home-cta-container'>
        <Button filled={true} full={true} onClick={handlePageChange}>
          {t('aiStylist.createOutfit')}
        </Button>
      </div>
    </div>
  )
}

AIStylistHome.propTypes = {
  handlePageChange: PropTypes.func.isRequired
}

export default AIStylistHome
