import React, { useRef } from 'react'
import './PlayPage.css'
import GeneralIcons from '../../../../static/GeneralIcons'
import ByuPodcast from '../../ByuPodcast'
import { translatedJsonData } from '../../../../i18nextConfig'
import ByuVideos from '../../ByuVideos'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useAppContext } from '../../../../context/AppContext'
import PropTypes from 'prop-types'
import { redirectionHandler } from '../../../../helpers/redirectionHelper'
import ByuMixtapes from '../../ByuMixtapes'
import MiniGamesBanner from '../../../../widgets/MiniGamesBanner'

const { tenant, environment } = getConfigForHostname()

const playPageWidgets = {
  mixtape: {
    title: 'Mixtape',
    redirectionBtnCTAText: null,
    description: 'Create a unique mixtape for your business',
    icon: 'mixtapeIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      localhost: 'http://localhost:3001/feature-products?section=play',
      staging: 'https://aistore.circleslife.co/feature-products?section=play',
      production: 'https://aistore.circles.life/feature-products?section=play'
    },
    active: true,
    component: ByuMixtapes,
    isWidget: false,
    widgetComponents: null,
    borderShadows: false
  },
  games: {
    title: 'Mini Games',
    redirectionBtnCTAText: null,
    description: 'Unlock new game experiences for your business',
    icon: 'gamesIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      local: 'http://localhost:5173',
      staging: 'https://games-parlour.circleslife.co',
      production: 'https://games-parlour.circles.life'
    },
    active: true,
    component: MiniGamesBanner,
    isWidget: true,
    widgetComponents: null,
    borderShadows: false
  },
  uStream: {
    title: 'uStream',
    redirectionBtnCTAText: translatedJsonData.byu.widget.viewMore,
    description: 'Stream live events and engage your audience',
    icon: 'uStreamIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      local: 'http://localhost:3001/byu/video',
      staging: 'https://aistore.circleslife.co/byu/video',
      production: 'https://aistore.circles.life/byu/video'
    },
    active: true,
    component: ByuVideos,
    isWidget: false,
    widgetComponents: null,
    borderShadows: false
  },
  podcast: {
    title: 'Podcast',
    redirectionBtnCTAText: translatedJsonData.byu.widget.viewMore,
    description: 'Create a unique podcast for your business',
    icon: 'podcastIcon',
    type: 'linkWithTenant',
    redirectUrl: {
      local: 'http://localhost:3001/byu/podcast',
      staging: 'https://aistore.circleslife.co/byu/podcast',
      production: 'https://aistore.circles.life/byu/podcast'
    },
    active: true,
    component: ByuPodcast,
    isWidget: false,
    widgetComponents: null,
    borderShadows: false
  }
}

const GetWidgetPage = ({ type, setRedirectLoading }) => {
  const { authorizationId } = useAppContext()

  let widgetProps = {
    isExplore: true,
    isExploreSublayout: true
  }

  if (playPageWidgets[type]?.isWidget) {
    widgetProps = {
      ...widgetProps,
      environment,
      tenant,
      externalId: authorizationId || 'NA',
      setRedirectLoading: setRedirectLoading,
      widgetComponents: playPageWidgets[type]?.widgetComponents,
      userUnlockedComponents: []
    }
  }

  const WidgetComponent = playPageWidgets[type]?.component
  if (!WidgetComponent) return <></>

  return <WidgetComponent {...widgetProps} />
}

GetWidgetPage.propTypes = {
  type: PropTypes.string,
  setRedirectLoading: PropTypes.func
}

const PlayPage = ({ setRedirectLoading }) => {
  const { authorizationId } = useAppContext()
  const activeWidgets = Object.entries(playPageWidgets).filter(
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
      <div className='aistore-nav-feature-play-page-wrapper'>
        {activeWidgets.map(([key, widget]) => (
          <div
            key={key}
            className='aistore-nav-feature-play-page-feature-section'
            onClick={() => handlePillClick(key)}
            style={{ cursor: 'pointer' }}
          >
            <div className='aistore-nav-feature-play-page-feature-pill'>
              <div className='aistore-nav-feature-play-page-feature-pill-text'>
                {widget.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='aistore-nav-feature-play-page-feature-all-widget-wrapper'>
        {activeWidgets.map(([key, widget]) => (
          <div
            key={key}
            ref={widgetRefs.current[key]}
            className='aistore-nav-feature-play-page-feature-widget-wrapper'
          >
            <div className='aistore-nav-feature-play-page-widget-header'>
              <div className='aistore-nav-feature-play-page-widget-header-title'>
                {widget.title}
              </div>
              {widget.redirectionBtnCTAText && (
                <div
                  className='aistore-nav-feature-play-page-widget-all-apps'
                  onClick={() =>
                    redirectionHandler(widget, authorizationId, environment)
                  }
                >
                  <div className='aistore-nav-feature-play-page-widget-all-apps-text'>
                    {widget.redirectionBtnCTAText}
                  </div>
                  <div className='aistore-nav-feature-play-page-widget-header-view-more'>
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
              className={`aistore-nav-feature-play-page-widget-content ${widget?.borderShadows === false ? 'no-shadow' : ''}`}
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

PlayPage.propTypes = {
  setRedirectLoading: PropTypes.func
}

export default PlayPage
