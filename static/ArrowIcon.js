import React from 'react'

const ArrowIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='35'
      height='35'
      viewBox='0 0 35 35'
      fill='none'
    >
      <g filter='url(#filter0_b_24308_4526)'>
        <circle
          cx='17.9351'
          cy='17.0651'
          r='17'
          transform='rotate(179.781 17.9351 17.0651)'
          fill='white'
          fillOpacity='0.3'
        />
        <circle
          cx='17.9351'
          cy='17.0651'
          r='16.5'
          transform='rotate(179.781 17.9351 17.0651)'
          stroke='white'
          strokeOpacity='0.3'
        />
      </g>
      <path
        d='M16.4512 21.5708L21.4315 16.4255L16.413 11.5709'
        stroke='#333333'
        strokeWidth='1.518'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <defs>
        <filter
          id='filter0_b_24308_4526'
          x='-3.06445'
          y='-3.93506'
          width='42'
          height='42'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feGaussianBlur in='BackgroundImageFix' stdDeviation='2' />
          <feComposite
            in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_24308_4526'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_backgroundBlur_24308_4526'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default ArrowIcon
