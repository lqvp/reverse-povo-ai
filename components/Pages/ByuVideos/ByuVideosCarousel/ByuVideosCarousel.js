import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './ByuVideosCarousel.css'
import GeneralIcons from '../../../../static/GeneralIcons'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import common from '@kelchy/common'
import PropTypes from 'prop-types'

const ByuVideosCarousel = ({ redirectToStream, tenant }) => {
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
        setVideoData(response.data)
      }
      setIsLoading(false)
    }
    fetchAppData()
  }, [authorizationId])

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 1,
    speed: 500,
    dots: true,
    arrows: false
  }

  return (
    <div className={`byu-video-container ${tenant}`}>
      <Slider className='byu-video-carousel' {...settings}>
        {!isLoading &&
          videoData.length > 0 &&
          videoData.map((video, index) => (
            <div
              key={video.id + index}
              className='byu-video-slide'
              onClick={() => redirectToStream(video)}
            >
              <div className='byu-video-content'>
                <img
                  src={
                    video.cover_image
                      ? video.cover_image
                      : video.image
                        ? video.image
                        : '/images/byu/videos/videoFallbackPortrait.png'
                  }
                  alt='byu-video-utainment'
                  className='byu-video-thumbnail'
                  onError={(e) =>
                    (e.target.src = '/images/byu/videos/videoFallback.png')
                  }
                />
                <div className='byu-video-overlay'>
                  <div className='byu-video-watch-btn-wrapper'>
                    <div className='byu-video-watch-btn'>
                      <span className='byu-video-play-icon'>
                        <GeneralIcons
                          kind='playByu'
                          width={20}
                          height={20}
                          color='#1F2D3D'
                        />
                      </span>
                      Watch now
                    </div>
                  </div>
                  <div className='byu-video-tags'>
                    {video.year && (
                      <>
                        <span className='byu-video-tag year'>{video.year}</span>
                      </>
                    )}
                    {video.genre && (
                      <>
                        <span className='byu-video-tag dots'>•</span>
                        <span className='byu-video-tag genre'>
                          {video.genre}
                        </span>
                      </>
                    )}
                    {video.age_rating && (
                      <>
                        <span className='byu-video-tag dots'>•</span>
                        <span className='byu-video-tag rating'>
                          {video.age_rating}+
                        </span>
                      </>
                    )}
                    {video.category && (
                      <>
                        <span className='byu-video-tag dots'>•</span>
                        <span className='byu-video-tag category'>
                          {video.category}
                        </span>
                      </>
                    )}
                    {video.type && (
                      <>
                        <span className='byu-video-tag dots'>•</span>
                        <span className='byu-video-tag type'>{video.type}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  )
}

ByuVideosCarousel.propTypes = {
  redirectToStream: PropTypes.func,
  tenant: PropTypes.string
}

export default ByuVideosCarousel
