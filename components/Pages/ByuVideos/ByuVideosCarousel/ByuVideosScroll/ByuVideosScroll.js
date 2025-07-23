import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../../context/AppContext'
import { axiosGet } from '../../../../../utils/axios'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import common from '@kelchy/common'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../../useTenantConfig'

const ByuVideosScroll = ({ sectionData, showTitle = true, tenant }) => {
  const [scrollData, setScrollData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const tenantLayout = useTenantConfig(tenant)

  useEffect(() => {
    const fetchAppData = async (sectionData) => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'ai_app_new'
        }
        trackEvent('byu_video_scroll', properties)
      }
      const slug = `/videos?section=${sectionData?.section_identifier}`
      const { data: response } = await common.awaitWrap(axiosGet(slug, {}))
      if (response?.data) {
        setScrollData(response.data)
      }
      setIsLoading(false)
    }
    if (sectionData?.section_identifier) {
      fetchAppData(sectionData)
    }
    // eslint-disable-next-line
  }, [authorizationId, sectionData?.section_identifier])

  const navigateToVideoPage = (videoData) => {
    navigate('/byu/video/stream', { state: videoData })
  }

  return (
    !isLoading &&
    scrollData?.length > 0 && (
      <div className='byu-videos-scroll-container'>
        {showTitle && sectionData?.title && (
          <h2 className='byu-videos-home-section-title'>
            {t(sectionData.title)}
          </h2>
        )}
        <div className='byu-videos-scroll-wrap'>
          {scrollData.map((video, index) => (
            <div
              className='byu-videos-home-section-scroll-item'
              key={index}
              onClick={() => navigateToVideoPage(video)}
            >
              {sectionData?.is_highlight && (
                <div
                  className='byu-videos-home-section-item-count'
                  style={{
                    color: tenantLayout?.byu?.common?.secondaryGrayTextColor
                  }}
                >
                  {index + 1}
                </div>
              )}
              <img
                src={
                  video.cover_image
                    ? video.cover_image
                    : video.image
                      ? video.image
                      : '/images/byu/videos/videoFallbackPortrait.png'
                }
                alt='byu-video-scroll-utainment'
                className='byu-video-scroll-thumbnail'
                onError={(e) => {
                  e.target.src = '/images/byu/videos/videoFallbackPortrait.png'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  )
}

ByuVideosScroll.propTypes = {
  sectionData: PropTypes.object.isRequired,
  navigateToStreamPage: PropTypes.func,
  showTitle: PropTypes.bool,
  tenant: PropTypes.string
}

export default ByuVideosScroll
