import { useTranslation } from 'react-i18next'
import { RIDDLE_POLL_LAYOUT, tenantType } from '../../../../../common/constants'
import { getTenantName } from '../../../../../helpers/tenantHelper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import common from '@kelchy/common'
import { axiosGet, axiosPost } from '../../../../../utils/axios'
import Slider from 'react-slick'
import Loader from '../../../../Loader/Loader'
import PropTypes from 'prop-types'
import './index.css'

const riddleLayout = RIDDLE_POLL_LAYOUT['riddles']

const tenant = getTenantName()

const sortRiddleVaultsByDate = (data) => {
  return data.sort((a, b) => b.created_at - a.created_at)
}

const EndRiddleSlide = ({ hideContinue }) => {
  const { t } = useTranslation('common')

  return (
    <div className='ai-store-riddle-end-riddle-slide-sublayout'>
      <div
        className='ai-store-riddle-end-riddle-header-sublayout'
        style={{
          color: riddleLayout?.tabActiveColor
        }}
      >
        {t('riddlePolls.youAreAllCaughtUpForToday')}
      </div>
      <div className='ai-store-riddle-end-desc-top-sublayout'>
        {t('riddlePolls.weAddNewRiddlesEveryday')}
      </div>
      {hideContinue ? (
        <div className='ai-store-riddle-end-desc-bottom-sublayout'>
          {t('riddlePolls.youCanCheckOut')} <br />
          {t('riddlePolls.pollsOrCome')} <br />
          {t('riddlePolls.backTomorrow')}
        </div>
      ) : (
        <div className='ai-store-riddle-end-desc-bottom-sublayout'>
          {tenant !== tenantType.mobicom && (
            <>
              {t('riddlePolls.youCanContinueTo')} <br />
              {t('riddlePolls.yesterdaysRiddlesOrCome')} <br />
            </>
          )}
          {t('riddlePolls.backTomorrow')}
        </div>
      )}
    </div>
  )
}

EndRiddleSlide.propTypes = {
  nextSlideHandler: PropTypes.func.isRequired,
  currentVaultIndex: PropTypes.number.isRequired,
  hideContinue: PropTypes.bool.isRequired
}

