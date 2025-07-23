import React from 'react'
import TimerIcon from '../../../../static/TimerIcon'
import CheckedIcon from '../../../../static/CheckedIcon'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const Badge = ({ count, isTimer, tenantLayout }) => {
  return (
    <div
      className='ai-store-trivia-question-metadata-badge'
      style={{
        color: tenantLayout?.trivia?.dailyQuiz?.indicatingTextColor
      }}
    >
      {isTimer ? <TimerIcon /> : <CheckedIcon />}
      <div
        className='ai-store-trivia-question-metadata-count'
        style={{
          color: tenantLayout?.trivia?.dailyQuiz?.indicatingTextColor
        }}
      >
        {count}
      </div>
    </div>
  )
}

Badge.propTypes = {
  count: PropTypes.number.isRequired,
  isTimer: PropTypes.bool.isRequired,
  tenantLayout: PropTypes.object
}

const TriviaQuestionMetaData = ({
  color,
  currentQuestion,
  totalQuestions,
  timer,
  correctAnswerCount
}) => {
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  return (
    <div className='ai-store-trivia-question-metadata'>
      <Badge
        count={correctAnswerCount}
        isTimer={false}
        tenantLayout={tenantLayout}
      />
      <div
        className='ai-store-trivia-question-counts'
        style={{
          color: color && tenantLayout?.trivia?.dailyQuiz?.headerCounterColor
        }}
      >
        {currentQuestion + 1} {t('trivia.of')} {totalQuestions}
      </div>
      <Badge count={timer} isTimer={true} tenantLayout={tenantLayout} />
    </div>
  )
}

TriviaQuestionMetaData.propTypes = {
  color: PropTypes.string.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  timer: PropTypes.number.isRequired,
  correctAnswerCount: PropTypes.number.isRequired
}

export default TriviaQuestionMetaData
