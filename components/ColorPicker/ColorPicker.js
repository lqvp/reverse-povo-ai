import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { Popover } from '@mui/material'
import './ColorPicker.css'
import PropTypes from 'prop-types'

const ColorPicker = ({ color, onColorSelected }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedColor, setSelectedColor] = useState(color)

  const handleOpenPicker = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePicker = () => {
    setAnchorEl(null)
  }

  const handleColorChange = (color) => {
    setSelectedColor(color.hex)
    onColorSelected(color.hex)
  }

  return (
    <div className='color-picker-container'>
      <div
        className='color-picker-circle'
        style={{ backgroundColor: selectedColor }}
        onClick={handleOpenPicker}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <SketchPicker
          color={selectedColor}
          onChange={handleColorChange}
          presetColors={[]}
        />
      </Popover>
    </div>
  )
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  onColorSelected: PropTypes.func.isRequired
}

export default ColorPicker
