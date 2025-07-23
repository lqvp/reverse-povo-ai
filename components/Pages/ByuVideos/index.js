import React from 'react'
import './index.css'
import ByuVideosHome from './ByuVideosHome'
import PropTypes from 'prop-types'
import { getYouTubeVideoIdFromParam } from '../../../helpers/helperFunctions'

const BYU_DEEPLINK_URI = 'https://www.byu.id/v2/deeplink'

function redirectToStream(videoData) {
  const url = videoData?.url
  if (typeof url !== 'string') return
  const isYouTube = url.includes('youtube')
  const youtubeVideoId = isYouTube ? getYouTubeVideoIdFromParam(url) : null
  if (isYouTube && !youtubeVideoId) return
  const query = isYouTube
    ? `type=youtube&videoid=${youtubeVideoId}&url=${url}`
    : `type=video&url=${url}`
  window.location.href = `${BYU_DEEPLINK_URI}?${query}`
}

const ByuVideos = ({ isExplore }) => {
  return (
    <div
      className={`byu-video-list-container ${isExplore ? 'explore-widget' : ''}`}
    >
      <div className='byu-video-home-wrapper'>
        <ByuVideosHome
          redirectToStream={redirectToStream}
          isExplore={isExplore}
        />
      </div>
    </div>
  )
}

ByuVideos.propTypes = {
  isExplore: PropTypes.bool
}

export default ByuVideos
