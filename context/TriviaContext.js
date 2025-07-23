import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'
import common from '@kelchy/common'
import { axiosGet } from '../utils/axios'
import Loader from '../components/Loader/Loader'
import { BASIC_UI_CONFIG_TRIVIA, TRIVIA_CATEGORIES } from '../common/constants'
import PropTypes from 'prop-types'

const TriviaContext = createContext()

export const useTriviaContext = () => useContext(TriviaContext)

export const TriviaContextProvider = ({ children }) => {
  const [quizCategories] = useState([...[TRIVIA_CATEGORIES[0]]])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedLayoutConfig, setSelectedLayoutConfig] = useState(null)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [allQuizes, setAllQuizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizLoading, setQuizLoading] = useState(true)
  const [quizData, setQuizData] = useState(null)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const getActiveQuizes = useCallback(async () => {
    const { data: quiz } = await common.awaitWrap(
      axiosGet(`/quiz/get_active_user_quizes`, {})
    )

    if (quiz?.data) {
      setAllQuizes(quiz?.data)
    }
    setLoading(false)
    setQuizLoading(false)
  }, [])

  // To be used when multiple quiz category functionality is re-instated.
  // const getActiveQuizCategory = useCallback(async () => {
  //   const { data: quizCategory } = await common.awaitWrap(
  //     axiosGet(`/quiz/category/active`, {})
  //   )

  //   if (quizCategory?.data) {
  //     const dailyQuizCategory = TRIVIA_CATEGORIES[0]
  //     setQuizCategories([dailyQuizCategory, ...quizCategory?.data])
  //   }
  //   setLoading(false)
  // }, [])

  useEffect(() => {
    // To be used when multiple quiz category functionality is re-instated.
    // getActiveQuizCategory()
    getActiveQuizes()
  }, [getActiveQuizes])

  useEffect(() => {
    if (allQuizes.length && quizCategories.length) {
      const firstQuiz = allQuizes[0]
      const selectedQuizCategory = quizCategories.find(
        (category) => category?.category_id === firstQuiz?.category_id
      )
      setSelectedCategory(selectedQuizCategory)
      const categoryIndex =
        selectedQuizCategory?.category_id === 'dailyQuiz'
          ? 0
          : selectedQuizCategory?.order_rank - (1 % quizCategories.length)
      setSelectedLayoutConfig(BASIC_UI_CONFIG_TRIVIA[categoryIndex])
      setQuizData(firstQuiz)
      setTotalQuestions(firstQuiz?.questions?.length ?? 0)
    } else {
      setSelectedLayoutConfig(BASIC_UI_CONFIG_TRIVIA[0])
    }
  }, [allQuizes, quizCategories])

  return (
    <TriviaContext.Provider
      value={{
        quizCategories,
        selectedCategory,
        setSelectedCategory,
        selectedLayoutConfig,
        setSelectedLayoutConfig,
        currentQuizIndex,
        setCurrentQuizIndex,
        allQuizes,
        quizData,
        setQuizData,
        totalQuestions,
        setTotalQuestions
      }}
    >
      {loading || quizLoading ? <Loader /> : children}
    </TriviaContext.Provider>
  )
}

TriviaContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}
