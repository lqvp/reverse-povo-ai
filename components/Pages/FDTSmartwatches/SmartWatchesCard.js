import React from 'react'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'

const SmartWatchesCard = ({ smartwatchData, buyWatchHandler }) => {
  const { authorizationId } = useAppContext()

  const handleBuyWatchClick = (smartwatchData) => {
    const properties = {
      external_id: authorizationId,
      sku_name: smartwatchData?.name,
      app_name: 'smartwatches_fdt'
    }
    trackEvent('register_interest_click', properties)
    buyWatchHandler(smartwatchData?.id)
  }

  const handleWatchColorClick = (smartwatchData, availableColor) => {
    const properties = {
      external_id: authorizationId,
      color_name: availableColor,
      sku_name: smartwatchData?.name,
      app_name: 'smartwatches_fdt'
    }
    trackEvent('color_click', properties)
  }

  const handleWatchfeatureClick = (smartwatchData, tag) => {
    const properties = {
      external_id: authorizationId,
      feature_name: tag,
      sku_name: smartwatchData?.name,
      app_name: 'smartwatches_fdt'
    }
    trackEvent('feature_click', properties)
  }

  return (
    <div className='sw-card-wrapper'>
      <div className='sw-card-image-wrapper'>
        <img
          className='sw-card-image'
          src={smartwatchData?.image}
          alt='Not available'
        />
      </div>
      <div className='sw-card-details'>
        <div className='sw-card-name'>{smartwatchData?.name}</div>
        <div className='sw-card-colors'>
          {smartwatchData?.availableColors?.map((availableColor, index) => (
            <div
              key={index}
              className='sw-card-color-circle'
              style={{ backgroundColor: availableColor.toLowerCase() }}
              onClick={() =>
                handleWatchColorClick(smartwatchData, availableColor)
              }
            ></div>
          ))}
        </div>
        <div className='sw-card-tags-wrapper'>
          {smartwatchData?.tags?.map((tag, index) => (
            <div
              key={`${index}-${tag}`}
              className='sw-card-tag'
              onClick={() => handleWatchfeatureClick(smartwatchData, tag)}
            >
              {tag}
            </div>
          ))}
        </div>
        <div className='sw-card-price-wrapper'>
          <span className='sw-card-price'>{smartwatchData?.price}</span>
          <span className='sw-card--original-price'>
            {smartwatchData?.originalPrice}
          </span>
        </div>
        <div className='sw-card-footer'>
          <div
            className='sw-card-get-button'
            onClick={() => handleBuyWatchClick(smartwatchData)}
          >
            <div>Buy</div>
          </div>
          <div className='sw-card-rating'>
            <span>{smartwatchData?.rating}</span>
            <img className='sw-rating-image' src='/images/star.svg' alt='' />
          </div>
        </div>
      </div>
    </div>
  )
}

SmartWatchesCard.propTypes = {
  smartwatchData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    availableColors: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    price: PropTypes.string.isRequired,
    originalPrice: PropTypes.string,
    rating: PropTypes.number.isRequired
  }).isRequired,
  buyWatchHandler: PropTypes.func.isRequired
}

export default SmartWatchesCard
