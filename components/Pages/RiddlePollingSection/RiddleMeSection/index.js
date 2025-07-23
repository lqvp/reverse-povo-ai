import { RIDDLE_POLL_LAYOUT, tenantType } from '../../../../common/constants'
import './index.css'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import common from '@kelchy/common'
import { axiosGet, axiosPost } from '../../../../utils/axios'
import Slider from 'react-slick'
import RiddlePollIcons from '../../../../static/riddlePollIcons'
import { Box } from '@mui/material'
import Loader from '../../../Loader/Loader'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { getFontSizeByWordCount } from '../../../../helpers/helperFunctions'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { getTenantName } from '../../../../helpers/tenantHelper'

const riddleLayout = RIDDLE_POLL_LAYOUT['riddles']
const pollLayout = RIDDLE_POLL_LAYOUT['poll']

const tenant = getTenantName()

const sortRiddleVaultsByDate = (data) => {
  return data.sort((a, b) => b.created_at - a.created_at)
}

const EndRiddleSlide = ({
  nextSlideHandler,
  currentVaultIndex,
  hideContinue
}) => {
  const { t } = useTranslation('common')

  return (
    <div className='ai-store-riddle-end-riddle-slide'>
      <div
        className='ai-store-riddle-end-riddle-header'
        style={{
          color: riddleLayout?.tabActiveColor
        }}
      >
        {t('riddlePolls.youAreAllCaughtUpForToday')}
      </div>
      <div className='ai-store-riddle-end-desc-top'>
        {t('riddlePolls.weAddNewRiddlesEveryday')}
      </div>
      {hideContinue ? (
        <div className='ai-store-riddle-end-desc-bottom'>
          {t('riddlePolls.youCanCheckOut')} <br />
          {t('riddlePolls.pollsOrCome')} <br />
          {t('riddlePolls.backTomorrow')}
        </div>
      ) : (
        <div className='ai-store-riddle-end-desc-bottom'>
          {tenant !== tenantType.mobicom && (
            <>
              {t('riddlePolls.youCanContinueTo')} <br />
              {t('riddlePolls.yesterdaysRiddlesOrCome')} <br />
            </>
          )}
          {t('riddlePolls.backTomorrow')}
        </div>
      )}
      <div className='ai-store-riddle-cta'>
        {!hideContinue && (
          <button
            className='ai-store-riddle-next-day-reveal'
            style={{
              backgroundColor: riddleLayout?.tabActiveColor
            }}
            onClick={() => nextSlideHandler(currentVaultIndex + 1)}
          >
            {t('riddlePolls.continue')}
          </button>
        )}
      </div>
      {tenant !== tenantType.mobicom && (
        <div className='ai-store-riddle-focus-guide-text'>
          <p
            style={{
              color: pollLayout?.tabActiveColor
            }}
          >
            {t('riddlePolls.checkOutPolls')}
          </p>
          <img
            className='aistore-riddle-down-arrow'
            src='/images/down-arrow.svg'
            alt='riddle-guide-cta'
          />
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
    <div className='ai-store-riddle-question-container'>
      <div
        className='ai-store-riddle-question-element'
        style={{
          fontSize: getFontSizeByWordCount(riddle?.question?.split(' ').length)
        }}
      >
        {riddle?.question}
      </div>
      {answerRevealed ? (
        <div className='ai-store-riddle-answer-wrapper'>
          <div className='ai-store-riddle-answer-container'>
            <img
              src='images/reveal-answer.png'
              alt='Riddle Answer'
              className='ai-store-riddle-answer-image'
            />
            <div className='ai-store-riddle-answer-text'>
              {riddle?.answer}
              {riddle?.sub_answer && (
                <div className='ai-store-riddle-sub-answer'>
                  {riddle?.sub_answer}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          className='ai-store-riddle-answer-reveal'
          style={{
            backgroundColor: riddleLayout?.secondaryColor
          }}
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

const RiddleMeSection = ({ externalId, tenant }) => {
  const [riddleVaultsData, setRiddleVaultsData] = useState([])
  const [riddlesData, setRiddlesData] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [currentVaultIndex, setCurrentVaultIndex] = useState(0)
  const [hideContinue, setHideContinue] = useState(false)
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
      setHideContinue(true)
      if (currentVaultIndex === 0) {
        if (sliderRefToday.current) {
          const nextArrow = document.querySelector(
            '.riddle-slider .slick-arrow.slick-next'
          )
          nextArrow.style.visibility = ''
        }
      } else {
        if (sliderRefOld.current) {
          const nextArrow = document.querySelector(
            '.riddle-slider .slick-arrow.slick-next'
          )
          nextArrow.style.visibility = ''
        }
      }
    }
  }

  const handleAfterChange = (currentIndex) => {
    if (riddlesData) {
      const totalSlides =
        currentVaultIndex === 0
          ? riddleVaultsData?.[0]?.riddles?.length || 0
          : riddlesData?.reduce((total, vault) => {
              return total + (vault?.riddles?.length || 0)
            }, 0)
      const nextArrow = document.querySelector(
        '.riddle-slider .slick-arrow.slick-next'
      )
      const prevArrow = document.querySelector(
        '.riddle-slider .slick-arrow.slick-prev'
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
          bgColor={riddleLayout?.tabActiveColor}
        />
      </Box>
    ),
    nextArrow: (
      <Box className='ai-store-riddle-poll-carousel-btn'>
        <RiddlePollIcons
          kind={'SlideArrowRight'}
          width={11}
          height={18}
          bgColor={riddleLayout?.tabActiveColor}
        />
      </Box>
    )
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

    if (riddleQuestions?.data?.length === 1) {
      setHideContinue(true)
    }

    setIsFetching(false)
    setLayoutAdjusting(false)
  }, [])

  useEffect(() => {
    getActiveRiddles()
  }, [tenant, getActiveRiddles])

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
            .querySelectorAll('.ai-store-riddle-question-container')
            .forEach((item) => {
              item.style.minHeight = `${maxHeight}px`
            })
          document
            .querySelectorAll('.ai-store-riddle-end-riddle-slide')
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

  if (!isFetching && !riddleVaultsData.length > 0) {
    return (
      <div className='ai-store-riddle-wrapper-empty'>
        <div className='ai-store-riddle-list'>
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
    <div className='ai-store-riddle-wrapper'>
      <div className='ai-store-riddle-list'>
        {currentVaultIndex === 0 ? (
          <Slider {...settings} className='riddle-slider' ref={sliderRefToday}>
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
            <EndRiddleSlide
              nextSlideHandler={continueAfterRiddleEnd}
              currentVaultIndex={currentVaultIndex}
              hideContinue={hideContinue}
            />
          </Slider>
        ) : (
          <Slider {...settings} className='riddle-slider' ref={sliderRefOld}>
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
            <EndRiddleSlide
              nextSlideHandler={continueAfterRiddleEnd}
              currentVaultIndex={currentVaultIndex}
              hideContinue={true}
            />
          </Slider>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  )
}

RiddleMeSection.propTypes = {
  externalId: PropTypes.string.isRequired,
  tenant: PropTypes.string
}

export default RiddleMeSection
