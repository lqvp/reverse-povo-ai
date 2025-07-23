import React from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import TriviaWelcome from './TriviaWelcome'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import { useTriviaContext } from '../../../../context/TriviaContext'
import TriviaNoData from '../TriviaQuestion/TriviaNoData'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const TriviaHome = () => {
  const { authorizationId } = useAppContext()
  const { selectedCategory, selectedLayoutConfig } = useTriviaContext()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  useEffect(() => {
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        app_name: 'ai_trivia',
        category_name: 'dailyQuiz'
      }
      trackEvent(`user_landed_trivia`, properties)
    }
    // eslint-disable-next-line
  }, [authorizationId])

  const triviaBeginHandler = () => {
    if (selectedCategory?.category_id) {
      const category_id = selectedCategory?.category_id
      const properties = {
        external_id: authorizationId,
        app_name: 'ai_trivia',
        category_name: category_id
      }
      trackEvent(`trivia_start_quiz`, properties)
      navigate(`/trivia-details?category=${category_id}`, {
        replace: true
      })
    }
  }

  return (
    <>
      {selectedCategory ? (
        <TriviaWelcome clickHandler={triviaBeginHandler} />
      ) : (
        <TriviaNoData
          theme={selectedLayoutConfig}
          title={t('trivia.youAreAllCaughtUp')}
          subText={t('trivia.weAddNewQuizzesEveryday')}
          subText2={t('trivia.youCanComeBackTomorrow')}
          backBtnText={t('trivia.backToExplore')}
          isHomePage={true}
        />
      )}
    </>
  )
}

export default TriviaHome
