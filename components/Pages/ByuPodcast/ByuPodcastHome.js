import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ByuTopPodcast from './ByuTopPodcast'
import ByuDiscoverPodcast from './ByuDiscoverPodcast'
import ByuPodcastStream from './ByuPodcastStream'

const ByuPodcastHome = ({ tenant, isExplore }) => {
  const [openPodcast, setOpenPodcast] = useState(false)
  const [selectedPodcast, setSelectedPodcast] = useState(null)

  const handleTogglePodcastDrawer = (podcastData) => {
    setSelectedPodcast(podcastData)
    setOpenPodcast((prevState) => !prevState)
  }

  return (
    <div className='byu-podcast-home-wrapper'>
      <ByuTopPodcast
        tenant={tenant}
        onPodcastSelect={handleTogglePodcastDrawer}
        isExplore={isExplore}
      />
      {!isExplore && (
        <ByuDiscoverPodcast
          tenant={tenant}
          onPodcastSelect={handleTogglePodcastDrawer}
        />
      )}
      {selectedPodcast && openPodcast && (
        <div className='byu-podcast-home-drawer-wrap'>
          <ByuPodcastStream
            tenant={tenant}
            selectedPodcast={selectedPodcast}
            podcastToggle={handleTogglePodcastDrawer}
            open={openPodcast}
          />
        </div>
      )}
    </div>
  )
}

ByuPodcastHome.propTypes = {
  tenant: PropTypes.string.isRequired,
  isExplore: PropTypes.bool
}

export default ByuPodcastHome
