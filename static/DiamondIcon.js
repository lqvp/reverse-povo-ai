import React from 'react'
import PropTypes from 'prop-types'

const DiamondIcon = ({ width = 40, height = 40 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 40 40'
      fill='none'
    >
      <circle
        cx='20'
        cy='20'
        r='19.1667'
        fill='url(#paint0_linear_5245_8283)'
        stroke='url(#paint1_linear_5245_8283)'
        strokeWidth='1.66667'
      />
      <path
        d='M12.4999 11.6666C12.3453 11.6666 12.1937 11.7063 12.0622 11.7813C11.9306 11.8563 11.8243 11.9636 11.755 12.0912L8.42189 18.2448C8.34981 18.3773 8.32074 18.5262 8.33818 18.6735C8.35563 18.8209 8.41884 18.9605 8.52022 19.0755L19.3528 31.3826C19.4309 31.4713 19.5295 31.5429 19.6414 31.592C19.7532 31.6411 19.8755 31.6666 19.9994 31.6666C20.1233 31.6666 20.2456 31.6411 20.3575 31.592C20.4693 31.5429 20.5679 31.4713 20.646 31.3826L31.4786 19.0755C31.5802 18.9607 31.6437 18.8211 31.6615 18.6738C31.6792 18.5264 31.6504 18.3774 31.5786 18.2448L28.2455 12.0912C28.1761 11.9634 28.0695 11.8559 27.9376 11.7809C27.8057 11.7059 27.6538 11.6663 27.4989 11.6666H12.4999ZM10.5151 17.8202L13.0149 13.205H16.4313L15.1814 17.8202H10.5151ZM10.9167 19.3586H15.2214L17.9095 27.3028L10.9167 19.3586ZM16.9663 19.3586H23.0325L19.9994 28.3166L16.9663 19.3586ZM24.7791 19.3586H29.0821L22.0893 27.3028L24.7791 19.3586ZM29.4837 17.8202H24.8174L23.5675 13.205H26.9839L29.4837 17.8202ZM23.0992 17.8202H16.8996L18.1495 13.205H21.8493L23.0992 17.8202Z'
        fill='url(#paint2_linear_5245_8283)'
      />
      <defs>
        <linearGradient
          id='paint0_linear_5245_8283'
          x1='20'
          y1='0'
          x2='20'
          y2='40'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FFF16F' />
          <stop offset='1' stopColor='#FFA234' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_5245_8283'
          x1='20'
          y1='0'
          x2='20'
          y2='40'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#BC7C00' />
          <stop offset='1' stopColor='#6E3B00' />
        </linearGradient>
        <linearGradient
          id='paint2_linear_5245_8283'
          x1='19.9999'
          y1='11.6666'
          x2='19.9999'
          y2='31.6666'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#BC7C00' />
          <stop offset='1' stopColor='#6E3B00' />
        </linearGradient>
      </defs>
    </svg>
  )
}

DiamondIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}

export default DiamondIcon
