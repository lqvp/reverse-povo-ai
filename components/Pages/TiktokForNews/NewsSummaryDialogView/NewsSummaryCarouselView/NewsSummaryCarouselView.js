import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './NewsSummaryCarouselView.css'
import { useAppContext } from '../../../../../context/AppContext'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import { useLocation } from 'react-router-dom'
import ArrowIconNews from '../../../../../static/ArrowIconNews'
import { Box } from '@mui/material'
import NewsSummaryCarouselItem from './NewsSummaryCarouselItem'
import { recordNewsResponseCompletionResponse } from '../../../../../helpers/milestoneResponseRecorder'
import PropTypes from 'prop-types'

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  touchMove: true
}

const NewsSummaryCarouselView = ({
  newsCarouselData,
  initialCarouselIndex,
  newsCategory,
  setCurrentNews,
  handleNewsViewDialogClose
}) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const currentSlide = queryParams.get('currentSlide')
  const activeSlide = currentSlide ?? initialCarouselIndex
  const { authorizationId } = useAppContext()
  const sliderRef = useRef(null)
  const containerRef = useRef(null)
  const [nextSlide, setNextSlide] = useState(Number(activeSlide) || 0)
  const [containerHeight, setContainerHeight] = useState(null)

  useEffect(() => {
    if (activeSlide && newsCarouselData[activeSlide] && authorizationId) {
      const { news_category, news_id } = newsCarouselData[activeSlide]
      recordNewsResponseCompletionResponse(
        authorizationId,
        news_id,
        news_category
      )
    } else {
      const { news_category, news_id } = newsCarouselData[0]
      recordNewsResponseCompletionResponse(
        authorizationId,
        news_id,
        news_category
      )
    }
  }, [authorizationId, activeSlide, newsCarouselData])

  const emptySlidesCount = Math.max(0, 1 - (newsCarouselData?.length || 0))

  // calculate visible lines
  const calculateVisibleLines = () => {
    const container = containerRef.current
    if (container) {
      const containerClientHeight = container.clientHeight
      setContainerHeight(containerClientHeight - 20)
    }
  }

  const handleSlideEnd = () => {
    if (nextSlide === newsCarouselData.length - 1) {
      handleNewsViewDialogClose()
    }
    if (sliderRef.current) {
      sliderRef.current.slickNext()
    }
  }

  const handleBeforeChange = (next) => {
    setNextSlide(next)
  }

  const handleAfterChange = (currentSlide) => {
    if (
      nextSlide === currentSlide &&
      currentSlide === newsCarouselData.length - 1
    ) {
      handleNewsViewDialogClose()
      return
    }

    if (newsCarouselData[currentSlide] && authorizationId) {
      const { news_category, news_id } = newsCarouselData[currentSlide]
      recordNewsResponseCompletionResponse(
        authorizationId,
        news_id,
        news_category
      )
    }

    const currentNews = newsCarouselData[currentSlide]
    setCurrentNews(currentNews)

    const properties = {
      external_id: authorizationId,
      category_name: newsCategory,
      content_id: currentNews?.news_id || 'N/A',
      app_name: 'quick_news_app'
    }
    trackEvent('news_content_impression', properties)
  }

  const handleReadMoreClick = (news_id) => {
    const properties = {
      external_id: authorizationId,
      category_name: newsCategory,
      content_id: news_id || 'N/A',
      app_name: 'quick_news_app'
    }
    trackEvent('news_read_more_click', properties)
  }

  useEffect(() => {
    calculateVisibleLines()
  }, [newsCarouselData])

  const emptySlides = Array.from({ length: emptySlidesCount }).map(
    (_, index) => <div key={`empty-${index}`}></div>
  )

  return (
    <div
      ref={containerRef}
      className='tt-nsdv-carousel-container'
      style={{ height: '100%', overflow: 'hidden' }}
    >
      {newsCarouselData?.length ? (
        <Slider
          ref={sliderRef}
          {...settings}
          nextArrow={
            <Box className='slick-next'>
              <div onClick={handleSlideEnd}>
                <ArrowIconNews />
              </div>
            </Box>
          }
          prevArrow={
            <Box className='slick-prev'>
              <ArrowIconNews />
            </Box>
          }
          beforeChange={handleBeforeChange}
          afterChange={handleAfterChange}
          initialSlide={nextSlide}
        >
          {newsCarouselData?.map((news) => (
            <NewsSummaryCarouselItem
              key={news?.news_id}
              news={news}
              containerHeight={containerHeight}
              handleReadMoreClick={handleReadMoreClick}
              authorizationId={authorizationId}
            />
          ))}
          {emptySlides}
        </Slider>
      ) : null}
    </div>
  )
}

NewsSummaryCarouselView.propTypes = {
  newsCarouselData: PropTypes.arrayOf(
    PropTypes.shape({
      news_category: PropTypes.string,
      news_id: PropTypes.string
    })
  ).isRequired,
  initialCarouselIndex: PropTypes.number.isRequired,
  newsCategory: PropTypes.string.isRequired,
  setCurrentNews: PropTypes.func.isRequired,
  handleNewsViewDialogClose: PropTypes.func.isRequired
}

export default NewsSummaryCarouselView
