import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './DailyNewsCarousel.css'
import { NEWS_CATEGORIES } from '../../../../static/newsSections'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'
import { getFallbackNewsImage } from '../../../../utils/converter'

const DailyNewsCarousel = ({ dailyNews, handleNewsSectionClick }) => {
  const { authorizationId } = useAppContext()

  const emptySlidesCount = Math.max(0, 1 - (dailyNews?.length || 0))

  const handleAfterChange = (currentSlide) => {
    const currentNews = dailyNews[currentSlide]

    const properties = {
      external_id: authorizationId,
      content_id: currentNews?.news_id || 'N/A',
      app_name: 'quick_news_app'
    }
    trackEvent('news_daily_card_content_swipe', properties)
  }
  const settings = {
    dots: true,
    infinite: dailyNews?.length > 1 || false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    initialSlide: 0,
    afterChange: handleAfterChange
  }

  const emptySlides = Array.from({ length: emptySlidesCount }).map(
    (_, index) => <div key={`empty-${index}`}></div>
  )

  return (
    <>
      {dailyNews?.length ? (
        <Slider {...settings}>
          {dailyNews?.map((news, index) => (
            <div key={news?.id} className='daily-news-carousel-item'>
              <div
                className='daily-news-image-container'
                onClick={() =>
                  handleNewsSectionClick(NEWS_CATEGORIES.DAILY_ROUNDUPS, index)
                }
              >
                <img
                  src={news?.news_image_url || getFallbackNewsImage()}
                  onError={(e) => {
                    e.currentTarget.src = getFallbackNewsImage()
                  }}
                  alt='News'
                  className='daily-news-carousel-image'
                />
                <div className='daily-new-image-gradient'></div>
                <div className='daily-news-section-title'>
                  {news?.news_title}
                </div>
              </div>
            </div>
          ))}
          {emptySlides}
        </Slider>
      ) : null}
    </>
  )
}

DailyNewsCarousel.propTypes = {
  dailyNews: PropTypes.array.isRequired,
  handleNewsSectionClick: PropTypes.func.isRequired
}

export default DailyNewsCarousel
