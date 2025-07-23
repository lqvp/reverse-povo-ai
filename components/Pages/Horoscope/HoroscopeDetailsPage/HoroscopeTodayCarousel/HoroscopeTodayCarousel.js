import React, { useEffect, useRef, useState } from 'react'
import './HoroscopeTodayCarousel.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAppContext } from '../../../../../context/AppContext'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'
import { useFeatureAllowed } from '../../../../../helpers/tenantHelper'
import { useMvpAccessContext } from '../../../../../context/MvpAccessContext'
import { useTokenisationContext } from '../../../../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../../helpers/constant'
import { findByTransactionTriggerEvent } from '../../../../../helpers/helperFunctions'
import HoroscopeTodayCarouselItem from './HoroscopeTodayCarouselItem'

const HoroscopeTodayCarousel = ({ horoscopeTodayData, burnSpecDetails }) => {
  const carouselRef = useRef(null)
  const { authorizationId } = useAppContext()
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const {
    setTokenisationUseCaseType,
    setTokenisationUseCaseData,
    setWidgetComponentIds,
    setUnlockedMvpMetaData,
    setMvpMetaData,
    unlockPremiumContent
  } = useTokenisationContext()
  const { mvpAccessState, setMvpAccessState } = useMvpAccessContext()
  const [accessState, setAccessState] = useState(null)

  useEffect(() => {
    if (carouselRef?.current) {
      const carouselHeight = `202px`
      document
        .querySelectorAll('.hs-today-prediction-outer-wrapper')
        .forEach((ele) => {
          ele.style.height = carouselHeight
        })
    }
    if (horoscopeTodayData) {
      setAccessState((prev) => {
        const accessDataObj = horoscopeTodayData.reduce((acc, item) => {
          if (item.value) {
            acc[item.value] =
              mvpAccessState?.horoscope?.[item.value] || !isTokenisationEnabled
          }
          return acc
        }, {})
        return {
          ...prev,
          ...accessDataObj
        }
      })
    }
  }, [isTokenisationEnabled, horoscopeTodayData, mvpAccessState])

  const onSlideChange = (current) => {
    const properties = {
      external_id: authorizationId,
      card_name: horoscopeTodayData[current]?.key,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_reading_swipe', properties)
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.3,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    afterChange: (current) => {
      onSlideChange(current)
    }
  }

  const handlePremiumContentAccess = (args) => {
    setMvpAccessState((prev) => {
      const updatedMvpAccess = { ...prev }
      updatedMvpAccess.horoscope[args] = true
      return updatedMvpAccess
    })
  }

  const tokenisedReadMoreUnlock = (args, tokenAmount) => {
    if (
      isTokenisationEnabled &&
      !mvpAccessState?.horoscope?.loveCompatibility
    ) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.premiumContent)
      setTokenisationUseCaseData({
        previewImage: `/images/tokenisation/horoscope_unlock.png`,
        title: 'Daily Cosmic Tip',
        icon: `/images/tokenisation/horoscope_unlock_icon.png`
      })
      setWidgetComponentIds([])
      const unlockData = {
        unlockedMvpName: 'Daily Cosmic Tip',
        redirectAction: handlePremiumContentAccess,
        args: args
      }
      setUnlockedMvpMetaData(unlockData)
      const mvpMetaData = {
        user_event: `user_daily_${args}_unlock_click`,
        app_name: `daily_horoscope`,
        event: `user_daily_${args}_unlock_click`,
        swipe_depth: 0
      }
      setMvpMetaData(mvpMetaData)
      unlockPremiumContent(args, mvpMetaData, unlockData, tokenAmount)
    } else {
      handlePremiumContentAccess(args)
    }
  }

  return (
    <div ref={carouselRef} className='hs-today-prediction-carousel'>
      {horoscopeTodayData?.length && accessState ? (
        <Slider {...settings}>
          {horoscopeTodayData?.map((data, index) => {
            let tokenDetails = {}
            if (isTokenisationEnabled) {
              tokenDetails = findByTransactionTriggerEvent(
                burnSpecDetails,
                data?.tokenEvent
              )
            }
            return (
              <HoroscopeTodayCarouselItem
                key={index}
                accessState={accessState}
                data={data}
                isTokenisationEnabled={isTokenisationEnabled}
                tokenDetails={tokenDetails}
                index={index}
                tokenisedReadMoreUnlock={tokenisedReadMoreUnlock}
              />
            )
          })}
        </Slider>
      ) : null}
    </div>
  )
}

HoroscopeTodayCarousel.propTypes = {
  horoscopeTodayData: PropTypes.array.isRequired,
  burnSpecDetails: PropTypes.array
}

export default HoroscopeTodayCarousel
