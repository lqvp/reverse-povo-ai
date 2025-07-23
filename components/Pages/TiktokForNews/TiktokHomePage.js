import React, { useEffect, useState, useCallback } from 'react'
import NewsGrid from './NewsGrid/NewsGrid'
import DailyNewsCarousel from './DailyNewsCarousel/DailyNewsCarousel'
import { newsSections, NEWS_CATEGORIES } from '../../../static/newsSections'
import InterestSelectionDialog from './InterestSelection/InterestSelectionDialog'
import common from '@kelchy/common'
import { axiosPost } from '../../../utils/axios'
import NewsSummaryDialogView from './NewsSummaryDialogView/NewsSummaryDialogView'
import Loader from '../../Loader/Loader'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { useFeatureAllowed } from '../../../helpers/tenantHelper'

const TiktokHomePage = ({
  isWidget,
  currentCategory,
  environment,
  tenant,
  setRedirectLoading
}) => {
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const category = queryParams.get('category') || currentCategory
  const refSource = queryParams.get('refSource')
  const currentSlide = queryParams.get('currentSlide')
  const { authorizationId } = useAppContext()
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()
  const [dailyNewsData, setDailyNewsData] = useState([])
  const [newsCarouselData, setNewsCarouselData] = useState([])
  const [openNewsViewDialog, setOpenNewsViewDialog] = useState(true)
  const [openSelectionDialog, setOpenSelectionDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [initialCarouselIndex, setInitialCarouselIndex] = useState(0)
  const [newsCategory, setNewsCategory] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const getDailyNews = useCallback(async () => {
    const body = {
      news_category: NEWS_CATEGORIES.DAILY_ROUNDUPS,
      is_news_active: true
    }
    const { data: dailyNewsApiResonse } = await common.awaitWrap(
      axiosPost('/news/get-quick-news', body)
    )
    if (dailyNewsApiResonse?.data?.news) {
      setDailyNewsData(dailyNewsApiResonse?.data?.news)
    }
  }, [])

  const getNewsCarouselData = useCallback(async (newsKey) => {
    setIsLoading(true)
    const body = {
      news_category: newsKey,
      is_news_active: true
    }
    const { data: newsCarouselApiResonse } = await common.awaitWrap(
      axiosPost('/news/get-quick-news', body)
    )
    setIsLoading(false)
    if (newsCarouselApiResonse?.data?.news) {
      setNewsCarouselData(newsCarouselApiResonse?.data?.news)
    }
    setOpenNewsViewDialog(true)
  }, [])

  useEffect(() => {
    if (category) {
      setNewsCategory(category)
      setInitialCarouselIndex(currentSlide || 0)
      getNewsCarouselData(category)
    } else {
      setNewsCategory('')
      setOpenNewsViewDialog(false)
      getDailyNews()
    }
  }, [category, currentSlide, getDailyNews, getNewsCarouselData])

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'quick_news_app'
    }
    trackEvent('news_lp_impression', properties)
  }, [authorizationId])

  const handleDailyNewsSectionClick = (newsKey, initialIndex) => {
    const properties = {
      external_id: authorizationId,
      category_name: newsKey,
      app_name: 'quick_news_app'
    }
    trackEvent('news_category_click', properties)

    setNewsCategory(newsKey)
    setInitialCarouselIndex(initialIndex)
    if (dailyNewsData?.length) {
      window.history.pushState(null, '', '/quick-news?category=daily_roundups')
      setNewsCarouselData(dailyNewsData)
      setOpenNewsViewDialog(true)
    } else {
      setInitialCarouselIndex(0)
      getNewsCarouselData(newsKey)
    }
  }

  const handleNewsSectionClick = (newsKey) => {
    const properties = {
      external_id: authorizationId,
      category_name: newsKey,
      app_name: 'quick_news_app'
    }
    trackEvent('news_category_click', properties)

    setNewsCategory(newsKey)
    setInitialCarouselIndex(0)
    navigate(`/quick-news?category=${newsKey}`)
  }

  const handleNewsViewDialogClose = () => {
    setOpenNewsViewDialog(false)
    navigate(-1)
  }

  const handleOpenSelectionPopup = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'quick_news_app'
    }
    trackEvent('news_explore_click', properties)

    setOpenSelectionDialog(true)
  }

  const handleSelectionDialogClose = () => {
    setOpenSelectionDialog(false)
  }

  // This useEffect to create log event
  useEffect(() => {
    if (category && !isWidget && isTokenisationEnabled) {
      const newCategory = category.includes('news')
        ? category
        : `${category}_news`
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_${newCategory}_lp_impression`,
        app_name: `${newCategory}`,
        event: `user_engaged_${newCategory}`,
        swipe_depth: 0
      })
    }
    // eslint-disable-next-line
  }, [category, isWidget, isTokenisationEnabled, setTokenisationUseCaseType])

  return (
    <>
      {isLoading && !openSelectionDialog ? (
        <Loader environment={environment} />
      ) : null}
      {!isWidget && (
        <div className='tt-news-layout-wrapper'>
          <div className='tt-daily-news-carousel-wrapper'>
            <div className='tt-daily-news-carousel-title'>
              {t('news.newsTitle.daily_roundups')}
            </div>
            <DailyNewsCarousel
              dailyNews={dailyNewsData}
              handleNewsSectionClick={handleDailyNewsSectionClick}
            />
          </div>
          <div className='tt-news-grid-wrapper'>
            <div className='tt-news-grid-container'>
              <NewsGrid
                newsSection={newsSections}
                handleNewsSectionClick={handleNewsSectionClick}
              />
            </div>
          </div>
          <div className='tt-explore-topics-section'>
            <div className='tt-explore-topics-text'>{t('news.moreTopics')}</div>
            <button
              className='tt-explore-button'
              onClick={handleOpenSelectionPopup}
            >
              {t('news.explore')}
            </button>
          </div>
        </div>
      )}
      {openSelectionDialog ? (
        <InterestSelectionDialog
          open={openSelectionDialog}
          handleSelectionDialogClose={handleSelectionDialogClose}
        />
      ) : null}
      {openNewsViewDialog ? (
        <NewsSummaryDialogView
          open={openNewsViewDialog}
          newsCategory={newsCategory}
          newsCarouselData={newsCarouselData}
          initialCarouselIndex={initialCarouselIndex}
          handleNewsViewDialogClose={handleNewsViewDialogClose}
          sourceOfReference={refSource}
          isWidget={isWidget}
          environment={environment}
          tenant={tenant}
          setRedirectLoading={setRedirectLoading}
        />
      ) : null}
    </>
  )
}

TiktokHomePage.propTypes = {
  isWidget: PropTypes.bool,
  currentCategory: PropTypes.string,
  environment: PropTypes.string,
  tenant: PropTypes.string,
  setRedirectLoading: PropTypes.func
}

export default TiktokHomePage
