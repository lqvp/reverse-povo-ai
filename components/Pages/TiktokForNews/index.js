import BackButton from '../../../static/BackButton'
import './index.css'
import React from 'react'
import TiktokHomePage from './TiktokHomePage'
import { useTranslation } from 'react-i18next'

const TiktokForNews = () => {
  const { t } = useTranslation('common')

  return (
    <div className='tt-app-wrapper'>
      <div className='tt-app-header'>
        <div className='tt-back-button-wrapper'>
          <BackButton color={'#FFF'} />
        </div>
        <div className='tt-appname-wrapper'>{t('news.newsInMinute')}</div>
      </div>
      <TiktokHomePage />
    </div>
  )
}

export default TiktokForNews
