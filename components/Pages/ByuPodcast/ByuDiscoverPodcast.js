import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import common from '@kelchy/common'
import { axiosGet } from '../../../utils/axios'
import PropTypes from 'prop-types'

const ByuDiscoverPodcast = ({ onPodcastSelect }) => {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)
  const [podcastData, setPodcastData] = useState([])
  const { authorizationId } = useAppContext()

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
        axiosGet('/podcasts', {})
      )
      if (response?.data) {
        setPodcastData(response.data)
      }
      setIsLoading(false)
    }
    fetchAppData()
  }, [authorizationId])

  return (
    <div className='byu-podcast-dp-section-wrap'>
      <div className='byu-podcast-dp-title'>{t('byu.discoverPodcast')}</div>
      <div className='byu-podcast-dp-card-wrap'>
        {podcastData &&
          !isLoading &&
          podcastData?.map((podcast, index) => (
            <div
              key={index}
              className='byu-podcast-dp-card'
              onClick={() => onPodcastSelect(podcast)}
            >
              <div className='byu-podcast-dp-img'>
                <img
                  className='byu-podcast-stream-image-dp'
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
              <div className='byu-podcast-dp-card-desc'>
                <div className='byu-podcast-dp-card-title'>{podcast.title}</div>
                <div className='byu-podcast-dp-card-artist'>
                  {podcast.artist}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

ByuDiscoverPodcast.propTypes = {
  onPodcastSelect: PropTypes.func
}

export default ByuDiscoverPodcast
