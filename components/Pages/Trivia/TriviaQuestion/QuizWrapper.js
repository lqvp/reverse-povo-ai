import React from 'react'
import TriviaQuestion from '.'
import { TriviaContextProvider } from '../../../../context/TriviaContext'

const QuizWrapper = () => {
  return (
    <TriviaContextProvider>
      <TriviaQuestion />
    </TriviaContextProvider>
  )
}

export default QuizWrapper
