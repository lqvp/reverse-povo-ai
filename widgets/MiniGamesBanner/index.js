import React from 'react'
import './index.css'
import { redirectionHandler } from '../../helpers/redirectionHelper'
import { translatedJsonData } from '../../i18nextConfig'
import { useAppContext } from '../../context/AppContext'
import { getConfigForHostname } from '../../helpers/tenantHelper'

const { environment } = getConfigForHostname()

const widgetData = {
  widgetComponentId: 'navigationMiniGames',
  iconId: 'miniGames',
  analyticsKey: 'miniGames',
  redirectUrl: {
    localhost: 'http://localhost:3001/mini-games',
    staging: 'https://aistore.circleslife.co/mini-games',
    production: 'https://aistore.circles.life/mini-games'
  },
  title: translatedJsonData?.byu?.widget?.miniGamesBanner?.title,
  ctaText: translatedJsonData?.byu?.widget?.miniGamesBanner?.ctaText,
  type: 'linkWithMSISDN'
}

const MiniGamesBanner = () => {
  const { authorizationId } = useAppContext()
  return (
    <div
      className='mini-games-banner-wrapper'
      onClick={() => {
        redirectionHandler(widgetData, authorizationId, environment)
      }}
    >
      <img
        className='mini-games-banner-image'
        src='/images/byu/miniGamesBanner/miniGamesBanner.png'
        alt='Mini Games Banner'
      />
      <div className='mini-games-banner-content'>
        <div className='mini-games-banner-title'>{widgetData?.title}</div>
        <div className='mini-games-banner-cta'>{widgetData?.ctaText}</div>
      </div>
    </div>
  )
}

export default MiniGamesBanner
