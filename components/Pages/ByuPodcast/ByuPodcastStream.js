import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, SwipeableDrawer } from '@mui/material'
import { useTenantConfig } from '../../../useTenantConfig'
import { formatTimeToHHMMSSByu } from '../../../helpers/helperFunctions'
import AIStylistIcon from '../../../static/AIStylistIcon'
import ByuPodcastPlay from './ByuPodcastPlay'

const ByuPodcastStream = ({ tenant, selectedPodcast, podcastToggle, open }) => {
  const [episodeStream, setEpisodeStream] = useState(0)
  const tenantLayout = useTenantConfig(tenant)

  const goForwardInStream = () => {
    if (episodeStream < selectedPodcast.episodes.length - 1) {
      setEpisodeStream(episodeStream + 1)
    }
  }

  const goBackwardInStream = () => {
    if (episodeStream > 0) {
      setEpisodeStream(episodeStream - 1)
    }
  }

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={() => podcastToggle(null)}
      className='byu-podcast-swipeable-drawer-wrapper'
      onOpen={() => podcastToggle(selectedPodcast)}
      ModalProps={{
        keepMounted: true
      }}
      disableBackdropTransition
      disableDiscovery
      PaperProps={{
        sx: {
          height: '85vh',
          width: '100%',
          overflow: 'hidden'
        }
      }}
    >
      <Box
        className='byu-podcast-sd-scrollable'
        sx={{
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          px: 2
        }}
      >
        <div className='byu-podcast-sd-wrapper'>
          <div
            className='byu-podcast-sd-minimizer-wrap'
            onClick={() => podcastToggle(null)}
          >
            <div className='byu-podcast-sd-minimizer'></div>
          </div>
          <div>
            <div className='byu-podcast-sd-stream-detail'>
              <img
                className='byu-podcast-sd-stream-image'
                alt='stream-image'
                src={selectedPodcast?.media?.cover_img}
              />
              <div className='byu-podcast-sd-text-desc'>
                <div className='byu-podcast-sd-title'>
                  {selectedPodcast?.episodes[episodeStream]?.title}
                </div>
                <div className='byu-podcast-sd-desc'>
                  {selectedPodcast?.title}
                </div>
              </div>
              <div className='byu-podcast-sd-player'>
                <ByuPodcastPlay
                  mediaSrc={
                    selectedPodcast?.episodes[episodeStream]?.streaming_url
                  }
                  onPrevClick={goBackwardInStream}
                  onNextClick={goForwardInStream}
                />
              </div>
            </div>
            <div className='byu-podcast-sd-episode-title-header'>Episodes</div>
            <div className='byu-podcast-sd-episodes-wrap'>
              {selectedPodcast?.episodes?.map((episode, index) => (
                <div
                  key={index}
                  className={`byu-podcast-sd-episode ${episodeStream === index ? 'active' : ''}`}
                  onClick={() => setEpisodeStream(index)}
                >
                  <div
                    className='byu-podcast-tp-card-play-btn-stream'
                    style={{
                      background: tenantLayout?.byu?.common?.ctaSecondaryColor
                    }}
                  >
                    <AIStylistIcon width={20} height={20} kind={'play-byu'} />
                  </div>
                  <div className='byu-podcast-sd-episode-details'>
                    <div className='byu-podcast-sd-episode-title'>
                      {episode.title}
                    </div>
                    <div className='byu-podcast-sd-episode-duration'>
                      {formatTimeToHHMMSSByu(episode.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>
    </SwipeableDrawer>
  )
}

ByuPodcastStream.propTypes = {
  tenant: PropTypes.string,
  selectedPodcast: PropTypes.object,
  podcastToggle: PropTypes.func,
  open: PropTypes.bool
}

export default ByuPodcastStream
