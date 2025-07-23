import React, { useEffect, useState } from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import './ImageGenrationLoader.css'

export default function ImageGenrationLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 60000
    const intervalMs = 1000
    const increment = 100 / (totalDuration / intervalMs)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box className='image-gen-processing-card'>
      <Typography variant='subtitle1' className='image-gen-processing-title'>
        Processing image
      </Typography>
      <Typography variant='body2' className='image-gen-processing-subtext'>
        Lots of people are creating images, this might take a bit.
      </Typography>
      <LinearProgress
        className='image-gen-processing-progress'
        variant='determinate'
        value={progress}
      />
    </Box>
  )
}
