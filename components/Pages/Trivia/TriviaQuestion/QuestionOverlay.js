import React from 'react'
import TriviaTimeoutIcon from '../../../../static/TriviaTimeoutIcon'
import { REWARD_LAYOUT_CONFIG } from '../../../../common/constants'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'

const { tenant } = getConfigForHostname()

const getResponseType = (responseType, t, tenantLayout) => {
  switch (responseType) {
    case 'correct':
      return {
        background: `url(${REWARD_LAYOUT_CONFIG.sparkleQuestionCardPath}), 
            radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.8)  0%, rgba(0,0,0,.6) 100%)`,
        title: t('trivia.thatIsCorrect'),
        mb: 6,
        icon: () => (
          <img
            src={tenantLayout?.trivia?.correctIcon}
            alt={t('trivia.correctAnswer')}
          />
        )
      }
    case 'incorrect':
      return {
        background:
          'radial-gradient(50% 50% at 50% 50%, rgba(188,63,63,.8)  0%, rgba(0,0,0,.6) 100%)',
        title: t('trivia.wrong'),
        mb: 24,
        icon: () => (
          <img
            src={tenantLayout?.trivia?.inCorrectIcon}
            alt={t('trivia.incorrectAnswer')}
          />
        )
      }
    case 'timeout':
      return {
        background:
          'radial-gradient(50% 50% at 50% 50%, rgba(188,63,63,.8)  0%, rgba(0,0,0,.6) 100%)',
        title: t('trivia.timeIsUp'),
        mb: 19,
        icon: () => <TriviaTimeoutIcon />
      }
    default:
      return { background: '', title: '' }
  }
}

const QuestionOverlay = ({ responseType }) => {
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)
  const overlayConfig = getResponseType(responseType, t, tenantLayout)
  return (
    <div
      className='ai-store-trivia-question-overlay'
      style={{
        width: '100%',
        backgroundImage: overlayConfig.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        className='ai-store-trivia-question-overlay-text'
        style={{ marginBottom: `${overlayConfig.mb}px` }}
      >
        {overlayConfig.title}
      </div>
      <div className='ai-store-trivia-question-overlay-icon'>
        {overlayConfig.icon()}
      </div>
    </div>
  )
}

QuestionOverlay.propTypes = {
  responseType: PropTypes.string.isRequired
}

export default QuestionOverlay
