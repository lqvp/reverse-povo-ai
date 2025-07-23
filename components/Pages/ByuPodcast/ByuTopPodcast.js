import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import GeneralIcons from '../../../static/GeneralIcons'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import common from '@kelchy/common'
import { axiosGet } from '../../../utils/axios'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../../useTenantConfig'

const ByuTopPodcast = ({ tenant, onPodcastSelect, isExplore }) => {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)
  const [podcastData, setPodcastData] = useState([])
  const { authorizationId } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)

  useEffect(() => {
    const fetchAppData = async () => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'byu_podcast'
        }
        trackEvent('byu_podcast_carousel', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosGet(`/podcasts?section=top`, {})
      )
      if (response?.data) {
        setPodcastData(response.data)
      }
      setIsLoading(false)
    }
    fetchAppData()
  }, [authorizationId])

  return (
    <div className='byu-podcast-tp-section-wrap'>
      {!isExplore && (
        <div className='byu-podcast-tp-title'>{t('byu.topPodcast')}</div>
      )}
      <div
        className={`byu-podcast-tp-card-wrap ${isExplore ? 'explore-widget' : ''}`}
      >
        {podcastData &&
          !isLoading &&
          podcastData.map((podcast, index) => (
            <div
              key={index}
              className='byu-podcast-tp-card'
              onClick={() => onPodcastSelect(podcast)}
            >
              <div className='byu-podcast-tp-img'>
                <img
                  className='byu-podcast-stream-image'
                  alt='stream-image'
                  src={
                    podcast?.media?.cover_img ||
                    '/images/byu/videos/videoFallback.png'
                  }
                  onError={(e) =>
                    (e.target.src = '/images/byu/videos/videoFallback.png')
                  }
                />
              </div>
              <div className='byu-podcast-tp-card-desc'>
                <div className='byu-podcast-tp-card-title'>
                  {podcast?.title}
                </div>
                <div className='byu-podcast-tp-card-artist'>
                  {podcast?.artist}
                </div>
              </div>
              <div
                className='byu-podcast-tp-card-play-btn'
                style={{
                  background: tenantLayout?.byu?.common?.ctaSecondaryColor
                }}
              >
                <GeneralIcons
                  kind='play-podcast'
                  width={14}
                  height={16}
                  color='#FFF'
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

ByuTopPodcast.propTypes = {
  tenant: PropTypes.string,
  onPodcastSelect: PropTypes.func,
  isExplore: PropTypes.bool
}

export default ByuTopPodcast
