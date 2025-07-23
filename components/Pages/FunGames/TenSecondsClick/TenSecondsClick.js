import React, { useState, useEffect } from 'react'
import './TenSecondsClick.css'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useLocation } from 'react-router-dom'
import BackButton from '../../../../static/BackButton'
import ShareIcon from '../../../../static/ShareIcon'
import { shareExploreFunGamesDeeplink } from '../../../../helpers/mediaHelper'
import {
  getDeeplinkShareVisibility,
  getTenantName
} from '../../../../helpers/tenantHelper'
import { useTranslation } from 'react-i18next'
import { recordGameCompletionResponse } from '../../../../helpers/milestoneResponseRecorder'
import { getWidgetBaseUrl } from '../../../../helpers/helperFunctions'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../../../useTenantConfig'
import { tenantType } from '../../../../common/constants'

const getImageSrc = (clickCount) => {
  if (clickCount > 30) return '/images/fun_games/ten_seconds_click/after-30.png'
  if (clickCount > 20) return '/images/fun_games/ten_seconds_click/after-20.png'
  if (clickCount > 10) return '/images/fun_games/ten_seconds_click/after-10.png'
  return '/images/fun_games/ten_seconds_click/after-0.png'
}

const tenant = getTenantName()

const TenSecondsClick = ({ isWidget, environment }) => {
  const [secondsLeft, setSecondsLeft] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const sourceOfReference = new URLSearchParams(useLocation().search).get(
    'refSource'
  )

  let isExplore = sourceOfReference === 'explore' || isWidget

  const getResultMessage = (score) => {
    if (score === 0) return ''
    if (score < 40) return t('funGames.justWarmingUpTryAgain')
    if (score < 50) return t('funGames.canYouReach50')
    if (score < 60) return t('funGames.canYouReach60')
    if (score < 70) return t('funGames.canYouReach70')
    return t('funGames.quickerThan95PercentageUsers')
  }

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timerId)
    }
    if (secondsLeft === 0) {
      recordGameCompletionResponse(authorizationId, 'beat_the_clock')
      setShowMessage(true)
      setIsRunning(false)
    }
  }, [authorizationId, isRunning, secondsLeft])

  const startGame = () => {
    trackEvent('clicked beat_the_clock', {
      external_id: authorizationId,
      app_name: 'fun_apps'
    })

    setSecondsLeft(10)
    setIsRunning(false)
    setClickCount(0)
    setShowMessage(false)
    setIsGameStarted(true)
  }

  const handleClick = () => {
    if (isGameStarted) {
      if (!isRunning) setIsRunning(true)
      setClickCount((prev) => prev + 1)
    }
  }

  return (
    <div
      className={`fg-tsc-game-container ${tenant}`}
      style={{ minHeight: isExplore ? '100%' : '100vh' }}
    >
      {!isExplore && (
        <div className='fg-tsc-back-wrapper'>
          <BackButton color='#333333' textVisible={false} fontSize='28px' />
        </div>
      )}
      <div className='fg-tsc-game-body'>
        <div
          className={`fg-tsc-header ${tenant}`}
          style={{
            fontSize: isExplore
              ? tenantLayout?.funGames?.widget?.titleFontSize
              : '2rem',
            marginBottom: isExplore ? '0' : '0.5rem',
            fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
            fontWeight: tenantLayout?.funGames?.widget?.beatTheClockFontWeight,
            lineHeight: tenant === tenantType.mobicom ? 'normal' : ''
          }}
        >
          {t('funGames.beatTheClock')}
        </div>
        <div
          className='fg-tsc-timer-bar'
          style={{ marginTop: tenant === tenantType.byu ? '0px' : '' }}
        >
          <div
            className='fg-tsc-timer-fill'
            style={{ width: `${(secondsLeft / 10) * 100}%` }}
          ></div>
        </div>
        <div
          className='fg-tsc-timer-text'
          style={{
            marginBottom: isExplore
              ? tenant === tenantType.byu
                ? '.25rem'
                : '1.25rem'
              : '2.5rem',
            fontFamily: tenantLayout?.funGames?.widget?.fontStyle
          }}
        >
          {secondsLeft}
        </div>
        <div className='fg-tsc-clock-container'>
          <img
            src={`${environment ? getWidgetBaseUrl(environment) : ''}${getImageSrc(clickCount)}`}
            alt='Clock'
            className='fg-tsc-clock-image'
            onClick={handleClick}
            style={{
              pointerEvents: secondsLeft === 0 ? 'none' : 'auto',
              width: isExplore
                ? tenantLayout?.funGames?.widget?.beatTheClockImgWidth
                : '15rem'
            }}
          />
          {!isRunning && !showMessage && !isGameStarted && (
            <button
              className='fg-tsc-start-button'
              style={{
                padding: isExplore ? '1rem 2rem' : '1.1rem 2.4rem',
                fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
                fontWeight:
                  tenantLayout?.funGames?.widget?.beatTheClockFontWeightScore
              }}
              onClick={startGame}
            >
              {t('funGames.start')}
            </button>
          )}
          {showMessage && (
            <div className='fg-tsc-game-over-msg-container'>
              <div
                className='fg-tsc-game-over-msg'
                style={{
                  fontFamily: tenantLayout?.funGames?.widget?.fontStyle
                }}
              >
                {getResultMessage(clickCount)
                  .split('\n')
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div
          className='fg-tsc-footer-container'
          style={{
            justifyContent: showMessage ? 'space-between' : 'center',
            padding: isExplore
              ? tenant === tenantType.byu
                ? '.5rem 0'
                : '1rem 0'
              : '2rem 0'
          }}
        >
          <div
            className='fg-tsc-click-count'
            style={{
              fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
              fontSize: tenantLayout?.funGames?.widget?.beatTheClockFontSize,
              fontWeight:
                tenantLayout?.funGames?.widget?.beatTheClockFontWeightScore,
              width: tenantLayout?.funGames?.widget?.beatTheClockScoreWidth,
              height: tenantLayout?.funGames?.widget?.beatTheClockScoreHeight
            }}
          >
            {clickCount}
          </div>
          {showMessage && (
            <>
              {getDeeplinkShareVisibility() && (
                <div
                  className='fg-tsc-share-container'
                  style={{
                    fontFamily: tenantLayout?.funGames?.widget?.fontStyle
                  }}
                  onClick={() =>
                    shareExploreFunGamesDeeplink(
                      authorizationId,
                      'ten_second_click'
                    )
                  }
                >
                  <ShareIcon kind='shadedShare' color='#88CDFF' />
                </div>
              )}
              <button
                style={{
                  fontFamily: tenantLayout?.funGames?.widget?.fontStyle
                }}
                className='fg-tsc-restart-button'
                onClick={startGame}
              >
                {t('funGames.restart')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

TenSecondsClick.propTypes = {
  isWidget: PropTypes.bool,
  environment: PropTypes.string
}

export default TenSecondsClick
