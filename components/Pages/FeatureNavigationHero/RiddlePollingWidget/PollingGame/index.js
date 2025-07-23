import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../../useTenantConfig'
import common from '@kelchy/common'
import {
  axiosGetPoll,
  axiosPostPoll
} from '../../../../../utils/pollingGameAxios'
import Slider from 'react-slick'
import Loader from '../../../../Loader/Loader'
import PropTypes from 'prop-types'
import PollingCard from './PollingCard'
import {
  getAggregateData,
  getStats
} from '../../../../../helpers/pollingGameHelper'
import './index.css'

const PollingGame = ({ externalId, tenant }) => {
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

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '20px',
    slidesToShow: 1,
    speed: 500,
    dots: true,
    arrows: false
  }

  // side effect to make all slider element of same height
  useEffect(() => {
    if (pollQuestions.length) {
      setTimeout(() => {
        const slider = document.querySelector(
          '.slick-slider.poll-slider-sublayout'
        )
        if (slider) {
          const maxHeight = slider.clientHeight
          document
            .querySelectorAll('.aistore-poll-section-container-sublayout')
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
      '.slick-slider.poll-slider-sublayout .slick-disabled'
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
    <div className='ai-store-poll-wrapper-sublayout'>
      <div className='ai-store-poll-question-header-sublayout'>
        {pollQuestions?.length > 0 ? (
          <Slider
            {...settings}
            className='poll-slider-sublayout'
            ref={pollSliderRef}
          >
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
          <div className='aistore-poll-section-error-container-sublayout'>
            {pollErrorResponse && (
              <div className='ai-store-poll-section-error-sublayout'>
                <div
                  className='ai-store-poll-section-error-header-sublayout'
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

PollingGame.propTypes = {
  externalId: PropTypes.string.isRequired,
  tenant: PropTypes.string.isRequired
}

export default PollingGame
