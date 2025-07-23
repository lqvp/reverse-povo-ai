import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const updateResponses = (
  question_id,
  option_id,
  is_correct,
  setUserResponse
) => {
  const newResponse = {
    question_id,
    option_id,
    correct: is_correct
  }

  setUserResponse((prev) => {
    const isOptionIdPresent = prev?.some(
      (item) => item?.option_id === newResponse?.option_id
    )
    return isOptionIdPresent ? prev : [...prev, newResponse]
  })
}

const TriviaOptions = ({
  options,
  setCorrectAnswerCount,
  setResponseType,
  setIsOptionSelected,
  timer,
  nextHandler,
  setUserResponse,
  question_id
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const getOptionClass = (selectedAnswer, option) => {
    if (!selectedAnswer) return 'default'
    return option?.option_id === selectedAnswer
      ? option?.is_correct
        ? 'correct'
        : 'wrong'
      : option?.is_correct
        ? 'correct'
        : ''
  }

  const handleOptionClick = useCallback(
    (option) => {
      if (selectedAnswer || timer === 0) return
      setIsOptionSelected(true)
      setSelectedAnswer(option?.option_id)
      nextHandler()
      if (option?.is_correct) setCorrectAnswerCount((prev) => prev + 1)
      option?.is_correct
        ? setResponseType('correct')
        : setResponseType('incorrect')

      updateResponses(
        question_id,
        option?.option_id,
        option?.is_correct,
        setUserResponse
      )
    },
    [
      selectedAnswer,
      timer,
      setIsOptionSelected,
      nextHandler,
      setCorrectAnswerCount,
      setResponseType,
      setUserResponse,
      question_id
    ]
  )

  useEffect(() => {
    if (timer === 0 && !selectedAnswer) {
      const correctOption = options?.find((option) => option?.is_correct)
      correctOption && setSelectedAnswer(correctOption?.option_id)
      setResponseType('timeout')
      setIsOptionSelected(true)
      nextHandler()
      setTimeout(() => {
        setSelectedAnswer(null)
        setResponseType('')
        setIsOptionSelected(false)
      }, 3000)
    }
  }, [
    timer,
    selectedAnswer,
    options,
    nextHandler,
    setIsOptionSelected,
    setResponseType,
    setUserResponse
  ])

  return (
    <div className={`ai-store-trivia-options ${tenant}`}>
      {options?.map((option, index) => (
        <div
          key={index}
          className={`ai-store-trivia-option ${tenant} ${getOptionClass(
            selectedAnswer,
            option
          )}`}
          onClick={() => handleOptionClick(option)}
        >
          <div className={`ai-store-trivia-option-text ${tenant}`}>
            {option.text}
          </div>
        </div>
      ))}
    </div>
  )
}

TriviaOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      option_id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      text_locale: PropTypes.string.isRequired,
      is_correct: PropTypes.bool.isRequired
    })
  ).isRequired,
  setCorrectAnswerCount: PropTypes.func.isRequired,
  setResponseType: PropTypes.func.isRequired,
  setIsOptionSelected: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  nextHandler: PropTypes.func.isRequired,
  setUserResponse: PropTypes.func.isRequired,
  question_id: PropTypes.string.isRequired
}

export default TriviaOptions
