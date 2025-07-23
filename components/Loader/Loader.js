import React from 'react'
import PropTypes from 'prop-types'
import './Loader.css'
import { CircularProgress } from '@mui/material'

const Loader = ({ loaderMsg, environment }) => {
  return (
    <div className={`loader-overlay ${environment && 'widget-overlay'}`}>
      <CircularProgress size={48} color='inherit' />
      <div className='loader-text'>{loaderMsg}</div>
    </div>
  )
}

Loader.propTypes = {
  loaderMsg: PropTypes.string,
  environment: PropTypes.string,
  newLoader: PropTypes.bool
}

export default Loader
