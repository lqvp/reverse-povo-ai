import React from 'react'
import './ZodiacSignCarousel.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {
  zodiacSigns,
  zodiacMobicomSigns
} from '../../../../static/HoroscopeConstants'
import PropTypes from 'prop-types'
import { getTenantName } from '../../../../helpers/tenantHelper'
import { tenantType } from '../../../../common/constants'

const tenant = getTenantName()
const zodiacSignTenant =
  tenant === tenantType.mobicom ? zodiacMobicomSigns : zodiacSigns

const ZodiacSignCarousel = ({ initialSlide, textFirst, onSlideChange }) => {
  const settings = {
    dots: false,
    infinite: true,
    centerMode: true,
    centerPadding: '25%',
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    initialSlide: initialSlide || 0,
    afterChange: (current) => {
      onSlideChange(current)
    }
  }

  return (
    <>
      {zodiacSignTenant?.length ? (
        <Slider {...settings}>
          {zodiacSignTenant?.map((sign) => (
            <div key={sign?.sign} className={`hs-zs-carousel-item ${tenant}`}>
              {textFirst ? (
                <div className='hs-zs-text-section'>
                  <div className={`hs-zs-date-range align ${tenant}`}>
                    {sign?.dateRange}
                  </div>
                </div>
              ) : null}
              <div className={`hs-zs-image-container ${tenant}`}>
                <img
                  src={sign?.sign_image}
                  alt={'Not available'}
                  className={`hs-zs-carousel-image ${tenant}`}
                />
              </div>
              {!textFirst ? (
                <div className='hs-zs-text-section'>
                  <div className={`hs-zs-date-range align ${tenant}`}>
                    {sign?.dateRange}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </Slider>
      ) : null}
    </>
  )
}

ZodiacSignCarousel.propTypes = {
  initialSlide: PropTypes.number,
  textFirst: PropTypes.bool,
  onSlideChange: PropTypes.func
}

export default ZodiacSignCarousel
