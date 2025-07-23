import React from 'react'
import PropTypes from 'prop-types'
import './NewsGrid.css'

const NewsGrid = ({ newsSection, handleNewsSectionClick }) => {
  const isOdd = newsSection?.length % 2 !== 0

  return (
    <div className='news-grid'>
      {newsSection?.map((news, index) => (
        <div
          key={news.id}
          className={`news-item ${
            isOdd && index === newsSection.length - 1 ? 'full-width' : ''
          }`}
        >
          <div
            className='news-container'
            onClick={() => handleNewsSectionClick(news.key)}
          >
            <img src={news.url} alt={news.name} className='news-image' />
            <div className='new-container-gradient'></div>
            {news.title ? (
              <div className='news-section-text-wrapper'>
                <div className='news-section-title'>{news.title}</div>
                <div className='news-section-desc'>{news.desc}</div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

NewsGrid.propTypes = {
  newsSection: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      url: PropTypes.string,
      name: PropTypes.string,
      key: PropTypes.string,
      title: PropTypes.string,
      desc: PropTypes.string
    })
  ),
  handleNewsSectionClick: PropTypes.func.isRequired
}

export default NewsGrid
