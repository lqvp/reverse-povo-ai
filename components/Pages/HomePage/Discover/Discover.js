import React from 'react'
import PropTypes from 'prop-types'
import './Discover.css'
import { getApplicationName } from '../../../../helpers/appName'
import { useTranslation } from 'react-i18next'

const Discover = ({ data, onImageSelect, selectedImage }) => {
  const { t } = useTranslation('common')

  const handleImageClick = (creation_type) => {
    if (onImageSelect) {
      onImageSelect(creation_type)
    }
  }

  const getTimeCreated = (timestamp) => {
    const currentTime = Date.now()
    const timeDifference = currentTime - timestamp

    const minutes = Math.floor(timeDifference / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes === 0) {
      return t('homePage.justNow')
    } else if (minutes < 60) {
      return `${minutes} ${
        minutes > 1 ? t('homePage.minutes') : t('homePage.minute')
      } ${t('homePage.ago')}`
    } else if (hours < 24) {
      return `${hours} ${
        hours > 1 ? t('homePage.hours') : t('homePage.hour')
      } ${t('homePage.ago')}`
    } else {
      return `${days} ${days > 1 ? t('homePage.days') : t('homePage.day')} ${t(
        'homePage.ago'
      )}`
    }
  }

  return (
    <>
      {data.length ? (
        <div className='discover-gallery'>
          {data.map((d) => (
            <div key={d.id} className='discover-gallery-item'>
              <div
                className={`discover-image-container ${
                  selectedImage === d.id ? 'selected-image' : ''
                }`}
                onClick={() => handleImageClick(d.creation_type)}
              >
                <img
                  src={d?.[`${d.creation_type}_image`]?.thumbnail_url}
                  alt={d.creation_type}
                  className='discover-gallery-image'
                />
                {d.created_at && d.creation_type ? (
                  <div className='discover-image-description'>
                    <p>{getTimeCreated(d.created_at)}</p>
                    <span>{`${t('homePage.createdOn')} ${getApplicationName(
                      d.creation_type
                    )}`}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='no-images'>{t('homePage.noContentAvailable')}</div>
      )}
    </>
  )
}

Discover.propTypes = {
  data: PropTypes.array,
  onImageSelect: PropTypes.func,
  selectedImage: PropTypes.string
}

export default Discover
