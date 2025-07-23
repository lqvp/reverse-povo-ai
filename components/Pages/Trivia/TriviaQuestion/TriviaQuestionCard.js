import React, { useState } from 'react'
import PropTypes from 'prop-types'
import QuestionOverlay from './QuestionOverlay'
import TriviaOptions from './TriviaOptions'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const TriviaQuestionCard = ({
  item,
  setCorrectAnswerCount,
  timer,
  theme,
  nextHandler,
  setUserResponse
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false)
  const [responseType, setResponseType] = useState('')
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  return (
    <>
      <div
        className='ai-store-trivia-question-top'
        style={{
          background: theme && tenantLayout?.trivia?.dailyQuiz?.primaryColor
        }}
      >
        <div className='ai-store-trivia-question-card'>
          {isOptionSelected && (
            <QuestionOverlay
              responseType={responseType}
              isOptionSelected={isOptionSelected}
            />
          )}
          {item?.question_image_url && (
            <img
              src={item?.question_image_url}
              alt={t('trivia.triviaQuestion')}
              className='ai-store-trivia-question-thumbnail'
            />
          )}
          {item?.question && (
            <div
              className={`ai-store-trivia-question ${item?.question_image_url ? 'image' : 'no-image'} ${tenant}`}
            >
              {item?.question}
            </div>
          )}
        </div>
      </div>
      <TriviaOptions
        options={item?.options}
        setCorrectAnswerCount={setCorrectAnswerCount}
        setResponseType={setResponseType}
        setIsOptionSelected={setIsOptionSelected}
        timer={timer}
        nextHandler={nextHandler}
        setUserResponse={setUserResponse}
        question_id={item?.question_id}
      />
    </>
  )
}

TriviaQuestionCard.propTypes = {
  item: PropTypes.shape({
    question: PropTypes.string.isRequired,
    question_id: PropTypes.string.isRequired,
    question_image_url: PropTypes.string,
    question_locale: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        option_id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        text_locale: PropTypes.string.isRequired,
        is_correct: PropTypes.bool.isRequired
      })
    ).isRequired
  }).isRequired,
  setCorrectAnswerCount: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    primaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    headerCounterColor: PropTypes.string.isRequired,
    tertiaryColor: PropTypes.string.isRequired
  }),
  nextHandler: PropTypes.func.isRequired,
  setUserResponse: PropTypes.func.isRequired
}

export default TriviaQuestionCard
