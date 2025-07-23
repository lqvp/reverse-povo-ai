import React, { useEffect, useState } from 'react'
import ByuVideosCarousel from './ByuVideosCarousel/ByuVideosCarousel'
import ByuVideosScroll from './ByuVideosCarousel/ByuVideosScroll/ByuVideosScroll'
import { useTranslation } from 'react-i18next'
import BackButton from '../../../static/BackButton'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import common from '@kelchy/common'
import { axiosGet } from '../../../utils/axios'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useAppContext } from '../../../context/AppContext'
import { getConfigForHostname } from '../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../useTenantConfig'
import ByuExploreUstream from './ByuExploreUstream/ByuExploreUstream'

const { tenant } = getConfigForHostname()

const ByuVideosHome = ({ redirectToStream, isExplore }) => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [byuVideoSections, setByuVideoSections] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { authorizationId } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)

  useEffect(() => {
    const fetchAppSections = async () => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'byu_video'
        }
        trackEvent('byu_video_sections_fetch', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosGet('/video-sections', {})
      )
      if (response?.data) {
        setByuVideoSections(response.data)
      }
      setIsLoading(false)
    }
    fetchAppSections()
  }, [authorizationId])

  const handleViewAllClick = () => {
    navigate('/byu/video/all')
  }

  if (isExplore) {
    return (
      <div className='byu-videos-home-explore-wrap'>
        <ByuExploreUstream
          redirectToStream={redirectToStream}
          tenant={tenant}
        />
      </div>
    )
  }

  return (
    !isLoading &&
    byuVideoSections.length > 0 &&
    !isExplore && (
      <div className='byu-videos-home-wrap'>
        <div
          className={`byu-videos-home-header-wrap ${tenant}`}
          style={{
            ...(tenantLayout?.byu?.common?.showBGGradient && {
              background: tenantLayout?.byu?.common?.bgGradient
            })
          }}
        >
          <div className='byu-video-list-header'>
            <BackButton color='#FFF' textVisible={false} />
            <div className='byu-video-list-title'>{t('byu.video')}</div>
          </div>
          <ByuVideosCarousel
            redirectToStream={redirectToStream}
            tenant={tenant}
          />
        </div>
        <div className='byu-videos-home-section-wrap'>
          {byuVideoSections.map((section, index) =>
            section.section_identifier !== 'maybeLikedSection' ? (
              <div key={index} className='byu-videos-home-section'>
                <ByuVideosScroll
                  sectionData={section}
                  redirectToStream={redirectToStream}
                  tenant={tenant}
                />
              </div>
            ) : null
          )}
        </div>
        <div className='byu-videos-home-section-btn'>
          <div
            className='byu-videos-home-section-btn-dap'
            style={{
              background: tenantLayout?.byu?.common?.ctaColor
            }}
            onClick={handleViewAllClick}
          >
            {t('byu.viewAll')}
          </div>
        </div>
      </div>
    )
  )
}

ByuVideosHome.propTypes = {
  redirectToStream: PropTypes.func,
  isExplore: PropTypes.bool
}

export default ByuVideosHome
