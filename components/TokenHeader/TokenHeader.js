import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CoinIcon from '../../static/CoinIcon'
import './TokenHeader.css'
import TokenHistory from '../TokenHistory/TokenHistory'
import PropTypes from 'prop-types'
import { CircularProgress } from '@mui/material'
import { useTokenisationContext } from '../../context/TokenisationContext'
import { useCountUp } from 'react-countup'
import common from '@kelchy/common'
import { axiosPost } from '../../utils/axios'
import BackButton from '../../static/BackButton'

const TokenHeader = ({
  background,
  textColor = '#FFF',
  isDailyStreakHeader = false,
  heading,
  showBackButton = false
}) => {
  // get status of tokenisation modal from session
  const isTokenisationModalOpen = sessionStorage.getItem(
    'isTokenisationModalOpen'
  )
  const { userTokenCount, setDailyStreakTokenDetails, setUserTokenCount } =
    useTokenisationContext()
  const { t } = useTranslation('common')
  const headerRef = useRef()
  const counterRef = useRef(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showTokenHistory, setShowTokenHistory] = useState(false)
  const [isFetchingTokenDetails, setIsFetchingTokenDetails] = useState(true)

  // retrieve daily streak token details
  const getDailyStreakTokenDetails = useCallback(async () => {
    const {
      data: dailyStreakTokenDetails,
      error: dailyStreakTokenDetailsError
    } = await common.awaitWrap(
      axiosPost(`/user/token-transaction/get-token-details`, {
        service_ids: ['daily-streak']
      })
    )

    if (!dailyStreakTokenDetailsError && dailyStreakTokenDetails?.data) {
      setUserTokenCount(dailyStreakTokenDetails?.data.tokenCount)
      setDailyStreakTokenDetails(dailyStreakTokenDetails?.data)
    }
    setIsFetchingTokenDetails(false)
  }, [setDailyStreakTokenDetails, setUserTokenCount])

  // retrieve user streak data
  useEffect(() => {
    getDailyStreakTokenDetails()
  }, [getDailyStreakTokenDetails])

  // counter hook to update the counter on userTokenCount change
  const { update } = useCountUp({
    ref: counterRef,
    start: 0,
    end: userTokenCount,
    delay: 0,
    duration: 1.5,
    separator: ''
  })

  // Reset the animation and start it again from the current userTokenCount
  useEffect(() => {
    if (userTokenCount) {
      update(userTokenCount)
    }
  }, [userTokenCount, update])

  // add class to header on page scroll
  const handleScroll = () => {
    if (window.scrollY > 10) {
      headerRef?.current?.classList?.add('scrolled')
      setIsScrolled(true)
    } else {
      headerRef?.current?.classList?.remove('scrolled')
      setIsScrolled(false)
    }
  }

  // add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // set isModelOpen from session storage
  useEffect(() => {
    setIsModelOpen(isTokenisationModalOpen === 'true')
  }, [isTokenisationModalOpen])

  const tokenHistoryHandler = () => {
    setShowTokenHistory((prev) => !prev)
  }

  return (
    <>
      <div
        className='token-header-container'
        style={{
          background:
            isTokenisationModalOpen === 'true' ||
            (isDailyStreakHeader && isScrolled)
              ? 'linear-gradient(180deg,#8442a3,#ba84d4)'
              : background,
          zIndex: isModelOpen || isTokenisationModalOpen ? 9999 : 91
        }}
        ref={headerRef}
      >
        <div className='token-header'>
          {showBackButton && (
            <BackButton
              color='#333'
              textVisible={false}
              fontSize='28px'
              spacing='0'
            />
          )}
          <div
            className='token-header-title'
            style={{ color: textColor || 'inherit' }}
          >
            {heading || t('tokenization.welcomeToExplore')}
          </div>
          <div className='token-metadata' onClick={tokenHistoryHandler}>
            <CoinIcon />
            <div className='token-count'>
              <span
                style={{ display: isFetchingTokenDetails ? 'block' : 'none' }}
              >
                <CircularProgress size={24} color='inherit' />
              </span>
              <span
                ref={counterRef}
                style={{ display: isFetchingTokenDetails ? 'none' : 'block' }}
              ></span>
            </div>
          </div>
        </div>
      </div>
      {showTokenHistory && (
        <TokenHistory
          isDrawerOpen={showTokenHistory}
          setIsDrawerOpen={setShowTokenHistory}
          userTokenCount={userTokenCount}
        />
      )}
    </>
  )
}

TokenHeader.propTypes = {
  background: PropTypes.string,
  isDailyStreakHeader: PropTypes.bool,
  userTokenCount: PropTypes.number,
  isFetchingData: PropTypes.bool,
  textColor: PropTypes.string,
  heading: PropTypes.string,
  showBackButton: PropTypes.bool
}

export default TokenHeader
