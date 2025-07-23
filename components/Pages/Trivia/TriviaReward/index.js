import React, { useState, useEffect } from 'react'
import { REWARD_LAYOUT_CONFIG } from '../../../../common/constants'
import CheckedIcon from '../../../../static/CheckedIcon'
import './index.css'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import TriviaBackIcon from '../../../../static/TriviaBackIcon'
import { useTriviaContext } from '../../../../context/TriviaContext'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { formatDateToDDMMMYYYY } from '../../../../helpers/helperFunctions'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'

const { tenant } = getConfigForHostname()

const OtherTriviaPlayCard = ({ uiConfig, category, quizDate }) => {
  const [counter, setCounter] = useState(5)
  const [counterWidth, setCounterWidth] = useState(20)
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1)
      setCounterWidth((prevWidth) => prevWidth + 16)
    }, 1000)

    return () => {
      clearInterval(timer)
      setCounterWidth(20)
    }
  }, [])

  const fontSize =
    category.category_id === 'entertainment' ||
    category.category_id === 'generalKnowledge' ||
    category.category_id === 'dailyQuiz'
      ? '1.15rem'
      : '1.625rem'

  return (
    <div
      className='ai-store-trivia-completion-otc-wrapper'
      style={{ backgroundColor: tenantLayout?.trivia?.dailyQuiz?.nextCTAColor }}
    >
      <div className={`ai-store-trivia-completion-otc-image ${tenant}`}>
        <img
          src={
            category?.category_id === 'dailyQuiz'
              ? tenantLayout?.trivia?.dailyQuizIcon
              : category.image_url
          }
          alt='other-icon-media'
        />
      </div>
      <div className={`ai-store-trivia-completion-otc-wrap-new-play ${tenant}`}>
        <p
          className={`ai-store-trivia-completion-otc-name ${tenant}`}
          style={{
            color: uiConfig.secondaryColor,
            fontSize
          }}
        >
          {category.title}
        </p>
        <p className={`ai-store-trivia-completion-otc-date ${tenant}`}>
          {quizDate ? formatDateToDDMMMYYYY(quizDate) : ''}
        </p>
      </div>
      <div
        className={`ai-store-trivia-completion-otc-counter ${tenant}`}
        style={{
          backgroundColor: tenantLayout?.trivia?.dailyQuiz?.progressBgColor,
          '--shapeColor':
            tenantLayout?.trivia?.dailyQuiz?.progressSecondaryColor,
          '--shapeWidth': `${counterWidth}%`
        }}
      >
        <p>
          {t('trivia.nextChallengeIn')} {counter} {t('trivia.sec')}
        </p>
      </div>
    </div>
  )
}

OtherTriviaPlayCard.propTypes = {
  uiConfig: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  quizDate: PropTypes.string
}

