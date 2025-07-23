import React, { useEffect, useState } from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import './DeepResearchLoader.css'

export default function DeepResearchLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 50000
    const intervalMs = 100
    const maxProgress = 99.9

    const steps = totalDuration / intervalMs
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const nextProgress =
        maxProgress * (1 - Math.exp(-3 * (currentStep / steps)))
      setProgress(nextProgress)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box className='deep-research-processing-card'>
      <Typography
        variant='subtitle1'
        className='deep-research-processing-title'
      >
        Creating a detailed report
      </Typography>
      <Typography variant='body2' className='deep-research-processing-subtext'>
        I’ll let you know as soon as the findings are ready.
      </Typography>
      <LinearProgress
        className='deep-research-processing-progress'
        variant='determinate'
        value={progress}
      />
    </Box>
  )
}
