import React, { useEffect, useState } from 'react'
import './ReactionTime.css'
import { useLocation } from 'react-router-dom'
import BackButton from '../../../../static/BackButton'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import ShareIcon from '../../../../static/ShareIcon'
import {
  getDeeplinkShareVisibility,
  getTenantName
} from '../../../../helpers/tenantHelper'
import { shareExploreFunGamesDeeplink } from '../../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import { recordGameCompletionResponse } from '../../../../helpers/milestoneResponseRecorder'
import { getWidgetBaseUrl } from '../../../../helpers/helperFunctions'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../../../useTenantConfig'

const exploreImageUrl = '/images/fun_games/reaction_time/card-car-image.png'
const fullScreenImageUrl =
  '/images/fun_games/reaction_time/fullscreen-car-image.png'
const startLights = '/images/fun_games/reaction_time/start-lights.png'
const errorLights = '/images/fun_games/reaction_time/error-lights.png'
const successLights = '/images/fun_games/reaction_time/success-lights.png'
const tenant = getTenantName()

const ReactionTime = ({ isWidget, environment }) => {
  const [gameState, setGameState] = useState('start')
  const [reactionTime, setReactionTime] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const sourceOfReference = new URLSearchParams(useLocation().search).get(
    'refSource'
  )
  const tenantLayout = useTenantConfig(tenant)

  const isExplore = sourceOfReference === 'explore' || isWidget

  useEffect(() => {
    if (gameState === 'wait') {
      // Set a random delay between 2000ms and 5000ms
      const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000
      const timer = setTimeout(() => {
        setGameState('react')
        setStartTime(Date.now())
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [gameState])

  const submitGameClick = () => {
    switch (gameState) {
      case 'start':
        trackEvent('clicked reaction_time', {
          external_id: authorizationId,
          app_name: 'fun_apps'
        })
        setGameState('wait')
        setReactionTime(null)
        break
      case 'wait':
        trackEvent('clicked reaction_time_react', {
          external_id: authorizationId,
          app_name: 'fun_apps'
        })
        setGameState('early')
        break
      case 'react':
        trackEvent('clicked reaction_time_react', {
          external_id: authorizationId,
          app_name: 'fun_apps'
        })
        setReactionTime((Date.now() - startTime) / 1000)
        setGameState('late')
        break
      default:
        trackEvent('clicked reaction_time', {
          external_id: authorizationId,
          app_name: 'fun_apps'
        })
        setGameState('start')
        setReactionTime(null)
        setStartTime(null)
    }
    recordGameCompletionResponse(authorizationId, 'reaction')
  }

  const lightImages = {
    react: successLights,
    late: successLights,
    early: errorLights,
    default: startLights
  }

  const buttonLabels = {
    early: t('funGames.reset'),
    late: t('funGames.reset'),
    react: t('funGames.react'),
    wait: t('funGames.react'),
    default: t('funGames.start')
  }

  const getGameMessage = () => {
    switch (gameState) {
      case 'start':
        return t('funGames.howQuickAreYourReaction')
      case 'wait':
        return t('funGames.tapWhenLightsTurnGreen')
      case 'early':
        return t('funGames.tooEarlyTryAgain')
      case 'late':
        return `${reactionTime} ${t('funGames.goodTryAgain')}`
      default:
        return ''
    }
  }

  return (
    <div
      className='fg-rt-game-container'
      style={{
        height: isExplore
          ? tenantLayout?.funGames?.widget?.reactionTimeCentreHeight
          : '100vh'
      }}
    >
      {!isExplore && (
        <div className='fg-rt-back-wrapper'>
          <BackButton color='#333333' textVisible={false} fontSize='28px' />
        </div>
      )}
      <div className='fg-rt-body-container'>
        <div
          className='fg-rt-top-container'
          style={{ marginBottom: isExplore ? '1rem' : '5rem' }}
        >
          <div
            className='fg-rt-game-title'
            style={{
              fontSize: isExplore ? '26px' : '32px',
              width: isExplore ? '20.5rem' : '100%',
              fontFamily: tenantLayout?.funGames?.widget?.fontStyle
            }}
          >
            {t('funGames.reactionTime')}
          </div>
          <img
            alt=''
            src={`${environment ? getWidgetBaseUrl(environment) : ''}${
              lightImages[gameState] || lightImages.default
            }`}
            style={{ width: isExplore ? '16rem' : '18.75rem' }}
          />
        </div>
        <div
          className='fg-rt-bottom-image-container'
          style={{
            marginBottom: isExplore
              ? tenantLayout?.funGames?.widget
                  ?.reactionTimeContainerMarginBottom
              : ''
          }}
        >
          {gameState !== 'react' && (
            <div
              className='fg-rt-game-msg-container'
              style={{
                fontSize: isExplore ? '16px' : '20px',
                fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
                fontWeight:
                  tenantLayout?.funGames?.widget?.reactionTimeFontWeight
              }}
            >
              {getGameMessage()}
            </div>
          )}
          <img
            alt=''
            src={`${environment ? getWidgetBaseUrl(environment) : ''}${isExplore ? exploreImageUrl : fullScreenImageUrl}`}
            width={'100%'}
          />
          <div
            className='fg-rt-controller-button'
            onClick={submitGameClick}
            style={{
              background: gameState === 'react' ? '#CFFF69' : '#FFF',
              borderColor: gameState === 'react' ? '#5CB33D' : '#B4B4B4',
              fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
              fontWeight:
                tenantLayout?.funGames?.widget?.beatTheClockFontWeightScore
            }}
          >
            {buttonLabels[gameState] || buttonLabels.default}
            {(gameState === 'early' || gameState === 'late') &&
              getDeeplinkShareVisibility() && (
                <div
                  className='fg-rt-share-container'
                  onClick={(event) => {
                    shareExploreFunGamesDeeplink(
                      authorizationId,
                      'reaction_time'
                    )
                    event?.stopPropagation()
                  }}
                >
                  <ShareIcon kind='normalShare' color='#333' />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

ReactionTime.propTypes = {
  isWidget: PropTypes.bool,
  environment: PropTypes.string
}

export default ReactionTime
