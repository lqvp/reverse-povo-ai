import React from 'react'
import TriviaBackIcon from '../../../../static/TriviaBackIcon'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import GreenCheckedIcon from '../../../../static/GreenCheckedIcon'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getTenantName } from '../../../../helpers/tenantHelper'

const tenant = getTenantName()

const TriviaNoData = ({
  theme,
  title,
  subText,
  backBtnText,
  isHomePage,
  subText2
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const backToHomeHandler = () => {
    navigate(-1)
  }

  return (
    <div
      className={`ai-store-trivia-no-data-wrapper ${
        isHomePage ? 'home-page-no-data' : ''
      }`}
    >
      <div
        className='ai-store-trivia-no-data-container'
        style={{ background: tenantLayout?.trivia?.dailyQuiz?.primaryColor }}
      >
        <div className={`ai-store-trivia-no-data-content ${tenant}`}>
          <div
            className='ai-store-trivia-no-data-back-btn'
            onClick={backToHomeHandler}
          >
            <TriviaBackIcon />
          </div>
          {isHomePage && <GreenCheckedIcon />}
          <h4
            style={{
              color: tenantLayout?.trivia?.dailyQuiz?.secondaryTextColor,
              fontFamily: tenantLayout?.trivia?.title?.fontFamily,
              fontWeight: tenantLayout?.trivia?.title?.fontWeightBold,
              fontSize: tenantLayout?.trivia?.title?.largeFontSize
            }}
          >
            {title ?? t('trivia.oops')}
          </h4>
          <div className='ai-store-trivia-no-data-description'>
            <p>{subText ?? t('trivia.quizDataNotFound')}</p>
            {subText2 && <p className='text-2'>{subText2}</p>}
          </div>
        </div>
      </div>
      <div className='ai-store-trivia-no-data-btn-container'>
        <div
          className={`ai-store-trivia-completion-reward-card-cta ${tenant}`}
          style={{
            color: theme && tenantLayout?.trivia?.dailyQuiz?.secondaryColor,
            fontFamily: tenantLayout?.trivia?.title?.fontFamily
          }}
          onClick={backToHomeHandler}
        >
          {backBtnText ?? t('trivia.backToHome')}
        </div>
      </div>
    </div>
  )
}

TriviaNoData.propTypes = {
  theme: PropTypes.shape({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string
  }).isRequired,
  title: PropTypes.string,
  subText: PropTypes.string,
  backBtnText: PropTypes.string,
  isHomePage: PropTypes.bool,
  subText2: PropTypes.string
}

export default TriviaNoData
