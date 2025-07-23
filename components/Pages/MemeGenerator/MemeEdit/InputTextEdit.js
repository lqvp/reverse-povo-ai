import React, { useState } from 'react'
import ColorPicker from '../../../ColorPicker/ColorPicker'
import PropTypes from 'prop-types'

const InputTextEdit = ({
  id,
  text,
  color,
  outlineColor,
  handleInputChange,
  onTextStyleChange
}) => {
  const [fontColor, setFontColor] = useState(color)
  const [fontOutlineColor, setFontOutlineColor] = useState(outlineColor)

  const onFontColorSelected = (color) => {
    setFontColor(color)
    onTextStyleChange(id, { color: color, outlineColor: fontOutlineColor })
  }

  const onOutlineColorSelected = (outlineColor) => {
    setFontOutlineColor(outlineColor)
    onTextStyleChange(id, { color: fontColor, outlineColor: outlineColor })
  }

  return (
    <div className='meme-text-input-wrapper'>
      <input
        key={id}
        type='text'
        value={text}
        onChange={(e) => handleInputChange(id, e.target.value)}
      />
      <div className='input-text-styles'>
        <ColorPicker color={fontColor} onColorSelected={onFontColorSelected} />
        <ColorPicker
          color={fontOutlineColor}
          onColorSelected={onOutlineColorSelected}
        />
      </div>
    </div>
  )
}

InputTextEdit.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  outlineColor: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onTextStyleChange: PropTypes.func.isRequired
}

export default InputTextEdit
