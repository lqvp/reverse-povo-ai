import React from 'react'
import ByuPodcastHome from './ByuPodcastHome'
import BackButton from '../../../static/BackButton'
import { useTranslation } from 'react-i18next'
import './index.css'
import { getConfigForHostname } from '../../../helpers/tenantHelper'
import PropTypes from 'prop-types'

const { tenant } = getConfigForHostname()

const ByuPodcast = ({ isExplore }) => {
  const { t } = useTranslation('common')

  return (
    <div
      className={`byu-podcast-list-container ${isExplore ? 'explore-widget' : ''}`}
    >
      {!isExplore && (
        <div
          className={`byu-podcast-home-header-wrap ${tenant} ${isExplore ? 'explore-widget' : ''}`}
        >
          <div
            className={`byu-podcast-list-header ${isExplore ? 'explore-widget' : ''}`}
          >
            <BackButton color='#FFF' textVisible={false} spacing='0' />
            <div
              className={`byu-podcast-list-title ${isExplore ? 'explore-widget' : ''}`}
            >
              {t('byu.podcast')}
            </div>
          </div>
        </div>
      )}
      <div
        className={`byu-podcast-home-pre-wrapper ${isExplore ? 'explore-widget' : ''}`}
      >
        <ByuPodcastHome tenant={tenant} isExplore={isExplore} />
      </div>
    </div>
  )
}

ByuPodcast.propTypes = {
  isExplore: PropTypes.bool
}

export default ByuPodcast