const TriviaReward = ({
  result,
  resetAllState,
  quizDate,
  setIsQuizCompleted,
  prevSelectedConfig
}) => {
  const { authorizationId } = useAppContext()
  const {
    selectedCategory: category,
    selectedLayoutConfig: uiConfig,
    allQuizes,
    currentQuizIndex,
    setTotalQuestions,
    setQuizData
  } = useTriviaContext()
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const exitHandler = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_trivia',
      category_name: category?.category_id || 'NA',
      screen_name: 'trivia_success_screen'
    }
    trackEvent(`trivia_back_home`, properties)
    navigate(-1)
  }

  const startNewQuizHandler = () => {
    const properties = {
      external_id: authorizationId,
      category_name: category?.category_id,
      screen_name: 'trivia_success_screen',
      app_name: 'ai_trivia'
    }
    trackEvent(`trivia_category`, properties)
    resetAllState()
    const quiz = allQuizes[currentQuizIndex]
    setQuizData(quiz)
    setTotalQuestions(quiz?.questions?.length ?? 0)
    navigate(`/trivia-details?category=${category?.category_id}`, {
      replace: true
    })
    setIsQuizCompleted(false)
  }

  useEffect(() => {
    if (category?.category_id) {
      const timer = setTimeout(() => {
        startNewQuizHandler()
      }, 5000)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line
  }, [category?.category_id])

  return (
    <div className='ai-store-trivia-completion-reward-wrapper main-body-wrapper'>
      <div
        className={`ai-store-trivia-completion-reward-container ${tenant}`}
        style={{
          background:
            prevSelectedConfig &&
            tenantLayout?.trivia?.dailyQuiz?.tertiaryColorGrad
        }}
      >
        <div
          className='ai-store-trivia-completion-reward-banner'
          style={{
            backgroundImage: `url(${REWARD_LAYOUT_CONFIG.sparklePngPath}),
                      radial-gradient(50% 50% at 50% 50%, ${tenantLayout?.trivia?.dailyQuiz?.primaryColorGrad} 0%, ${tenantLayout?.trivia?.dailyQuiz?.tertiaryColorGrad} 100%)`,
            height: category?.category_id ? '83%' : '100%'
          }}
        ></div>
        <div className='ai-store-trivia-completion-reward-desc'>
          <div className='ai-store-trivia-back-icon-btn' onClick={exitHandler}>
            <TriviaBackIcon />
          </div>
          <div>
            <p className='ai-store-trivia-completion-reward-desc-title'>
              {t('trivia.challenge')}
            </p>
            <p className='ai-store-trivia-completion-reward-desc-status'>
              {t('trivia.complete')}
            </p>
          </div>
          <div className='ai-store-trivia-spacer'></div>
        </div>
        <img
          src={REWARD_LAYOUT_CONFIG.rewardCupPngPath}
          alt='reward-icon-media'
        />
        <div className='ai-store-trivia-completion-reward-result'>
          <div className='ai-store-trivia-completion-reward-result-icon'>
            <CheckedIcon />
          </div>
          <div className='ai-store-trivia-completion-reward-result-score'>
            {result.correctResponse}/{result.totalQuestions}
          </div>
        </div>
        {category && (
          <div className='ai-store-trivia-completion-reward-cards-wrapper'>
            <OtherTriviaPlayCard
              key={`other-games-card-${category?.category_id}`}
              resetAllState={resetAllState}
              uiConfig={uiConfig}
              category={category}
              quizDate={quizDate}
            />
          </div>
        )}
      </div>
      <div className='ai-store-trivia-completion-other-section'>
        <div
          className={`ai-store-trivia-completion-reward-card-cta outline-cta ${tenant}`}
          style={{
            fontFamily: tenantLayout?.trivia?.title?.fontFamily,
            fontSize: tenantLayout?.trivia?.title?.medFontSize,
            fontWeight: tenantLayout?.trivia?.title?.fontWeightSemiBold,
            color: tenantLayout?.trivia?.dailyQuiz?.ctaSecondaryColor,
            borderColor: tenantLayout?.trivia?.dailyQuiz?.ctaSecondaryColor
          }}
          onClick={exitHandler}
        >
          {t('trivia.back')}
        </div>
        {category && (
          <div
            className={`ai-store-trivia-completion-reward-card-cta ${tenant}`}
            style={{
              fontFamily: tenantLayout?.trivia?.title?.fontFamily,
              fontSize: tenantLayout?.trivia?.title?.medFontSize,
              fontWeight: tenantLayout?.trivia?.title?.fontWeightSemiBold,
              backgroundColor:
                tenantLayout?.trivia?.dailyQuiz?.ctaSecondaryColor,
              borderColor: tenantLayout?.trivia?.dailyQuiz?.ctaSecondaryColor
            }}
            onClick={startNewQuizHandler}
          >
            {t('trivia.continue')}
          </div>
        )}
      </div>
    </div>
  )
}

TriviaReward.propTypes = {
  result: PropTypes.object.isRequired,
  resetAllState: PropTypes.func.isRequired,
  quizDate: PropTypes.string,
  setIsQuizCompleted: PropTypes.func.isRequired,
  prevSelectedConfig: PropTypes.object.isRequired
}

export default TriviaReward
