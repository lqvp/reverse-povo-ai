import React from 'react'
import PropTypes from 'prop-types'

const Button = ({
  onClick,
  children,
  bgColor = '#FFCE70',
  textColor = '#734001',
  disabled = false
}) => {
  return (
    <button
      className='tokenisation-button'
      onClick={onClick}
      style={{
        background: disabled ? '#AEAEAE' : bgColor,
        color: disabled ? '#fff' : textColor
      }}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  disabled: PropTypes.bool
}

export default Button
