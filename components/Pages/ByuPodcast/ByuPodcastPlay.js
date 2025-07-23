import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Howl } from 'howler'
import ByuAudioControl from './ByuAudioControl'
import './ByuStyleControl.css'

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const ByuPodcastPlay = ({ mediaSrc, onPrevClick, onNextClick }) => {
  const [trackProgress, setTrackProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRef = useRef(null)
  const intervalRef = useRef()
  const isReady = useRef(false)

  const [duration, setDuration] = useState(0)

  const startTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (mediaRef.current?.playing()) {
        setTrackProgress(mediaRef.current.seek())
      } else if (mediaRef.current?.seek() >= mediaRef.current?.duration()) {
        setIsPlaying(false)
      }
    }, 1000)
  }

  const onScrub = (value) => {
    clearInterval(intervalRef.current)
    mediaRef.current.seek(value)
    setTrackProgress(mediaRef.current.seek())
  }

  const onScrubEnd = () => {
    if (!isPlaying) setIsPlaying(true)
    startTimer()
  }

  useEffect(() => {
    if (!mediaRef.current) return

    if (isPlaying) {
      mediaRef.current.play()
      startTimer()
    } else {
      mediaRef.current.pause()
      clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.unload()
    }

    mediaRef.current = new Howl({
      src: [mediaSrc],
      html5: true,
      onload: () => {
        setDuration(mediaRef.current.duration())
      },
      onend: () => {
        setIsPlaying(false)
      }
    })

    setTrackProgress(0)

    if (isReady.current) {
      mediaRef.current.play()
      setIsPlaying(true)
      startTimer()
    } else {
      isReady.current = true
    }
  }, [mediaSrc])

  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        mediaRef.current.unload()
      }
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className='media-player'>
      <div className='progress-container'>
        <input
          type='range'
          value={trackProgress}
          step='1'
          min='0'
          max={duration || 0}
          className='progress'
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
        />
        <div className='podcast-duration'>
          <span className='time-start'>
            {formatTime(Math.floor(trackProgress))}
          </span>
          <span className='time-end'>{formatTime(Math.floor(duration))}</span>
        </div>
      </div>
      <ByuAudioControl
        isPlaying={isPlaying}
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
        onPlayPauseClick={() => setIsPlaying((prev) => !prev)}
      />
    </div>
  )
}

ByuPodcastPlay.propTypes = {
  mediaSrc: PropTypes.string.isRequired,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func
}

export default ByuPodcastPlay
