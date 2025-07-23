import React, { useCallback, useEffect, useRef, useState } from 'react'
import common from '@kelchy/common'
import { RIDDLE_POLL_LAYOUT } from '../../../../common/constants'
import './index.css'
import { axiosGetPoll, axiosPostPoll } from '../../../../utils/pollingGameAxios'
import PollingCard from './PollingCard'
import {
  getAggregateData,
  getStats
} from '../../../../helpers/pollingGameHelper'
import Loader from '../../../Loader/Loader'
import { Box } from '@mui/material'
import RiddlePollIcons from '../../../../static/riddlePollIcons'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../../../useTenantConfig'

const pollLayout = RIDDLE_POLL_LAYOUT['poll']

const PollingGameSection = ({ externalId, tenant }) => {
  const [pollQuestions, setPollQuestions] = useState([])
  const [pollErrorResponse, setPollErrorResponse] = useState(null)
  const [userResponse, setUserResponse] = useState(null)
  const [aggregateResponse, setAggregateResponse] = useState(null)
  const [pollId, setPollId] = useState(null)
  const [completedResponse, setCompletedResponse] = useState([])
  const [responseFetching, setResponseFetching] = useState(true)
  const [submittingResponse, setSubmittingResponse] = useState(false)
  const [layoutAdjusting, setLayoutAdjusting] = useState(true)
  const [responseStats, setResponseStats] = useState(null)
  const pollSliderRef = useRef(null)
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const handleAfterChange = (currentIndex) => {
    if (pollQuestions?.length > 0) {
      const totalSlides = pollQuestions?.length - 1
      const nextArrow = document.querySelector(
        '.poll-slider .slick-arrow.slick-next'
      )
      const prevArrow = document.querySelector(
        '.poll-slider .slick-arrow.slick-prev'
      )
      const slides = Array.from(document.querySelectorAll('.slick-slide'))

      if (currentIndex > 0) {
        prevArrow.style.visibility = 'visible'
      } else {
        prevArrow.style.visibility = 'hidden'
      }

      let nextSlide = null
      slides.forEach((slide, index) => {
        if (
          slide.classList.contains('slick-active') &&
          slide.classList.contains('slick-center') &&
          slide.classList.contains('slick-current')
        ) {
          if (index + 1 < slides.length) {
            nextSlide = slides[index + 1]
          }
        }
      })

      if (currentIndex === totalSlides) {
        nextArrow.style.visibility = 'hidden'
        if (nextSlide) {
          nextSlide.style.visibility = 'hidden'
        }
      } else {
        nextArrow.style.visibility = ''
      }
    }
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '30px',
    draggable: true,
    touchMove: true,
    afterChange: handleAfterChange,
    prevArrow: (
      <Box className='ai-store-riddle-poll-carousel-btn'>
        <RiddlePollIcons
          kind={'SlideArrowLeft'}
          width={11}
          height={18}
          bgColor={pollLayout?.tabActiveColor}
        />
      </Box>
    ),
    nextArrow: (
      <Box className='ai-store-riddle-poll-carousel-btn'>
        <RiddlePollIcons
          kind={'SlideArrowRight'}
          width={11}
          height={18}
          bgColor={pollLayout?.tabActiveColor}
        />
      </Box>
    )
  }

  // side effect to make all slider element of same height
  useEffect(() => {
    if (pollQuestions.length) {
      setTimeout(() => {
        const slider = document.querySelector('.slick-slider.poll-slider')
        if (slider) {
          const maxHeight = slider.clientHeight
          document
            .querySelectorAll('.aistore-poll-section-container')
            ?.forEach((item) => {
              item.style.minHeight = `${maxHeight}px`
            })
          setLayoutAdjusting(false)
        } else {
          setLayoutAdjusting(false)
        }
        removeDisabledArrow()
      }, 1000)
    }
  }, [responseFetching, pollQuestions, submittingResponse])

  const removeDisabledArrow = () => {
    const disabledArrows = document.querySelectorAll(
      '.slick-slider.poll-slider .slick-disabled'
    )
    if (disabledArrows) {
      disabledArrows.forEach((arrow) => {
        arrow.style.visibility = 'hidden'
      })
    }
  }

  const getActivePollingGame = async () => {
    const { data: pollQuestionsResponse, error } = await common.awaitWrap(
      axiosGetPoll('/poll/active', {})
    )

    if (error) {
      setLayoutAdjusting(false)
      setPollErrorResponse(error?.response?.data?.error)
    }

    if (pollQuestionsResponse?.data) {
      setPollQuestions(pollQuestionsResponse?.data?.questionnaire)
      setPollId(pollQuestionsResponse?.data?.poll_id)
    }
    setResponseFetching(false)
  }

  const fetchUserResponse = useCallback(async (pollId) => {
    const { data: response } = await common.awaitWrap(
      axiosGetPoll(`poll/${pollId}/user/response`, {})
    )
    if (response) {
      setUserResponse(response)
    }
  }, [])

  const fetchAggregateResponse = useCallback(async (pollId) => {
    const { data: response } = await common.awaitWrap(
      axiosGetPoll(`poll/${pollId}/user/response/aggregate`, {})
    )
    if (response) {
      setAggregateResponse(response)
    }
  }, [])

  const submitPollResponse = async (pollResponse) => {
    setSubmittingResponse(true)
    const { err } = await common.awaitWrap(
      axiosPostPoll(`poll/${pollId}/user/response`, pollResponse)
    )
    if (err) {
      console.error(err)
    }
    setSubmittingResponse(false)
  }

  const handleUserResponse = (pollResponse) => {
    submitPollResponse(pollResponse)
  }

  useEffect(() => {
    getActivePollingGame()

    if (tenant !== null && pollId != null) {
      fetchUserResponse(pollId)
      fetchAggregateResponse(pollId)
    }
  }, [tenant, pollId, fetchAggregateResponse, fetchUserResponse])

  useEffect(() => {
    if (userResponse?.data) {
      setCompletedResponse(userResponse?.data)
    }
  }, [userResponse])

  useEffect(() => {
    if (aggregateResponse) {
      const aggregateData = getAggregateData(aggregateResponse?.data)
      setResponseStats(aggregateData)
    }
  }, [aggregateResponse])

  return !responseFetching && !layoutAdjusting ? (
    <div className='ai-store-poll-wrapper'>
      <div className='ai-store-poll-question-header'>
        {pollQuestions?.length > 0 ? (
          <Slider {...settings} className='poll-slider' ref={pollSliderRef}>
            {pollQuestions?.map((item) => (
              <PollingCard
                key={item?.question_id}
                question={item}
                handleUserResponse={handleUserResponse}
                userResponse={completedResponse?.[0]?.response?.find(
                  (res) => res?.question_id === item?.question_id
                )}
                responseStats={getStats(item?.question_id, responseStats)}
                pollId={pollId || 'NA'}
                externalId={externalId || 'NA'}
              />
            ))}
          </Slider>
        ) : (
          <div className='aistore-poll-section-error-container'>
            {pollErrorResponse && (
              <div className='ai-store-poll-section-error'>
                <div
                  className='ai-store-poll-section-error-header'
                  style={{
                    fontSize: tenantLayout?.riddlePoll?.errorTitle
                  }}
                >
                  {t('riddlePolls.youAreAllCaughtUpForTodayPoll')}
                </div>
                {t('riddlePolls.weAddNewPollsEveryday')}
                <br />
                <br />
                {t('riddlePolls.pleaseComeBackTomorrow')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  )
}

PollingGameSection.propTypes = {
  externalId: PropTypes.string.isRequired,
  tenant: PropTypes.string.isRequired
}

export default PollingGameSection
