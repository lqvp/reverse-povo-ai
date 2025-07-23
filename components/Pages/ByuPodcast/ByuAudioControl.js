import React from 'react'
import PropTypes from 'prop-types'

const Play = '/images/byu/podcast/byu-play-stream.svg'
const Pause = '/images/byu/podcast/byu-pause-stream.svg'
const Next = '/images/byu/podcast/byu-skip-stream-next.svg'
const Prev = '/images/byu/podcast/byu-skip-stream-prev.svg'

const ByuAudioControl = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick
}) => (
  <div className='audio-controls'>
    <button
      type='button'
      className='prev'
      aria-label='Previous'
      onClick={onPrevClick}
    >
      <img src={Prev} alt='Prev Icon' />
    </button>
    <button
      type='button'
      className={isPlaying ? 'pause' : 'play'}
      onClick={onPlayPauseClick}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <img
        src={isPlaying ? Pause : Play}
        alt={isPlaying ? 'Pause Icon' : 'Play Icon'}
      />
    </button>
    <button
      type='button'
      className='next'
      aria-label='Next'
      onClick={onNextClick}
    >
      <img src={Next} alt='Next Icon' />
    </button>
  </div>
)

ByuAudioControl.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayPauseClick: PropTypes.func.isRequired,
  onPrevClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired
}

export default ByuAudioControl
