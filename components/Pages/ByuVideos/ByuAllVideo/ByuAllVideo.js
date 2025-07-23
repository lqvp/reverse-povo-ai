import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../../../static/BackButton'
import { useTranslation } from 'react-i18next'
import './ByuAllVideo.css'
import PropTypes from 'prop-types'
import common from '@kelchy/common'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import { toCamelCase } from '../../../../common/constants'
import { keyframes } from '@emotion/react'
import { Box } from '@mui/system'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`

const { tenant } = getConfigForHostname()

const ShimmerCard = () => {
  return (
    <Box
      sx={{
        width: '186px',
        height: '250px',
        borderRadius: '8px',
        overflow: 'hidden',
        background:
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200px 100%',
        animation: `${shimmer} 1.5s infinite linear`
      }}
    />
  )
}

const Card = memo(({ imageUrl, title, videoData }) => {
  const navigate = useNavigate()
  const navigateToVideoPage = useCallback(() => {
    navigate('/byu/video/stream', { state: videoData })
  }, [navigate, videoData])

  return (
    <div className='byu-all-videos-card' onClick={navigateToVideoPage}>
      <img
        src={imageUrl || '/images/byu/videos/videoFallbackPortrait.png'}
        alt={title}
        className='byu-all-videos-card-image'
        onError={(e) =>
          (e.target.src = '/images/byu/videos/videoFallbackPortrait.png')
        }
      />
    </div>
  )
})

Card.displayName = 'Card'

Card.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  videoData: PropTypes.object.isRequired
}

const PillSelector = memo(({ categories, selectedPill, setSelectedPill }) => {
  return (
    <div className='byu-video-lp-category-pill-wrapper'>
      {categories.map((pillItem, index) => (
        <div
          className={`byu-video-lp-category-pill ${tenant} ${selectedPill === pillItem.title ? 'active' : ''}`}
          key={index}
          onClick={() => setSelectedPill(pillItem.title)}
        >
          {pillItem.title}
        </div>
      ))}
    </div>
  )
})

PillSelector.displayName = 'PillSelector'

PillSelector.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedPill: PropTypes.string,
  setSelectedPill: PropTypes.func
}

const ByuAllVideo = () => {
  const { t } = useTranslation('common')
  const [moviesGroupedCategory, setMoviesGroupedCategory] = useState([])
  const [videosResponse, setVideosResponse] = useState(null)
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { authorizationId } = useAppContext()
  const [selectedPill, setSelectedPill] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      if (authorizationId) {
        trackEvent('byu_video_carousel', {
          external_id: authorizationId,
          app_name: 'ai_app_new'
        })
      }
      const { data: response } = await common.awaitWrap(
        axiosGet('/video-tags', {})
      )
      if (response?.data) {
        setMoviesGroupedCategory(response.data)
        setSelectedPill(response.data[0]?.title || null)
      }
      setIsLoading(false)
    }
    fetchCategories()
  }, [authorizationId])

  const fetchVideos = useCallback(
    async (pageNum = 1, reset = false) => {
      if (!selectedPill) return
      setIsLoading(true)
      const slug = `/videos?tag=${toCamelCase(selectedPill)}&page=${pageNum}`
      const { data: response } = await common.awaitWrap(axiosGet(slug, {}))
      if (response?.data) {
        setVideosResponse(response)
        setVideos((prevVideos) =>
          reset ? response.data : [...prevVideos, ...response.data]
        )
      }
      setIsLoading(false)
    },
    [selectedPill]
  )

  useEffect(() => {
    if (selectedPill) {
      fetchVideos(1, true)
    }
  }, [selectedPill, fetchVideos])

  const loadMoreVideos = useCallback(() => {
    if (videosResponse?.total_pages > videosResponse?.current_page) {
      fetchVideos(videosResponse.current_page + 1)
    }
  }, [videosResponse, fetchVideos])

  // Memoize the videos list so only new videos trigger an update
  const memoizedVideos = useMemo(() => videos, [videos])

  return (
    <div className='byu-videos-home-wrap'>
      <div className={`byu-video-list-header ${tenant}`}>
        <BackButton color='#FFF' textVisible={false} spacing='0' />
        <div className='byu-all-video-list-title'>{t('byu.viewAll')}</div>
      </div>

      <PillSelector
        categories={moviesGroupedCategory}
        selectedPill={selectedPill}
        setSelectedPill={setSelectedPill}
      />
      {memoizedVideos.length > 0 && (
        <div className='byu-all-videos-container'>
          <div className='byu-all-videos-grid'>
            {memoizedVideos.map((video) => (
              <Card
                key={video?._id}
                imageUrl={video?.cover_image || video.image}
                title={video.title}
                videoData={video}
              />
            ))}
          </div>
        </div>
      )}
      <div className='byu-all-videos-container wrap'>
        {moviesGroupedCategory.length > 0 && (
          <>
            {isLoading ? (
              <>
                {Array.from({ length: 3 }, (_, index) => (
                  <ShimmerCard key={index} />
                ))}
              </>
            ) : (
              <>
                {videosResponse && (
                  <>
                    {videosResponse?.total_pages >
                      videosResponse?.current_page && (
                      <div className='byu-videos-home-section-btn'>
                        <div
                          className='byu-videos-home-section-btn-dap all-video'
                          onClick={loadMoreVideos}
                          disabled={isLoading}
                        >
                          {t('byu.loadMore')}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

ByuAllVideo.displayName = 'ByuAllVideo'

export default ByuAllVideo
