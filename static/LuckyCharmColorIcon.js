import React from 'react'

const LuckyCharmColorIcon = ({ color }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='100'
      height='100'
      viewBox='0 0 100 100'
      fill='none'
    >
      <g filter='url(#filter0_f_23833_20143)'>
        <circle cx='50' cy='50' r='28' fill='url(#paint0_linear_23833_20143)' />
      </g>
      <circle cx='50' cy='50' r='28' fill={color ?? '#4400C9'} />
      <defs>
        <filter
          id='filter0_f_23833_20143'
          x='0'
          y='0'
          width='100'
          height='100'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='BackgroundImageFix'
            result='shape'
          />
          <feGaussianBlur
            stdDeviation='11'
            result='effect1_foregroundBlur_23833_20143'
          />
        </filter>
        <linearGradient
          id='paint0_linear_23833_20143'
          x1='31.2293'
          y1='29.9988'
          x2='69.3773'
          y2='73.069'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='white' />
          <stop offset='1' stopColor='#A582E7' />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default LuckyCharmColorIcon
