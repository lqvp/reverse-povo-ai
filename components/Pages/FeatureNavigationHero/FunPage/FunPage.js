import React, { useRef } from 'react'
import './FunPage.css'
import PropTypes from 'prop-types'
import GeneralIcons from '../../../../static/GeneralIcons'
import { useAppContext } from '../../../../context/AppContext'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import {
  funGamesComponent,
  funWithSelfiesComponent,
  horoscopeComponent
} from '../widgetComponentsData'
import FunWithSelfies from '../../../../widgets/FunWithSelfies'
import FunGames from '../../../../widgets/FunGames'
import Horoscope from '../../../../widgets/Horoscope'
import DailyQuizBanner from '../../../../widgets/DailyQuizBanner'
import RiddleSection from '../RiddlePollingWidget/Riddles'
import PollingGame from '../RiddlePollingWidget/PollingGame'
import { translatedJsonData } from '../../../../i18nextConfig'

const { tenant, environment } = getConfigForHostname()

const funPageWidgets = {
  dailyQuizBanner: {
    title: translatedJsonData?.byu?.fun?.dailyQuiz,
    redirectionBtnCTAText: null,
    description: 'Unlock fun and engaging quizzes for your business',
    icon: 'dailyQuizIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: 'http://localhost:3001/feature-products?section=play',
      staging: 'https://aistore.circleslife.co/feature-products?section=play',
      production: 'https://aistore.circles.life/feature-products?section=play'
    },
    active: true,
    component: DailyQuizBanner,
    isWidget: false,
    widgetComponents: null,
    borderShadows: false
  },
  riddles: {
    title: translatedJsonData?.byu?.fun?.riddles,
    redirectionBtnCTAText: null,
    description: 'Unlock new riddle experiences for your business',
    icon: 'riddlesIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: 'http://localhost:3001/riddle-poll?section=riddles',
      staging: 'https://aistore.circleslife.co/riddle-poll?section=riddles',
      production: 'https://aistore.circles.life/riddle-poll?section=riddles'
    },
    active: true,
    component: RiddleSection,
    isWidget: false,
    widgetComponents: null,
    borderShadows: false
  },
  photoEditing: {
    title: translatedJsonData?.byu?.fun?.photoEditing,
    redirectionBtnCTAText: null,
    description: 'Unlock new photo editing tools for your business',
    icon: 'photoEditingIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: '',
      staging: '',
      production: ''
    },
    active: true,
    component: FunWithSelfies,
    isWidget: true,
    widgetComponents: funWithSelfiesComponent,
    borderShadows: false
  },
  funGames: {
    title: translatedJsonData?.byu?.fun?.funGames,
    redirectionBtnCTAText: null,
    description: 'Unlock new fun game experiences for your business',
    icon: 'funGamesIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: 'http://localhost:3001/fun-games/list',
      staging: 'https://aistore.circleslife.co/fun-games/list',
      production: 'https://aistore.circles.life/fun-games/list'
    },
    active: true,
    component: FunGames,
    isWidget: true,
    widgetComponents: funGamesComponent,
    borderShadows: false
  },
  horoscope: {
    title: translatedJsonData?.byu?.fun?.horoscope,
    redirectionBtnCTAText: null,
    description: 'Unlock new horoscope experiences for your business',
    icon: 'horoscopeIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: 'http://localhost:3001/horoscope',
      staging: 'https://aistore.circleslife.co/horoscope',
      production: 'https://aistore.circles.life/horoscope'
    },
    active: true,
    component: Horoscope,
    isWidget: true,
    widgetComponents: horoscopeComponent,
    borderShadows: false
  },
  polls: {
    title: translatedJsonData?.byu?.fun?.polls,
    redirectionBtnCTAText: null,
    description: 'Unlock new poll experiences for your business',
    icon: 'pollsIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: 'http://localhost:3001/riddle-poll?section=poll',
      staging: 'https://aistore.circleslife.co/riddle-poll?section=poll',
      production: 'https://aistore.circles.life/riddle-poll?section=poll'
    },
    active: true,
    component: PollingGame,
    isWidget: false,
    borderShadows: false
  }
}

const GetWidgetPage = ({ type, setRedirectLoading }) => {
  const { authorizationId } = useAppContext()

  let widgetProps = {
    isExplore: true,
    isExploreSublayout: true
  }

  if (funPageWidgets[type]?.isWidget) {
    widgetProps = {
      ...widgetProps,
      environment,
      tenant,
      externalId: authorizationId || 'NA',
      setRedirectLoading: setRedirectLoading,
      widgetComponents: funPageWidgets[type]?.widgetComponents,
      userUnlockedComponents: []
    }
  }

  const WidgetComponent = funPageWidgets[type]?.component
  if (!WidgetComponent) return <></>

  return <WidgetComponent {...widgetProps} />
}

GetWidgetPage.propTypes = {
  type: PropTypes.string,
  setRedirectLoading: PropTypes.func
}

const FunPage = ({ setRedirectLoading }) => {
  const activeWidgets = Object.entries(funPageWidgets).filter(
    ([, value]) => value.active
  )

  const widgetRefs = useRef(
    activeWidgets.reduce((acc, [key]) => {
      acc[key] = React.createRef()
      return acc
    }, {})
  )

  const handlePillClick = (key) => {
    const ref = widgetRefs.current[key]
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <div className='aistore-nav-feature-fun-page-wrapper'>
        {activeWidgets.map(([key, widget]) => (
          <div
            key={key}
            className='aistore-nav-feature-fun-page-feature-section'
            onClick={() => handlePillClick(key)}
            style={{ cursor: 'pointer' }}
          >
            <div className='aistore-nav-feature-fun-page-feature-pill'>
              <div className='aistore-nav-feature-fun-page-feature-pill-text'>
                {widget.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='aistore-nav-feature-fun-page-feature-all-widget-wrapper'>
        {activeWidgets.map(([key, widget]) => (
          <div
            key={key}
            ref={widgetRefs.current[key]}
            className={`aistore-nav-feature-fun-page-feature-widget-wrapper ${widget?.icon}`}
          >
            <div className='aistore-nav-feature-fun-page-widget-header'>
              <div className='aistore-nav-feature-fun-page-widget-header-title'>
                {widget.title}
              </div>
              {widget.redirectionBtnCTAText && (
                <div className='aistore-nav-feature-fun-page-widget-all-apps'>
                  <div className='aistore-nav-feature-fun-page-widget-all-apps-text'>
                    {widget.redirectionBtnCTAText}
                  </div>
                  <div className='aistore-nav-feature-fun-page-widget-header-view-more'>
                    <GeneralIcons
                      kind='forward-byu'
                      width={14}
                      height={10}
                      color='#6A7481'
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              className={`aistore-nav-feature-fun-page-widget-content ${widget?.borderShadows === false ? 'no-shadow' : ''}`}
            >
              <GetWidgetPage
                type={key}
                setRedirectLoading={setRedirectLoading}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

FunPage.propTypes = {
  setRedirectLoading: PropTypes.func
}

export default FunPage
