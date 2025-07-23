import React from 'react'
import AIStylistIcon from '../../../static/AIStylistIcon'
import PropTypes from 'prop-types'

const Button = ({
  children,
  outline,
  filled,
  icon,
  type,
  onClick,
  full,
  minWidth,
  padding,
  borderRadius,
  disabled
}) => {
  const buttonStyle = {
    border: outline ? '2px solid #790052' : 'none',
    backgroundColor: disabled ? '#ccc' : filled ? '#790052' : '#fff',
    color: disabled ? '#333333' : filled ? '#fff' : '#790052',
    width: full ? '100%' : 'auto',
    minWidth: minWidth || '10rem',
    padding: padding || '0.875rem 2rem',
    borderRadius: borderRadius || '2.5rem'
  }

  return (
    <button
      style={buttonStyle}
      className='ai-stylist-btn'
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <AIStylistIcon
          kind={icon}
          width={22}
          height={22}
          color={buttonStyle.color}
        />
      )}
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  outline: PropTypes.bool,
  filled: PropTypes.bool,
  icon: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  full: PropTypes.bool,
  minWidth: PropTypes.string,
  padding: PropTypes.string,
  borderRadius: PropTypes.string,
  disabled: PropTypes.bool
}

export default Button
