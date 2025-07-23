import React from 'react'
import './index.css'
import PropTypes from 'prop-types'

const LoaderWithPercentage = ({
  percentage,
  loaderPrimaryColor = '#ffffff',
  loaderSecondaryColor = '##f5f5f5',
  text,
  backgroundColor = 'rgba(0, 0, 0, 0.8)'
}) => {
  const radius = 54
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * percentage) / 100

  return (
    <div className='p-loader-overlay' style={{ backgroundColor }}>
      <div className='p-loader-container'>
        <svg className='p-progress-ring' width='120' height='120'>
          <circle
            className='p-progress-ring-circle'
            stroke={loaderSecondaryColor}
            strokeWidth={strokeWidth}
            fill='transparent'
            r={radius}
            cx='60'
            cy='60'
          />
          <circle
            className='p-progress-ring-circle'
            stroke={loaderPrimaryColor}
            strokeWidth={strokeWidth}
            fill='transparent'
            r={radius}
            cx='60'
            cy='60'
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        </svg>
        <div
          className='p-percentage-text'
          style={{ color: loaderPrimaryColor }}
        >
          {Math.round(percentage)}%
        </div>
      </div>
      {text && (
        <div className='p-loader-text' style={{ color: loaderPrimaryColor }}>
          {text}
        </div>
      )}
    </div>
  )
}

LoaderWithPercentage.propTypes = {
  percentage: PropTypes.number,
  loaderPrimaryColor: PropTypes.string,
  loaderSecondaryColor: PropTypes.string,
  text: PropTypes.string,
  backgroundColor: PropTypes.string
}

export default LoaderWithPercentage
