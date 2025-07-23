import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import TriviaBackIcon from '../../../static/TriviaBackIcon'

const Header = ({ color = '#333333', title }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='movie-events-header'>
      <div className='movie-events-back' onClick={handleBack}>
        <TriviaBackIcon color={color} />
      </div>
      {title && (
        <div className='movie-events-title' style={{ color: color }}>
          {title}
        </div>
      )}
      <div className='movie-events-spacer'></div>
    </div>
  )
}

Header.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string
}

export default Header
