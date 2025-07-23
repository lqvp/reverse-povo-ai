import React, { useRef, useState, useMemo } from 'react'
import './index.css'
import Slider from 'react-slick'
import LeftArrow from '../../static/LeftArrowIcon'
import TenSecondsClick from '../../components/Pages/FunGames/TenSecondsClick/TenSecondsClick'
import ReactionTime from '../../components/Pages/FunGames/ReactionTime/ReactionTime'
import MoreFunAppsCard from '../../components/Pages/FunGames/MoreFunAppsCard/MoreFunAppsCard'
import {
  getLockedComponent,
  getWidgetComponentsLockedStatus
} from '../../helpers/getWidgetComponentsLockedStatus'
import { filterByDeviceCompatibility } from '../../utils/converter'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../useTenantConfig'
import GeneralIcons from '../../static/GeneralIcons'
import { useTranslation } from 'react-i18next'
import QuickNavigation from '../QuickNavigation/QuickNavigation'
import { translatedJsonData } from '../../i18nextConfig'
import { tenantType } from '../../common/constants'
import { redirectionHandler } from '../../helpers/redirectionHelper'
import CountToTen from '../../components/Pages/FunGames/CountToTen/CountToTen'

const navigationFunGamesProduct = [
  {
    widgetComponentId: 'dailyQuiz',
    title: translatedJsonData?.byu?.widget?.funGames?.dailyQuizNav,
    description: translatedJsonData?.byu?.widget?.funGames?.dailyQuizNavDesc,
    image: `/images/navigation/byu-navigation-component/dailyQuiz.png`,
    url: {
      staging: 'https://aistore.circleslife.co/trivia',
      production: 'https://aistore.circles.life/trivia'
    },
    type: 'navigation'
  },
  {
    widgetComponentId: 'funWithSelfies',
    title: translatedJsonData?.byu?.widget?.funGames?.funWithSelfiesNav,
    description:
      translatedJsonData?.byu?.widget?.funGames?.funWithSelfiesNavDesc,
    image: `/images/navigation/byu-navigation-component/avatar.png`,
    url: {
      staging: 'https://aistore.circleslife.co/photo-animator',
      production: 'https://aistore.circles.life/photo-animator'
    },
    type: 'navigation'
  },
  {
    widgetComponentId: 'riddles',
    title: translatedJsonData?.byu?.widget?.funGames?.riddlesNav,
    description: translatedJsonData?.byu?.widget?.funGames?.riddlesNavDesc,
    image: `/images/navigation/byu-navigation-component/riddles.png`,
    url: {
      staging: 'https://aistore.circleslife.co/riddle-poll?section=riddles',
      production: 'https://aistore.circles.life/riddle-poll?section=riddles'
    },
    type: 'navigation'
  }
]

const RenderComponent = ({ component, ...rest }) => {
  switch (component) {
    case 'tenSecondsClick':
      return <TenSecondsClick isWidget={true} {...rest} />
    case 'reactionTime':
      return <ReactionTime isWidget={true} {...rest} />
    case 'countToTen':
      return <CountToTen isWidget={true} {...rest} />
    case 'moreFunAppsCard':
      return <MoreFunAppsCard {...rest} />
    default:
      return <MoreFunAppsCard {...rest} />
  }
}

RenderComponent.propTypes = {
  component: PropTypes.string
}

