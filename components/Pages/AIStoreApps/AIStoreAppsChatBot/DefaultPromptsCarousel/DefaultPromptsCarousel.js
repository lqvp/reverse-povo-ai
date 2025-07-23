import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import PropTypes from 'prop-types'

const DefaultPromptsCarousel = ({
  defaultPrompts,
  onSelectPrompt,
  uiConfigs
}) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    touchMove: true,
    swipeToSlide: true,
    centerMode: false,
    variableWidth: true,
    slidesToScroll: 1
  }

  return (
    <Slider {...settings}>
      {defaultPrompts?.map((dPrompt, index) => (
        <div key={index}>
          <div
            className='default-prompt'
            style={{ background: uiConfigs?.chatIconBgColor }}
            onClick={() => onSelectPrompt(dPrompt)}
          >
            <div className='default-prompt-text'>{dPrompt?.content}</div>
          </div>
        </div>
      ))}
    </Slider>
  )
}

DefaultPromptsCarousel.propTypes = {
  defaultPrompts: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired
    })
  ),
  onSelectPrompt: PropTypes.func.isRequired,
  uiConfigs: PropTypes.shape({
    chatIconBgColor: PropTypes.string
  }).isRequired
}

export default DefaultPromptsCarousel
