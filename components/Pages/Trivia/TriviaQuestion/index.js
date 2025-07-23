import React, { useState, useEffect, useRef } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'
import TriviaQuestionCard from './TriviaQuestionCard'
import TriviaQuestionMetaData from './TriviaQuestionMetaData'
import TriviaReward from '../TriviaReward/index'
import Slider from 'react-slick'
import common from '@kelchy/common'
import { axiosPost } from '../../../../utils/axios'
import TriviaNoData from './TriviaNoData'
import { useTriviaContext } from '../../../../context/TriviaContext'
import { BASIC_UI_CONFIG_TRIVIA } from '../../../../common/constants'
import TriviaCloseIcon from '../../../../static/triviaCrossIcon'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const TriviaQuestion = () => {
  const { authorizationId } = useAppContext()
  const {
    quizCategories,
    selectedLayoutConfig: theme,
    currentQuizIndex,
    setCurrentQuizIndex,
    allQuizes,
    selectedCategory,
    setSelectedCategory,
    setSelectedLayoutConfig,
    quizData,
    totalQuestions
  } = useTriviaContext()
  const prevSelectedConfigRef = useRef(null)
  const sliderRef = useRef(null)
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0)
  const [userResponse, setUserResponse] = useState([])
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [timer, setTimer] = useState(15)

  const createUserResponse = async () => {
    await common.awaitWrap(
      axiosPost(`/quiz_response/create_response`, {
        quiz_id: quizData?.quiz_id,
        order_rank: quizData?.order_rank ?? 0,
        questions_answered: totalQuestions,
        response: userResponse
      })
    )
  }

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(
        () => setTimer((prevTimer) => prevTimer - 1),
        1000
      )
      return () => clearInterval(interval)
    }
  }, [timer])

  useEffect(() => {
    if (allQuizes.length) {
      const quiz = allQuizes[currentQuizIndex]
      const selectedQuizCateroy = quizCategories?.find(
        (category) => category?.category_id === quiz?.category_id
      )
      setSelectedCategory(selectedQuizCateroy)
    }
  }, [currentQuizIndex, allQuizes, quizCategories, setSelectedCategory])

  useEffect(() => {
    if (selectedCategory?.order_rank && quizCategories.length) {
      setSelectedLayoutConfig(
        BASIC_UI_CONFIG_TRIVIA[
          (selectedCategory?.order_rank - 1) % quizCategories.length
        ]
      )
    }
  }, [
    selectedCategory?.order_rank,
    quizCategories.length,
    setSelectedLayoutConfig
  ])

  useEffect(() => {
    prevSelectedConfigRef.current = theme
  }, [theme])

  const handleBeforeChange = (currentSlide, nextSlide) => {
    if (currentSlide === totalQuestions - 1) {
      if (currentQuizIndex <= allQuizes?.length) {
        setCurrentQuizIndex((prevIndex) => prevIndex + 1)
      }
      setIsQuizCompleted(true)
      createUserResponse()
    } else {
      setCurrentQuestion(nextSlide)
      setTimer(15)
    }
  }

  const nextHandler = () => {
    setTimer(0)
    setTimeout(() => sliderRef?.current?.slickNext(), 3000)
  }

  const resetAllState = () => {
    setCorrectAnswerCount(0)
    setCurrentQuestion(0)
    setTimer(15)
    setUserResponse([])
  }

  const handleOnClose = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_trivia',
      category_name: selectedCategory?.category_id || 'NA',
      screen_name: 'trivia_quiz_screen'
    }
    trackEvent(`trivia_back_home`, properties)
    navigate(-1)
  }

  return (
    <>
      {!isQuizCompleted ? (
        <>
          {quizData && quizData?.questions?.length ? (
            <>
              <div className='ai-store-trivia-question-wrapper main-body-wrapper'>
                <div
                  className='ai-store-question-close'
                  onClick={handleOnClose}
                >
                  <div className='ai-store-question-close-circle'>
                    <TriviaCloseIcon />
                  </div>
                </div>
                <TriviaQuestionMetaData
                  color={theme?.headerCounterColor}
                  currentQuestion={currentQuestion}
                  totalQuestions={totalQuestions}
                  timer={timer}
                  correctAnswerCount={correctAnswerCount}
                />
                <Slider
                  dots={false}
                  arrows={false}
                  infinite={false}
                  speed={300}
                  slidesToShow={1}
                  slidesToScroll={1}
                  swipeToSlide={false}
                  touchMove={false}
                  initialSlide={currentQuestion}
                  beforeChange={handleBeforeChange}
                  className='ai-store-trivia-question-slider'
                  ref={sliderRef}
                >
                  {quizData?.questions?.map((item) => (
                    <div
                      className='ai-store-trivia-question-container'
                      key={item?.question}
                    >
                      <TriviaQuestionCard
                        item={item}
                        setCorrectAnswerCount={setCorrectAnswerCount}
                        timer={timer}
                        theme={theme}
                        nextHandler={nextHandler}
                        setUserResponse={setUserResponse}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          ) : (
            <TriviaNoData theme={theme} />
          )}
        </>
      ) : (
        <TriviaReward
          result={{
            correctResponse: correctAnswerCount,
            totalQuestions: totalQuestions
          }}
          resetAllState={resetAllState}
          quizDate={quizData?.created_at}
          setIsQuizCompleted={setIsQuizCompleted}
          prevSelectedConfig={prevSelectedConfigRef.current}
        />
      )}
    </>
  )
}

export default TriviaQuestion
