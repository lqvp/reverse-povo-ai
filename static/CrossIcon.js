import React from 'react'
import PropTypes from 'prop-types'

const CrossIcon = ({ fill }) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill={fill}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5 5L19 19'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <path
        d='M5 19L19 5'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

CrossIcon.propTypes = {
  fill: PropTypes.string
}

export default CrossIcon
