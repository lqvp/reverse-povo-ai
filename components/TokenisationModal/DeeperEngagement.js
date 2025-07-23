import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenisationContext } from '../../context/TokenisationContext'
import RefreshIcon from '../../static/RefreshIcon'
import Button from './Button'

const DeeperEngagement = () => {
  const { tokenisationUseCaseData, mvpTokenAmount } = useTokenisationContext()
  const { t } = useTranslation('common')
  return (
    <div className='deeper-engagement token-use-case-container'>
      <div className='deeper-engagement-title'>
        {t('tokenization.wantToPlay')}
      </div>
      <div className='deeper-engagement-description'>
        {t('tokenization.pay')} {mvpTokenAmount} {t('tokenization.tokens')}{' '}
        {t('tokenization.toGet')}
        {tokenisationUseCaseData?.attemptUnlockRound} {t('tokenization.trys')}
      </div>
      <div className='refresh-icon'>
        <span>{tokenisationUseCaseData?.attemptUnlockRound}</span>
        <RefreshIcon />
      </div>
      <div className='deeper-engagement-token-deduction'>
        -{mvpTokenAmount} {t('tokenization.tokens')}
      </div>
      <Button onClick={() => {}}>{t('tokenization.buyNow')}</Button>
    </div>
  )
}

export default DeeperEngagement
