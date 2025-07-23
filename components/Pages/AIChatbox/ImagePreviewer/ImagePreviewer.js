import React from 'react'
import { Dialog, IconButton, Slide, Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import PropTypes from 'prop-types'
import './ImagePreviewer.css'
import { shareMediaNativePopUp } from '../../../../helpers/mediaHelper'

const Transition = React.forwardRef((props, ref) => (
  <Slide direction='up' ref={ref} {...props} />
))
Transition.displayName = 'Transition'

function ImagePreviewer({
  imageUrl,
  openImagePreviewUrl,
  setOpenImagePreviewUrl,
  imageDownloadUrl,
  alt = 'Image'
}) {
  const handleDownload = () => {
    const anchor = document.createElement('a')
    anchor.href = imageDownloadUrl
    anchor.download = imageDownloadUrl
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const handleShare = async () => {
    shareMediaNativePopUp(imageDownloadUrl)
  }

  return (
    <>
      <Dialog
        fullScreen
        open={openImagePreviewUrl}
        onClose={() => setOpenImagePreviewUrl('')}
        TransitionComponent={Transition}
      >
        <Box className='image-preview-fullscreen-container'>
          <IconButton
            className='image-preview-close-btn'
            onClick={() => setOpenImagePreviewUrl('')}
          >
            <CloseIcon style={{ color: '#FFFFFF' }} />
          </IconButton>

          <img
            src={imageUrl}
            alt={alt}
            className='image-preview-fullscreen-image'
          />

          <Box className='image-preview-fullscreen-footer'>
            <Box className='image-preview-action' onClick={handleDownload}>
              <DownloadIcon fontSize='large' style={{ color: 'white' }} />
              <Typography style={{ color: 'white', fontSize: 12 }}>
                Save
              </Typography>
            </Box>
            <Box className='image-preview-action' onClick={handleShare}>
              <ShareIcon fontSize='large' style={{ color: 'white' }} />
              <Typography style={{ color: 'white', fontSize: 12 }}>
                Share
              </Typography>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

ImagePreviewer.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageDownloadUrl: PropTypes.string.isRequired,
  openImagePreviewUrl: PropTypes.bool.isRequired,
  setOpenImagePreviewUrl: PropTypes.func.isRequired,
  alt: PropTypes.string
}

export default ImagePreviewer
