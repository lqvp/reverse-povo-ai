import React from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PropTypes from 'prop-types'

const ComingSoonScreen = ({ handleCTAClick }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxWidth: '100%',
        background: 'linear-gradient(to bottom, #6b006b, #330033)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      <IconButton
        sx={{
          color: 'white',
          position: 'absolute',
          top: 16,
          left: 16
        }}
        onClick={() => handleCTAClick('backToMemeArcade')}
        aria-label='Back to Meme Arcade'
      >
        <ArrowBackIcon />
      </IconButton>

      <Box
        sx={{ width: '100%', maxWidth: 480, mx: 'auto', textAlign: 'center' }}
      >
        <Box
          component='img'
          src='/images/moviesevents/VLCPlayer.png'
          alt='Coming Soon'
          sx={{
            width: 100,
            height: 100,
            mb: 4
          }}
        />
        <Typography className='fdt-meme-arcade-cs-heading'>
          Hey! You caught us before we’re ready
        </Typography>
        <Typography className='fdt-meme-arcade-cs-text'>
          We’re working hard to put the finishing touches to this experience
        </Typography>

        <Box className='fdt-meme-arcade-buttons'>
          <div className='fdt-meme-arcade-buttons-text'>
            <Button
              variant='outlined'
              sx={{
                color: '#ff66ff',
                borderColor: '#ff66ff',
                borderRadius: 2,
                px: 3,
                textTransform: 'none'
              }}
              onClick={() => handleCTAClick('backToExplore')}
            >
              Back to Xplore
            </Button>
          </div>
          <div className='fdt-meme-arcade-buttons-text'>
            <Button
              variant='contained'
              sx={{
                backgroundColor: '#ff00cc',
                color: 'white',
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#e600b8'
                }
              }}
              onClick={() => handleCTAClick('backToMemeArcade')}
            >
              Back to Memes
            </Button>
          </div>
        </Box>
      </Box>
    </Box>
  )
}
ComingSoonScreen.propTypes = {
  handleCTAClick: PropTypes.func.isRequired
}

export default ComingSoonScreen
