import React from 'react'
import TriviaHome from './TriviaHome'
import { TriviaContextProvider } from '../../../context/TriviaContext'

const Trivia = () => {
  return (
    <TriviaContextProvider>
      <TriviaHome />
    </TriviaContextProvider>
  )
}

export default Trivia