const RiddleQuestion = ({
  currentVaultId,
  riddle,
  submitRiddleResponse,
  externalId
}) => {
  const [answerRevealed, setAnswerRevealed] = useState(riddle?.responded)
  const { t } = useTranslation('common')

  useEffect(() => {
    setAnswerRevealed(riddle?.responded)
  }, [riddle])

  const handleAnswerReveal = (currentVaultId, riddleId) => {
    if (!answerRevealed) {
      const properties = {
        external_id: externalId,
        riddle_id: riddleId,
        app_name: 'riddles_app'
      }
      trackEvent(`riddle_answer_click`, properties)
      setAnswerRevealed(true)
      submitRiddleResponse(currentVaultId, riddleId)
    }
  }

  return (
    <div className='ai-store-riddle-question-container-sublayout'>
      <div className='ai-store-riddle-desc-title-sublayout'>
        <div className='ai-store-riddle-riddle-me-title-sublayout'>
          {t('riddlePolls.riddleMeThisSublayout')}
        </div>
        <div className='ai-store-riddle-question-element-sublayout'>
          {riddle?.question}
        </div>
      </div>
      {answerRevealed ? (
        <div className='ai-store-riddle-answer-wrapper-sublayout'>
          <div className='ai-store-riddle-answer-container-sublayout'>
            <div className='ai-store-riddle-answer-text-sublayout'>
              {riddle?.answer}
              {riddle?.sub_answer && (
                <div className='ai-store-riddle-sub-answer-sublayout'>
                  {riddle?.sub_answer}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          className='ai-store-riddle-answer-reveal-sublayout'
          onClick={() =>
            handleAnswerReveal(currentVaultId, riddle?.riddle_id ?? 'NA')
          }
        >
          {t('riddlePolls.revealTheAnswer')}
        </button>
      )}
    </div>
  )
}

RiddleQuestion.propTypes = {
  currentVaultId: PropTypes.string.isRequired,
  riddle: PropTypes.object.isRequired,
  submitRiddleResponse: PropTypes.func.isRequired,
  externalId: PropTypes.string.isRequired
}

const RiddleSection = ({ externalId, tenant }) => {
  const [riddleVaultsData, setRiddleVaultsData] = useState([])
  const [riddlesData, setRiddlesData] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [currentVaultIndex, setCurrentVaultIndex] = useState(0)
  const [layoutAdjusting, setLayoutAdjusting] = useState(true)
  const sliderRefToday = useRef(null)
  const sliderRefOld = useRef(null)

  const submitRiddleResponse = async (currentVaultId, riddle_id) => {
    const payload = {
      riddle_vault_id: currentVaultId,
      riddle_id
    }
    const { error } = await common.awaitWrap(
      axiosPost('riddles/response', payload)
    )
    if (error) {
      console.error(error)
    }
  }

  const continueAfterRiddleEnd = (index) => {
    const properties = {
      external_id: externalId,
      riddle_id: riddleVaultsData[index]?.riddle_vault_id,
      app_name: 'riddles_app'
    }
    trackEvent(`next_riddle_load_click`, properties)

    if (index < riddleVaultsData.length) {
      setCurrentVaultIndex(index)
      if (index === 0) {
        setRiddlesData([riddleVaultsData[0]])
      } else {
        const otherRiddleVaults = riddleVaultsData?.slice(1)
        setRiddlesData(otherRiddleVaults)
      }
    }
  }

  // side effect to make all slider element of same height
  useEffect(() => {
    if (!isFetching && riddlesData) {
      setTimeout(() => {
        const slider = document.querySelector('.slick-slider.riddle-slider')
        if (slider) {
          let maxHeight
          if (currentVaultIndex === 0) {
            maxHeight = sliderRefToday?.current?.clientHeight
          } else {
            maxHeight = sliderRefOld?.current?.clientHeight
            sliderRefOld?.current?.slickGoTo(0)
          }
          document
            .querySelectorAll('.ai-store-riddle-question-container-sublayout')
            .forEach((item) => {
              item.style.minHeight = `${maxHeight}px`
            })
          document
            .querySelectorAll('.ai-store-riddle-end-riddle-slide-sublayout')
            .forEach((item) => {
              item.style.minHeight = `${maxHeight}px`
            })
          setLayoutAdjusting(false)
        } else {
          setLayoutAdjusting(false)
        }
      }, 0)
    }
  }, [isFetching, riddlesData, currentVaultIndex])

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

  const getActiveRiddles = useCallback(async () => {
    const { data: riddleQuestions } = await common.awaitWrap(
      axiosGet(`/riddles/get_active_riddle_vaults`, {})
    )
    if (riddleQuestions?.data?.length > 0) {
      const sortedRiddleVaultData = sortRiddleVaultsByDate(
        riddleQuestions?.data
      )
      setRiddleVaultsData(sortedRiddleVaultData)
    }

    setIsFetching(false)
    setLayoutAdjusting(false)
  }, [])

  useEffect(() => {
    getActiveRiddles()
  }, [tenant, getActiveRiddles])

  if (!isFetching && !riddleVaultsData.length > 0) {
    return (
      <div className='ai-store-riddle-wrapper-empty-sublayout'>
        <div className='ai-store-riddle-list-sublayout'>
          <EndRiddleSlide
            nextSlideHandler={continueAfterRiddleEnd}
            currentVaultIndex={currentVaultIndex}
            hideContinue={true}
          />
        </div>
      </div>
    )
  }

  return !isFetching && !layoutAdjusting ? (
    <div className='ai-store-riddle-wrapper-sublayout'>
      <div className='ai-store-riddle-list-sublayout'>
        {currentVaultIndex === 0 ? (
          <Slider
            {...settings}
            className='riddle-slider-sublayout'
            ref={sliderRefToday}
          >
            {
              // Assuming riddlesData is an object in this case
              riddleVaultsData?.[0]?.riddles?.map((riddle) => (
                <RiddleQuestion
                  key={riddle.riddle_id + riddle?.riddle_vault_id}
                  currentVaultId={riddleVaultsData?.[0]?.riddle_vault_id}
                  riddle={riddle}
                  submitRiddleResponse={submitRiddleResponse}
                  externalId={externalId}
                />
              ))
            }
          </Slider>
        ) : (
          <Slider
            {...settings}
            className='riddle-slider-sublayout'
            ref={sliderRefOld}
          >
            {Array.isArray(riddlesData) &&
              riddlesData.map((vault) =>
                vault.riddles?.map((riddle) => (
                  <RiddleQuestion
                    key={riddle.riddle_id + riddle.riddle_vault_id}
                    currentVaultId={vault.riddle_vault_id}
                    riddle={riddle}
                    submitRiddleResponse={submitRiddleResponse}
                    externalId={externalId}
                  />
                ))
              )}
          </Slider>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  )
}

RiddleSection.propTypes = {
  externalId: PropTypes.string.isRequired,
  tenant: PropTypes.string
}

export default RiddleSection
