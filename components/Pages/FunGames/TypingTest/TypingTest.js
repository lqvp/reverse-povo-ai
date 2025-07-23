import React, { useCallback, useEffect, useState } from 'react'
import './TypingTest.css'
import BackButton from '../../../../static/BackButton'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import {
  getDeeplinkShareVisibility,
  useFeatureAllowed
} from '../../../../helpers/tenantHelper'
import ShareIcon from '../../../../static/ShareIcon'
import { shareExploreFunGamesDeeplink } from '../../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import { recordGameCompletionResponse } from '../../../../helpers/milestoneResponseRecorder'
import { useTokenisationContext } from '../../../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../helpers/constant'
import TokenHeader from '../../../TokenHeader/TokenHeader'

const TypingTest = () => {
  const [gameState, setGameState] = useState('start')
  const [inputValue, setInputValue] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [timeTaken, setTimeTaken] = useState(null)
  const [fastestTime, setFastestTime] = useState(null)
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'

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

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase()
    setInputValue(value)

    if (value === alphabet) {
      const endTime = Date.now()
      const currentTime = ((endTime - startTime) / 1000).toFixed(2)
      setTimeTaken(currentTime)
      setGameState('finished')
      recordGameCompletionResponse(authorizationId, 'typing_test')
      if (!fastestTime || currentTime < fastestTime) {
        setFastestTime(currentTime)
      }
    }
  }

  const handleButtonClick = () => {
    trackEvent('clicked typing_test', {
      external_id: authorizationId,
      app_name: 'fun_apps'
    })
    setGameState('inProgress')
    setInputValue('')
    setTimeTaken(null)
    setStartTime(Date.now())
  }

  const handlePaste = (e) => {
    e.preventDefault()
  }

  return (
    <>
      {isTokenisationEnabled && <TokenHeader background='#e8d7af' />}
      <div className='fg-tt-game-container'>
        <div className='fg-tt-back-wrapper'>
          <BackButton color='#333333' textVisible={false} fontSize='28px' />
        </div>
        <div className='fg-tt-body-container'>
          <div className='fg-tt-top-container'>
            <div className='fg-tt-app-title'>{t('funGames.typingTest')}</div>
            <div className='fg-tt-app-desc'>
              {t('funGames.howQuicklyCanYouTypeFromAToZ')}
            </div>
          </div>
          <div className='fg-tt-bottom-container'>
            <textarea
              className='fg-tt-textarea'
              placeholder={t('funGames.typehere')}
              value={inputValue}
              onChange={handleInputChange}
              onPaste={handlePaste}
              disabled={gameState !== 'inProgress'}
              style={{
                height: gameState === 'finished' ? '7.5rem' : '12.5rem'
              }}
            />
            {gameState === 'finished' && (
              <div className='fg-tt-message'>
                {t('funGames.alphabetTypedIn')} {timeTaken} {t('funGames.secs')}
                <br />
                {fastestTime && (
                  <div>
                    {t('funGames.fastestTime')} {fastestTime}{' '}
                    {t('funGames.secs')}
                  </div>
                )}
              </div>
            )}
            <div className='fg-tt-footer-container-wrapper'>
              <div className='fg-tt-submit-button' onClick={handleButtonClick}>
                {gameState === 'start'
                  ? t('funGames.start')
                  : t('funGames.restart')}
              </div>
              {gameState !== 'start' && getDeeplinkShareVisibility() && (
                <div
                  className='fg-tt-share-container'
                  onClick={() =>
                    shareExploreFunGamesDeeplink(authorizationId, 'typing_test')
                  }
                >
                  <ShareIcon
                    kind='noBackgroundShareIcon'
                    width={40}
                    height={40}
                    color='#FFF'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TypingTest
