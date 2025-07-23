import React from 'react'
import { Backdrop, Typography } from '@mui/material'
import CircularProgress, {
  circularProgressClasses
} from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'

const ResultLoader = ({ open }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <CircularProgress
        variant='indeterminate'
        disableShrink
        sx={{
          animationDuration: '550ms',
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round'
          }
        }}
        size={40}
        thickness={4}
      />
      <Typography className='result-loader-text'>
        Hang tight! <br />
        We are calculating <br /> your wellness score
      </Typography>
    </Backdrop>
  )
}

ResultLoader.propTypes = {
  open: PropTypes.bool
}

export default ResultLoader
