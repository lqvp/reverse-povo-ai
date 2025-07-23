import React from 'react'
import { useTranslation } from 'react-i18next'
import DiamondIcon from '../../static/DiamondIcon'
import { useTokenisationContext } from '../../context/TokenisationContext'
import Button from './Button'
import { CircularProgress } from '@mui/material'

const PremiumContent = () => {
  const {
    tokenisationUseCaseData,
    mvpTokenAmount,
    isLogEventCreating,
    isLogEventCreated,
    error,
    isUnlocking,
    unlockedMvpMetaData,
    isMvpUnlocked,
    unlockedMessageStatus,
    unlockPremiumContent,
    handleRedirect
  } = useTokenisationContext()
  const { t } = useTranslation('common')

  const unlockPremiumContentHandler = () => {
    if (isLogEventCreated) {
      unlockPremiumContent()
    }
  }

  return (
    <div className='premium-content token-use-case-container'>
      <div className='premium-content-header'>
        <DiamondIcon />
        {t('tokenization.premiumContent')}
      </div>
      <div className='premium-content-body'>
        {tokenisationUseCaseData?.previewImage ? (
          <img src={tokenisationUseCaseData?.previewImage} alt='placeholder' />
        ) : (
          <div className='premium-content-placeholder'></div>
        )}
        <div className='premium-content-description'>
          <div className='premium-content-icon'>
            {tokenisationUseCaseData?.icon ? (
              <img
                src={tokenisationUseCaseData?.icon}
                alt={tokenisationUseCaseData?.title}
              />
            ) : (
              tokenisationUseCaseData?.title?.substring(0, 4)
            )}
          </div>
          <div className='premium-content-title'>
            {tokenisationUseCaseData?.title}
          </div>
        </div>
      </div>
      <Button
        onClick={isMvpUnlocked ? handleRedirect : unlockPremiumContentHandler}
        textColor='#fff'
        bgColor={
          unlockedMessageStatus
            ? 'transparent'
            : isMvpUnlocked
              ? '#808080'
              : 'linear-gradient(180deg, #bc7c00 0%, #6e3b00 100%)'
        }
        disabled={isUnlocking || isLogEventCreating}
      >
        {error ? (
          t(error)
        ) : (
          <>
            {unlockedMessageStatus ? (
              <div className='premium-success-message'>
                {unlockedMvpMetaData?.unlockedMvpName}{' '}
                {t('tokenization.unlocked')} {mvpTokenAmount}{' '}
                {t('tokenization.tokens')}
              </div>
            ) : (
              <>
                {isMvpUnlocked ? (
                  tokenisationUseCaseData?.title === 'More Fun Games' ? (
                    <>{t('tokenization.readyToPlay')}</>
                  ) : (
                    <>{t('tokenization.checkOutNow')}</>
                  )
                ) : (
                  <>
                    {t('tokenization.unlockNowFor')}{' '}
                    {isLogEventCreating || isUnlocking ? (
                      <div className='premium-loader'>
                        <CircularProgress color='inherit' size={14} />
                      </div>
                    ) : (
                      <>{Math.abs(mvpTokenAmount)} </>
                    )}{' '}
                    {t('tokenization.tokens')}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Button>
    </div>
  )
}

export default PremiumContent
