import React from 'react'
import TriviaBackIcon from '../../../static/TriviaBackIcon'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const WellnessTrackerHeader = ({ color = '#333333', title }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='ai-wellness-header'>
      <div className='ai-wellness-back' onClick={handleBack}>
        <TriviaBackIcon color={color} />
      </div>
      {title && <div className='ai-wellness-title'>{title}</div>}
      <div className='ai-wellness-spacer'></div>
    </div>
  )
}

WellnessTrackerHeader.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string
}

export default WellnessTrackerHeader
