import React, { useEffect, useState } from 'react'
import './ByuExploreUstream.css'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import common from '@kelchy/common'
import PropTypes from 'prop-types'

const ByuExploreUstream = ({ redirectToStream, tenant }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [videoData, setVideoData] = useState([])
  const { authorizationId } = useAppContext()

  useEffect(() => {
    const fetchAppData = async () => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'ai_app_new'
        }
        trackEvent('byu_video_carousel', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosGet('/videos?section=banner', {})
      )
      if (response?.data) {
        setVideoData(response.data.slice(0, 2))
      }
      setIsLoading(false)
    }
    fetchAppData()
  }, [authorizationId])

  return (
    <div className={`byu-video-container-explore ${tenant}`}>
      {!isLoading && videoData.length > 0 && (
        <div className='byu-video-flex-column'>
          {videoData.map((video, index) => (
            <div
              key={video.id + index}
              className='byu-video-slide-explore-widget'
              onClick={() => redirectToStream(video)}
            >
              <div className='byu-video-content-explore-widget'>
                <img
                  src={
                    video.cover_image
                      ? video.cover_image
                      : video.image
                        ? video.image
                        : '/images/byu/videos/videoFallbackPortrait.png'
                  }
                  alt='byu-video-utainment'
                  className='byu-video-thumbnail-explore-widget'
                  onError={(e) =>
                    (e.target.src =
                      '/images/byu/videos/videoFallbackPortrait.png')
                  }
                />
              </div>
              <div className='byu-video-ustream-desc-wrapper'>
                <div className='byu-video-title-explore-widget'>
                  {video?.title}
                </div>
                <div className='byu-video-views-explore-widget'>
                  {video?.description}
                </div>
                <div className='byu-video-stream-brand-tag-explore-widget'>
                  {video?.author_name?.toLowerCase() === 'maxstream' && (
                    <img
                      width={'16px'}
                      src='/images/byu/videos/maxstreamIcon.png'
                      alt='brand-icon'
                      className='byu-video-stream-tag-icon'
                    />
                  )}
                  <p>{video?.author_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

ByuExploreUstream.propTypes = {
  redirectToStream: PropTypes.func,
  tenant: PropTypes.string
}

export default ByuExploreUstream
