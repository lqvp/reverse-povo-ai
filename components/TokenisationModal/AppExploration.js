import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenisationContext } from '../../context/TokenisationContext'
import Button from './Button'
import CompassIcon from '../../static/CompassIcon'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'
import RewardCoinBg from './RewardCoinBg'
import PropTypes from 'prop-types'
import { CircularProgress } from '@mui/material'

const AppExploration = ({ environment }) => {
  const {
    rewardCollectHandler,
    isRewardCollecting,
    isRewardCollected,
    mvpTokenAmount,
    error
  } = useTokenisationContext()
  const { t } = useTranslation('common')

  return (
    <div className='app-exploration token-use-case-container'>
      <div className='app-exploration-bg'>
        <img
          src={`${getWidgetBaseUrl(environment)}/images/tokenisation/sparkle.png`}
          alt='app-exploration-sparkle'
        />
      </div>
      <div
        className='coin-animation-container'
        style={{ display: isRewardCollected ? 'block' : 'none' }}
      >
        <img
          src={`${getWidgetBaseUrl(environment)}/images/tokenisation/coin-animation.gif`}
          alt='coin-animation'
        />
      </div>
      <div className='app-exploration-title'>
        {t('tokenization.congratulations')}
      </div>
      <div className='app-exploration-description'>
        <div>{t('tokenization.rewardUnlock')}</div>
        <div>{t('tokenization.exploringNewSection')}</div>
      </div>
      <div
        className='app-exploration-icon'
        style={{ visibility: isRewardCollected ? 'hidden' : 'visible' }}
      >
        <RewardCoinBg containerSize={100} />
        <CompassIcon />
      </div>
      <div className='app-exploration-token-reward'>
        {mvpTokenAmount} {t('tokenization.tokens')}
      </div>
      <Button
        onClick={rewardCollectHandler}
        disabled={isRewardCollecting || isRewardCollected}
      >
        {isRewardCollecting ? (
          <CircularProgress size={20} color='inherit' />
        ) : (
          <>{error ? t(error) : t('tokenization.collectReward')}</>
        )}
      </Button>
    </div>
  )
}

AppExploration.propTypes = {
  environment: PropTypes.string
}

export default AppExploration
