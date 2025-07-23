import React from 'react'
import './ErrorFallbackPage.css'
import { useTranslation } from 'react-i18next'

const ErrorFallbackPage = () => {
  const { t } = useTranslation('common')

  const onBackButtonClicked = () => {
    window.location.replace(document.referrer)
  }

  return (
    <div className='error-boundary-screen'>
      <div className='error-boundary-container'>
        <div className='error-boundary-title'>
          {t('errorBoundary.aiStoreCurrentlyUnavailable')}
        </div>
        <div className='error-boundary-wrapper'>
          <img
            src='/images/AI_store_error_image.png'
            alt='Something went wrong!'
          />
        </div>
        <div className='error-boundary-subtext'>
          {t('errorBoundary.checkBackAgainSomeTimeLater')}
        </div>
        <div className='error-boundary-back-button-wrapper'>
          <button onClick={onBackButtonClicked}>{t('back')}</button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallbackPage
