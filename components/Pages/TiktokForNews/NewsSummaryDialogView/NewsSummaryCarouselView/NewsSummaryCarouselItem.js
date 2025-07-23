import React, { useEffect, useRef, useState } from 'react'
import { getNewsUpdatedTime } from '../../../../../helpers/helperFunctions'
import {
  generateRandomCount,
  updateTruncatedText
} from '../../../../../helpers/helperFunctions'
import ShareIcon from '../../../../../static/ShareIcon'
import { shareExploreNewsDeeplink } from '../../../../../helpers/mediaHelper'
import { getDeeplinkShareVisibility } from '../../../../../helpers/tenantHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const NewsSummaryCarouselItem = ({
  news,
  containerHeight,
  handleReadMoreClick,
  authorizationId
}) => {
  const summaryTextRef = useRef(null)
  const [truncatedText, setTruncatedText] = useState(news?.news_description)
  const [likes, setLikes] = useState(generateRandomCount(50, 200))
  // const [shares] = useState(generateRandomCount(15, 100))
  const [isLiked, setIsLiked] = useState(false)
  const { t } = useTranslation('common')

  // Truncate text according to the container size
  useEffect(() => {
    const container = summaryTextRef.current
    if (container) {
      const timeout = setTimeout(() => {
        updateTruncatedText(
          container,
          news?.news_description || '',
          setTruncatedText
        )
      }, 5)

      return () => clearTimeout(timeout)
    }
  }, [news?.news_description])

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleShareClick = () => {
    shareExploreNewsDeeplink(authorizationId, news)
  }

  return (
    <>
      <div key={news?._id} className='tt-nscv-news-carousel-item'>
        <div
          className='tt-nscv-news-item-wrapper'
          style={{ height: `${containerHeight}px` }}
        >
          <div className='tt-nscv-news-image-container'>
            <img
              src={news?.news_image_url}
              alt={''}
              className='tt-nscv-news-carousel-image'
            />
          </div>
          <div className='tt-nscv-news-text-wrapper'>
            <div className='tt-nscv-news-title'>{news?.news_title}</div>
            <div className='tt-nscv-news-source-time-container'>
              <div className='tt-nscv-news-source'>{news?.news_source}</div>
              <div className='tt-nscv-news-source-time-dot'></div>
              <div className='tt-nscv-news-time-posted'>
                {getNewsUpdatedTime(news?.news_published_at)}
              </div>
            </div>
            <div className='tt-nscv-news-summary-container'>
              <div className='tt-nscv-news-summary' ref={summaryTextRef}>
                {truncatedText}
              </div>
            </div>
          </div>
          <div className='tt-dialog-action-buttons-wrapper'>
            <div className='tt-nscv-news-engagement-btn'>
              <div
                className='tt-nscv-news-engagement-icon'
                style={{ background: isLiked ? '#fff' : '#666666' }}
                onClick={handleLikeClick}
              >
                <ShareIcon
                  kind={`${isLiked ? 'heartFilledIcon' : 'heartIcon'}`}
                  width={24}
                  height={24}
                />
              </div>
              {/* this is a random number and we will update this with real like number later */}
              {/* <div className='tt-nscv-news-engagement-count'>{likes}</div> */}
            </div>
            {getDeeplinkShareVisibility() && (
              <div className='tt-nscv-news-engagement-btn'>
                <div
                  className='tt-nscv-news-engagement-icon'
                  onClick={handleShareClick}
                >
                  <ShareIcon
                    kind='newsSummaryShareIcon'
                    width={24}
                    height={24}
                  />
                </div>
                {/* this is a random number and we will update this with real share number later */}
                {/* <div className='tt-nscv-news-engagement-count'>{shares}</div> */}
              </div>
            )}

            <button
              className='tt-nscv-news-readmore-button'
              onClick={() => handleReadMoreClick(news?.news_id)}
            >
              <a
                href={news?.news_url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {t('news.readFullStory')}
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

NewsSummaryCarouselItem.propTypes = {
  news: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    news_description: PropTypes.string.isRequired,
    news_image_url: PropTypes.string.isRequired,
    news_title: PropTypes.string.isRequired,
    news_source: PropTypes.string.isRequired,
    news_published_at: PropTypes.string.isRequired,
    news_id: PropTypes.string.isRequired,
    news_url: PropTypes.string.isRequired
  }).isRequired,
  containerHeight: PropTypes.number.isRequired,
  handleReadMoreClick: PropTypes.func.isRequired,
  authorizationId: PropTypes.string.isRequired
}

export default NewsSummaryCarouselItem
