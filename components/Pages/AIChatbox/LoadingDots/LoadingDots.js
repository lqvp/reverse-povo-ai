import React from 'react'
import './LoadingDots.css'

const LoadingDots = () => {
  return (
    <div className='loading-container'>
      {' '}
      <div className='dot'></div> <div className='dot'></div>{' '}
      <div className='dot'></div>{' '}
    </div>
  )
}

export default LoadingDots
