import React from 'react'
import PropTypes from 'prop-types'

const WellnessTrackerCard = ({
  title,
  measurementValue,
  measurementUnit,
  indicatorColor,
  startColor,
  endColor,
  icon
}) => {
  return (
    <div
      className='wellness-card'
      style={{
        background: `linear-gradient(to bottom, ${startColor} 0%, ${endColor} 100%)`
      }}
    >
      <div className='wellness-card-title'>{title}</div>
      <div className='wellness-card-content'>
        <img src={icon} alt='icon' className='wellness-card-icon' />
      </div>
      <div className='wellness-card-footer'>
        <div
          className='wellness-card-footer-icon'
          style={{ background: indicatorColor }}
        ></div>
        <div
          className={`wellness-card-measurement-value ${measurementValue === 'UNKNOWN' ? 'smaller' : ''}`}
        >
          {measurementValue}{' '}
          {measurementUnit && (
            <span className='wellness-card-measurement-unit'>
              {measurementUnit}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

WellnessTrackerCard.propTypes = {
  title: PropTypes.string.isRequired,
  measurementValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  measurementUnit: PropTypes.string,
  indicatorColor: PropTypes.string.isRequired,
  startColor: PropTypes.string.isRequired,
  endColor: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
}

export default WellnessTrackerCard
