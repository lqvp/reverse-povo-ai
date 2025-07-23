import React from 'react'
import PropTypes from 'prop-types'

const TriviaBackIcon = ({ color = '#808080' }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='31'
      height='31'
      viewBox='0 0 31 31'
      fill={color}
    >
      <path
        d='M21.9583 23.3879L13.9748 15.5001L21.9583 7.59508L19.5005 5.16675L9.04167 15.5001L19.5005 25.8334L21.9583 23.3879Z'
        fill={color}
      />
    </svg>
  )
}

TriviaBackIcon.propTypes = {
  color: PropTypes.string
}

export default TriviaBackIcon
