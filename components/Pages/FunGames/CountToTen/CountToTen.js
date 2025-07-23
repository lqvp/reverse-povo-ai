import React, { useState, useEffect, useCallback } from 'react'
import './CountToTen.css'
import { useLocation } from 'react-router-dom'
import BackButton from '../../../../static/BackButton'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import ShareIcon from '../../../../static/ShareIcon'
import {
  getDeeplinkShareVisibility,
  getTenantName,
  useFeatureAllowed
} from '../../../../helpers/tenantHelper'
import { shareExploreFunGamesDeeplink } from '../../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import { recordGameCompletionResponse } from '../../../../helpers/milestoneResponseRecorder'
import { useTokenisationContext } from '../../../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../helpers/constant'
import TokenHeader from '../../../TokenHeader/TokenHeader'
import { useTenantConfig } from '../../../../useTenantConfig'
import PropTypes from 'prop-types'

const tenant = getTenantName()

const CountToTen = ({ isWidget }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [message, setMessage] = useState('')
  const location = useLocation()
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const sourceOfReference = new URLSearchParams(location.search).get(
    'refSource'
  )
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()
  const tenantLayout = useTenantConfig(tenant)

  let isExplore = sourceOfReference === 'explore' || isWidget

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_fun_games_lp_impression`,
        app_name: `typing_test`,
        event: `user_engaged_typing_test`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType])

  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  const handleStartStop = () => {
    if (isRunning) {
      const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2)
      setMessage(`${timeElapsed} seconds`)
      recordGameCompletionResponse(authorizationId, 'count_to_10')
    } else {
      trackEvent('clicked count_to_ten', {
        external_id: authorizationId,
        app_name: 'fun_apps'
      })
      setStartTime(Date.now())
      setMessage('')
    }
    setIsRunning(!isRunning)
  }

  return (
    <>
      {isTokenisationEnabled && (
        <TokenHeader background='#b8f2ff' textColor='#004595' />
      )}
      <div
        className='fg-ctt-game-container'
        style={{
          height: isExplore ? '377px' : '100vh',
          width: isExplore ? '100%' : 'auto'
        }}
      >
        {!isExplore && (
          <div className='fg-ctt-back-wrapper'>
            <BackButton color='#333333' textVisible={false} fontSize='28px' />
          </div>
        )}
        <div
          className='fg-ctt-body-container'
          style={{ height: !isExplore && '75%' }}
        >
          <div className='fg-ctt-app-header'>
            <div
              style={{
                fontFamily: tenantLayout?.funGames?.widget?.fontStyle,
                fontWeight:
                  tenantLayout?.funGames?.widget?.beatTheClockFontWeight,
                fontSize: tenantLayout?.funGames?.widget?.largeFontSize
              }}
              className={`fg-ctt-app-title ${tenant}`}
            >
              {t('funGames.countTo10')}
            </div>
            <div
              className={`fg-ctt-app-desc ${tenant}`}
              style={{ marginTop: isExplore ? '1.5rem' : '2rem' }}
            >
              {t('funGames.howAccuratelyCanYouJudge10Seconds')}
            </div>
          </div>
          <div className='fg-ctt-gradient-container'>
            <div
              className='fg-ctt-gradient-image'
              style={{
                top: isExplore ? '3.25rem' : ''
              }}
            >
              <div
                className={`fg-ctt-button-container ${tenant} ${
                  isRunning ? 'fg-ctt-stop-bg' : 'fg-ctt-start-bg'
                }`}
                style={{
                  height: isExplore ? '7.5rem' : '8.75rem',
                  width: isExplore ? '7.5rem' : '8.75rem',
                  fontFamily: tenantLayout?.funGames?.widget?.generalFontFamily
                }}
                onClick={handleStartStop}
              >
                {isRunning ? t('funGames.stop') : t('funGames.start')}
              </div>
            </div>
          </div>
          {message && (
            <div className='fg-ctt-footer-container-wrapper'>
              <div
                className='fg-ctt-footer-container'
                style={{
                  marginBottom: isExplore
                    ? tenantLayout?.funGames?.widget?.countToTenResultBottom
                    : '-1rem'
                }}
              >
                <div className='fg-ctt-feedback'>{message}</div>
                <div>{t('funGames.youCanDoBetter')}</div>
              </div>
              {getDeeplinkShareVisibility() && (
                <div
                  className='fg-ctt-share-container'
                  onClick={() =>
                    shareExploreFunGamesDeeplink(
                      authorizationId,
                      'count_to_ten'
                    )
                  }
                >
                  <ShareIcon kind='normalShare' color='#004595' />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

CountToTen.propTypes = {
  isWidget: PropTypes.bool
}

export default CountToTen
