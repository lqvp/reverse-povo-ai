import React, { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './NewsSummaryCarouselView2.css'
import { useAppContext } from '../../../../../context/AppContext'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import { newsCategoryMapper } from '../../../../../common/constants'
import ArrowIcon from '../../../../../static/ArrowIcon'
import { Box } from '@mui/material'
import { recordNewsResponseCompletionResponse } from '../../../../../helpers/milestoneResponseRecorder'
import { getWidgetBaseUrl } from '../../../../../helpers/helperFunctions'
import PropTypes from 'prop-types'
import { getFallbackNewsImage } from '../../../../../utils/converter'

const settings = {
  dots: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  touchMove: true,
  initialSlide: 0,
  nextArrow: (
    <Box className='slick-next'>
      <ArrowIcon />
    </Box>
  ),
  prevArrow: (
    <Box className='slick-prev'>
      <ArrowIcon />
    </Box>
  )
}

const NewsSummaryCarouselView2 = ({
  newsCarouselData,
  newsCategory,
  setCurrentNews,
  environment,
  tenant,
  setRedirectLoading
}) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const { authorizationId } = useAppContext()
  const viewedNewsSet = useRef(new Set())

  const emptySlidesCount = Math.max(0, 1 - (newsCarouselData?.length || 0))

  useEffect(() => {
    if (newsCarouselData.length > 0 && authorizationId) {
      const { news_category, news_id, created_at } = newsCarouselData[0]
      if (!viewedNewsSet.current.has(news_id + created_at)) {
        recordNewsResponseCompletionResponse(
          authorizationId,
          news_id,
          news_category
        )
        viewedNewsSet.current.add(news_id + created_at)
      }
    }
  }, [authorizationId, newsCarouselData])

  const handleAfterChange = (currentSlide) => {
    setActiveSlide(currentSlide)
    const currentNews = newsCarouselData[currentSlide]

    if (
      currentNews &&
      !viewedNewsSet.current.has(
        currentNews.news_id + currentNews.created_at
      ) &&
      authorizationId
    ) {
      // Response completion feed for milestone changes
      const { news_category, news_id, created_at } = currentNews
      recordNewsResponseCompletionResponse(
        authorizationId,
        news_id,
        news_category
      )
      viewedNewsSet.current.add(news_id + created_at)
    }

    setCurrentNews(currentNews)

    const properties = {
      external_id: authorizationId,
      category_name: newsCategory,
      content_id: currentNews?.news_id || 'N/A',
      app_name: 'quick_news_app'
    }
    trackEvent('news_content_impression', properties)
  }

  const emptySlides = Array.from({ length: emptySlidesCount }).map(
    (_, index) => <div key={`empty-${index}`}></div>
  )

  const clickHandler = (e, news_id) => {
    e.stopPropagation()
    const properties = {
      external_id: authorizationId,
      tab_name: newsCategoryMapper(newsCategory, true),
      content_id: news_id || 'N/A',
      app_name: 'quick_news_app'
    }
    trackEvent('trending_story_click', properties)
    if (window.parent) {
      if (environment) {
        setRedirectLoading(true)
        const url = `${getWidgetBaseUrl(
          environment
        )}/quick-news?category=${newsCategory}&currentSlide=${activeSlide}&tenant=${tenant}`
        window.location.assign(url)
      } else {
        const url = new URL(window.location)
        url.searchParams.set('category', newsCategory)
        url.searchParams.set('currentSlide', activeSlide)
        url.searchParams.delete('refSource')
        window.parent.location.href = url.toString()
      }
    }
  }

  return (
    <>
      {newsCarouselData?.length ? (
        <div className={`news-summary-carousel-view2 ${tenant}`}>
          <div className='news-summary-view2-category'>
            {newsCategoryMapper(newsCategory, false)}
          </div>
          <Slider
            {...settings}
            afterChange={handleAfterChange}
            infinite={newsCarouselData?.length > 1 || false}
          >
            {newsCarouselData?.map((news) => (
              <div
                key={news?._id}
                className='news-summary-view2-carousel-item'
                onClick={(e) => {
                  clickHandler(e, news?.news_id)
                }}
              >
                <div className='news-summary-view2-image-container'>
                  <img
                    src={news?.news_image_url || getFallbackNewsImage()}
                    onError={(e) => {
                      e.target.src = getFallbackNewsImage()
                    }}
                    alt={news?.news_title}
                    className='news-summary-view2-carousel-image'
                  />
                  <div className='news-summary-view2-image-gradient'></div>
                  <div className='news-summary-view2-section-title'>
                    {news?.news_title}
                  </div>
                </div>
              </div>
            ))}
            {emptySlides}
          </Slider>
        </div>
      ) : null}
    </>
  )
}

NewsSummaryCarouselView2.propTypes = {
  newsCarouselData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      news_id: PropTypes.string,
      news_category: PropTypes.string,
      created_at: PropTypes.string,
      news_image_url: PropTypes.string,
      news_title: PropTypes.string
    })
  ).isRequired,
  newsCategory: PropTypes.string.isRequired,
  setCurrentNews: PropTypes.func.isRequired,
  environment: PropTypes.string.isRequired,
  tenant: PropTypes.string.isRequired,
  setRedirectLoading: PropTypes.func.isRequired
}

export default NewsSummaryCarouselView2
