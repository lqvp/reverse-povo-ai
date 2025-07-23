import React from 'react'
import './index.css'
import { redirectionHandler } from '../../helpers/redirectionHelper'
import { translatedJsonData } from '../../i18nextConfig'
import { useAppContext } from '../../context/AppContext'
import { getConfigForHostname } from '../../helpers/tenantHelper'

const { environment } = getConfigForHostname()

const widgetData = {
  widgetComponentId: 'navigationGames',
  iconId: 'games',
  analyticsKey: 'games',
  redirectUrl: {
    localhost: 'http://localhost:3001/trivia',
    staging: 'https://aistore.circleslife.co/trivia',
    production: 'https://aistore.circles.life/trivia'
  },
  title: translatedJsonData?.byu?.widget?.dailyGamesBanner?.title,
  titlePart: translatedJsonData?.byu?.widget?.dailyGamesBanner?.titlePart,
  ctaText: translatedJsonData?.byu?.widget?.dailyGamesBanner?.ctaText,
  type: 'linkWithTenant'
}

const DailyQuizBanner = () => {
  const { authorizationId } = useAppContext()
  return (
    <div className='daily-quiz-banner-wrapper'>
      <div className='daily-quiz-banner-background-image-wrapper'>
        <div
          className='daily-quiz-banner-background-desc-wrapper'
          onClick={() => {
            redirectionHandler(widgetData, authorizationId, environment)
          }}
        >
          <div className='daily-quiz-banner-title-wrapper'>
            <div className='daily-quiz-banner-title'>{widgetData?.title}</div>
            <div className='daily-quiz-banner-title'>
              {widgetData?.titlePart}
            </div>
          </div>
          <div className='daily-quiz-banner-cta'>{widgetData?.ctaText}</div>
        </div>
      </div>
    </div>
  )
}

export default DailyQuizBanner
