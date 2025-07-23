import React, { useEffect, useState } from 'react'
import { Box, IconButton, Typography, Card, CardMedia } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ComingSoon from './ComingSoon'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import './index.css'
import AIChatboxIcon from '../../../static/AIChatboxIcon'

const FDTMmeMeArcade = () => {
  const [isCTAClicked, setIsCTAClicked] = useState(false)
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'fdt_meme_arcade',
      feature_name: 'meme_arcade',
      sku_name: 'meme_arcade_landing'
    }
    trackEvent('viewed meme_arcade_landing', properties)
  }, [authorizationId])

  const handleCTAClick = (eventType) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'fdt_meme_arcade'
    }
    let eventName

    switch (eventType) {
      case 'like':
        properties.feature_name = 'meme_arcade'
        properties.sku_name = 'like_meme_arcade'
        eventName = 'clicked meme_arcade_like'
        break
      case 'dislike':
        properties.feature_name = 'meme_arcade'
        properties.sku_name = 'dislike_meme_arcade'
        eventName = 'clicked meme_arcade_dislike'
        break
      case 'backToExplore':
        properties.feature_name = 'meme_arcade'
        properties.sku_name = 'meme_arcade_explore'
        eventName = 'clicked meme_arcade_explore'
        break
      case 'backToMemeArcade':
        properties.feature_name = 'meme_arcade'
        properties.sku_name = 'meme_arcade_back_to_arcade'
        eventName = 'clicked meme_arcade_back_to_arcade'
        break
      default:
        break
    }

    trackEvent(eventName, properties)

    switch (eventType) {
      case 'like':
      case 'dislike':
        setIsCTAClicked(true)
        break
      case 'backToExplore':
        navigate(-1)
        break
      case 'backToMemeArcade':
        setIsCTAClicked(false)
        break
      default:
        break
    }
  }

  return isCTAClicked ? (
    <ComingSoon handleCTAClick={handleCTAClick} />
  ) : (
    <Box className='fdt-meme-arcade-container'>
      <Box display='flex' alignItems='center' mb={2}>
        <IconButton sx={{ color: 'white' }} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography variant='h6' align='center' className='fdt-meme-arcade-title'>
        MEME ARCADE
      </Typography>
      <Typography
        variant='subtitle2'
        align='center'
        className='fdt-meme-arcade-subtitle'
      >
        1000+ memes at your finger tips
      </Typography>

      <Card
        sx={{
          mx: 'auto',
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'black',
          borderRadius: 2
        }}
      >
        <CardMedia
          component='img'
          image='/images/moviesevents/fdt-meme-arcade.png'
          alt='Drake Meme'
          sx={{ width: '100%', height: 'auto' }}
          className='fdt-meme-arcade-image'
        />
      </Card>

      <Box display='flex' justifyContent='center' mt={2}>
        <AIChatboxIcon
          kind='fdt-meme-arcade-scroll-icon'
          width={99}
          height={6}
        />
      </Box>
      <Box className='fdt-meme-arcade-buttons'>
        <div className='fdt-meme-arcade-buttons-text'>
          <IconButton
            className='fdt-meme-arcade-dislike-button'
            onClick={() => handleCTAClick('dislike')}
          >
            <AIChatboxIcon
              kind='fdt-meme-arcade-dislike-icon'
              width={32}
              height={32}
            />
          </IconButton>
        </div>
        <div className='fdt-meme-arcade-buttons-text'>
          <IconButton
            className='fdt-meme-arcade-like-button'
            onClick={() => handleCTAClick('like')}
          >
            <AIChatboxIcon
              kind='fdt-meme-arcade-like-icon'
              width={32}
              height={32}
            />
          </IconButton>
        </div>
      </Box>
    </Box>
  )
}

export default FDTMmeMeArcade