const FunGames = ({
  externalId,
  environment,
  tenant,
  setRedirectLoading,
  widgetComponents,
  userUnlockedComponents,
  isUnlockedComponentsLoading,
  isExploreSublayout = false
}) => {
  const sliderRef = useRef(null)
  const [centerSlide, setCenterSlide] = useState(0)
  const { t } = useTranslation('common')
  const tenantLayoutDetail = useTenantConfig(tenant)

  const settings = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    draggable: true,
    ...(tenantLayoutDetail?.games?.addCenterPadding && {
      centerPadding: tenant === tenantType.byu ? '26px' : '20px'
    }),
    ...(tenantLayoutDetail?.games?.paddingSlides && {
      margin: tenantLayoutDetail.games.paddingSlides
    }),
    arrows: tenantLayoutDetail?.funGames?.widget?.showArrow
  }

  const FUN_GAMES_DATA = useMemo(
    () => [
      {
        widgetComponentId: 'beatTheClock',
        appName: 'beat_the_clock',
        url: '/fun-games/ten-seconds-click',
        component: 'tenSecondsClick',
        height:
          tenantLayoutDetail?.funGames?.widget?.beatTheClockSlideHeight ??
          '433px'
      },
      {
        widgetComponentId: 'reactionTime',
        appName: 'reaction_time',
        url: '/fun-games/reaction-time',
        component: 'reactionTime',
        height:
          tenantLayoutDetail?.funGames?.widget?.reactionTimeSlideHeight ??
          '440px'
      },
      {
        widgetComponentId: 'countToTen',
        appName: 'count_to_ten',
        url: '/fun-games/count-to-ten',
        component: 'countToTen',
        height:
          tenantLayoutDetail?.funGames?.widget?.countToTenSlideHeight ?? '440px'
      },
      {
        widgetComponentId: 'moreFunApps',
        appName: 'other_fun_apps',
        url: '/fun-games/more-fun-apps-card',
        component: 'moreFunAppsCard',
        height: '420px'
      }
    ],
    [tenantLayoutDetail]
  )

  const handleNextChange = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext()
    }
  }

  const handlePrevChange = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev()
    }
  }

  const handleSlideChange = (current, next) => {
    const currentSlide = FUN_GAMES_DATA[current]
    setCenterSlide(next)
    window.dataLayer.push({
      event: 'fun_app_swipe',
      external_id: externalId,
      card_name: currentSlide?.appName ?? 'NA',
      explore_version: 'V4'
    })
  }

  const generalRedirectionHandler = () => {
    const generalRedirectionPaths = {
      redirectUrl: {
        locahost: 'http://localhost:3001/feature-products?section=fun',
        staging: 'https://aistore.circleslife.co/feature-products?section=fun',
        production: 'https://aistore.circles.life/feature-products?section=fun'
      },
      type: 'linkWithTenant'
    }
    redirectionHandler(generalRedirectionPaths, externalId, environment)
  }

  // Filter components based on device compatibility and locked status
  const allowedComponents = useMemo(() => {
    if (!FUN_GAMES_DATA?.length) {
      return []
    }
    const filteredFunGames = getWidgetComponentsLockedStatus(
      FUN_GAMES_DATA,
      widgetComponents
    )
    return filterByDeviceCompatibility(filteredFunGames)
  }, [widgetComponents, FUN_GAMES_DATA])

  return (
    <>
      {allowedComponents?.length > 1 && (
        <div
          className={`widget-fun-games-container ${isExploreSublayout ? 'sublayout' : ''}`}
        >
          {tenantLayoutDetail?.widget?.showWidgetTitle &&
            !isExploreSublayout && (
              <div className='widget-fun-games-section-widget-title byu-widget-title'>
                <div className='byu-widget-title-text'>
                  {t('byu.widget.funGames.title')}
                </div>
                <div
                  className='byu-widget-all-apps'
                  onClick={generalRedirectionHandler}
                >
                  <div className='byu-widget-all-apps-text'>
                    {t('byu.widget.viewMore')}
                  </div>
                  <div className='byu-widget-all-apps-icon'>
                    <GeneralIcons
                      kind='forward-byu'
                      width={14}
                      height={10}
                      color='#6A7481'
                    />
                  </div>
                </div>
              </div>
            )}
          <Slider
            infinite={allowedComponents?.length !== 1}
            centerMode={allowedComponents?.length !== 1}
            arrows={allowedComponents?.length !== 1}
            dots={allowedComponents?.length !== 1}
            {...settings}
            className={`widget-fun-games-slider ${tenant}`}
            beforeChange={handleSlideChange}
            nextArrow={
              <div onClick={handleNextChange}>
                <LeftArrow />
              </div>
            }
            prevArrow={
              <div onClick={handlePrevChange}>
                <LeftArrow />
              </div>
            }
          >
            {allowedComponents &&
              allowedComponents?.map((item, index) => {
                const isLocked =
                  item?.lockedStatus &&
                  !userUnlockedComponents?.includes(item?.widgetComponentId)
                return (
                  <div
                    key={`fungame-section-${item?.appName}`}
                    className={`widget-fun-games-slide ${
                      index === centerSlide ? 'active' : ''
                    }`}
                    style={{
                      height:
                        index === centerSlide
                          ? item?.height
                          : tenantLayoutDetail?.funGames?.widget
                              ?.centreSlideHeight
                    }}
                  >
                    {getLockedComponent(isUnlockedComponentsLoading, isLocked)}
                    <div
                      className='widget-fun-games-content'
                      style={{
                        height:
                          index === centerSlide
                            ? item?.height
                            : tenantLayoutDetail?.funGames?.widget
                                ?.centreSlideHeight
                      }}
                    >
                      {RenderComponent({
                        component: item?.component,
                        environment,
                        tenant,
                        setRedirectLoading,
                        lockedStatus: isLocked || isUnlockedComponentsLoading
                      })}
                    </div>
                  </div>
                )
              })}
          </Slider>
        </div>
      )}
      {!isExploreSublayout && (
        <div className='widget-fun-games-navigation-section-container'>
          {tenantLayoutDetail?.widget?.showNavigationComponents && (
            <QuickNavigation
              navigationComponents={navigationFunGamesProduct}
              widgetComponents={widgetComponents}
              userUnlockedComponents={userUnlockedComponents}
              externalId={externalId}
              environment={environment}
              setRedirectLoading={setRedirectLoading}
              tenant={tenant}
              tenantLayout={tenantLayoutDetail}
              isUnlockedComponentsLoading={isUnlockedComponentsLoading}
              generalRedirectionHandler={generalRedirectionHandler}
            />
          )}
        </div>
      )}
    </>
  )
}

FunGames.propTypes = {
  externalId: PropTypes.string,
  environment: PropTypes.string,
  tenant: PropTypes.string,
  setRedirectLoading: PropTypes.func,
  widgetComponents: PropTypes.array,
  userUnlockedComponents: PropTypes.array,
  isUnlockedComponentsLoading: PropTypes.bool,
  isExploreSublayout: PropTypes.bool
}

FunGames.displayName = 'FunGames'

export default FunGames
