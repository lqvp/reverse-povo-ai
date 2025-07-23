import React from 'react'
import TriviaBackIcon from '../../../static/TriviaBackIcon'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const Header = ({ color = '#333333', title }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='ai-stylist-header'>
      <div className='ai-stylist-back' onClick={handleBack}>
        <TriviaBackIcon color={color} />
      </div>
      {title && (
        <div className='ai-stylist-title' style={{ color: color }}>
          {title}
        </div>
      )}
      <div className='ai-stylist-spacer'></div>
    </div>
  )
}

Header.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string
}

export default Header
