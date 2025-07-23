import React, { useState } from 'react'
import BackButton from '../../../../static/BackButton'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import AIStylistIcon from '../../../../static/AIStylistIcon'
import ByuVideosScroll from '../ByuVideosCarousel/ByuVideosScroll/ByuVideosScroll'
import './ByuVideoStream.css'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import DataUsageInfoModal from '../DataUsageInfoModal'
import { translatedJsonData } from '../../../../i18nextConfig'
import { getYouTubeVideoIdFromParam } from '../../../../helpers/helperFunctions'

const byuYouMayLikeSection = {
  api_version: 'v2',
  is_active: true,
  is_banner: false,
  is_highlight: false,
  is_maybe_liked: true,
  name: translatedJsonData.byu.maybeLikedSection,
  orientation: 'Landscape',
  title: translatedJsonData.byu.maybeLikedSection,
  tenant: 'byu',
  section_identifier: 'maybeLikedSection',
  order: 0
}

const { tenant } = getConfigForHostname()

const BYU_DEEPLINK_URI = 'https://www.byu.id/v2/deeplink'

const ByuVideoStream = () => {
  const { t } = useTranslation('common')
  const location = useLocation()
  const videoData =
    location.state && typeof location.state === 'object' ? location.state : {}
  const [showDescFull, setShowDescFull] = useState(false)
  const [showAllEpisodes, setShowAllEpisodes] = useState(false)
  const tenantLayout = useTenantConfig(tenant)
  const [openDataUsageInfoModal, setOpenDataUsageInfoModal] = useState(false)

  const redirectToStream = (videoData) => {
    const shouldShowDrawer =
      localStorage.getItem('ustreamDataConsumptionInfo') !== 'true'
    if (shouldShowDrawer) {
      setOpenDataUsageInfoModal(true)
    } else {
      redirectStream(videoData)
    }
  }

  const redirectStream = (videoData) => {
    const url = videoData?.url
    if (typeof url !== 'string') return
    const isYouTube = url.includes('youtube')
    const youtubeVideoId = isYouTube ? getYouTubeVideoIdFromParam(url) : null
    if (isYouTube && !youtubeVideoId) return
    const query = isYouTube
      ? `type=youtube&videoid=${youtubeVideoId}&url=${url}`
      : `type=video&url=${url}`
    window.location.href = `${BYU_DEEPLINK_URI}?${query}`
  }

  return (
    <>
      {Object.keys(videoData).length > 0 && (
        <div className='byu-videos-home-wrap'>
          <div className='byu-videos-home-header-wrap all-video'>
            <div className='byu-video-list-header'>
              <BackButton color='#FFF' textVisible={false} spacing='0' />
              <div className='byu-all-video-list-title'>
                {videoData?.title || t('byu.video')}
              </div>
            </div>
          </div>
          <div className='byu-video-stream-wrap'>
            <img
              className='byu-video-stream-image'
              alt='stream-image'
              src={videoData.image || '/images/byu/videos/videoFallback.png'}
              onError={(e) =>
                (e.target.src = '/images/byu/videos/videoFallback.png')
              }
            />
            <div className='byu-video-stream-descripted-wrap'>
              <h1>{videoData?.title || 'No Title Available'}</h1>
              <div className='byu-video-tags stream'>
                {videoData?.year && (
                  <span className='byu-video-tag year'>{videoData.year}</span>
                )}
                {videoData?.genre && (
                  <>
                    <span className='byu-video-tag dots'>•</span>
                    <span className='byu-video-tag genre'>
                      {videoData.genre}
                    </span>
                  </>
                )}
                {videoData?.rating && (
                  <>
                    <span className='byu-video-tag dots'>•</span>
                    <span className='byu-video-tag rating'>
                      {videoData.age_rating}+
                    </span>
                  </>
                )}
                {videoData?.category && (
                  <>
                    <span className='byu-video-tag dots'>•</span>
                    <span className='byu-video-tag category'>
                      {videoData.category}
                    </span>
                  </>
                )}
                {videoData?.type && (
                  <>
                    <span className='byu-video-tag dots'>•</span>
                    <span className='byu-video-tag type'>{videoData.type}</span>
                  </>
                )}
              </div>
              <div className='byu-video-stream-brand-tag'>
                <img
                  width={'16px'}
                  src='/images/byu/videos/maxstreamIcon.png'
                  alt='brand-icon'
                  className='byu-video-stream-tag-icon'
                />
                <p>{t('byu.maxstreamTag')}</p>
              </div>
              <div className='byu-video-stream-feat-wrap'>
                <div
                  className='byu-video-stream-play-now-btn'
                  style={{
                    background: tenantLayout?.byu?.common?.ctaColor
                  }}
                >
                  <div className='byu-video-stream-play-now-btn-icon'>
                    <AIStylistIcon width={20} height={20} kind={'play-byu'} />
                  </div>
                  <div
                    className='byu-video-stream-play-now-btn-txt'
                    onClick={() => redirectToStream(videoData)}
                  >
                    {t('byu.playNow')}
                  </div>
                </div>
                <div className='byu-video-stream-desc-wrap'>
                  <div
                    className={`byu-video-stream-desc ${showDescFull ? 'full' : ''}`}
                    data-color-mode='light'
                  >
                    {videoData?.description || 'No description available'}
                  </div>
                  <div
                    className='byu-video-stream-desc-more-btn'
                    onClick={() => setShowDescFull(!showDescFull)}
                  >
                    <div
                      className='byu-video-stream-desc-more-btn-txt'
                      style={{
                        color: tenantLayout?.byu?.common?.ctaColor
                      }}
                    >
                      {showDescFull ? t('byu.showLess') : t('byu.showMore')}
                    </div>
                    <div className='byu-video-stream-desc-more-btn-icon'>
                      {showDescFull ? (
                        <AIStylistIcon
                          width={20}
                          height={20}
                          kind={'up-arrow'}
                          color={tenantLayout?.byu?.common?.ctaColor}
                        />
                      ) : (
                        <AIStylistIcon
                          width={20}
                          height={20}
                          kind={'down-arrow'}
                          color={tenantLayout?.byu?.common?.ctaColor}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`byu-video-stream-episodes ${!videoData?.episodes || videoData.episodes.length === 0 ? 'no-episodes' : ''}`}
                >
                  {Array.isArray(videoData?.episodes) &&
                    videoData.episodes.length > 0 && (
                      <>
                        <h2>{t('byu.episodes')}</h2>
                        <div className='byu-video-stream-episodes-list'>
                          {(showAllEpisodes
                            ? videoData.episodes
                            : videoData.episodes.slice(0, 3)
                          ).map((episode, index) => (
                            <div
                              key={index}
                              className='byu-video-stream-episode-wrap'
                            >
                              <div className='byu-video-stream-episode-image-wrap'>
                                <img
                                  src={episode?.image}
                                  alt='episode-image'
                                  className='byu-video-stream-episode-image'
                                />
                                <div className='byu-video-stream-episode-play-image-wrap'>
                                  <AIStylistIcon
                                    width={20}
                                    height={20}
                                    kind={'play-byu'}
                                  />
                                </div>
                              </div>
                              <div className='byu-video-stream-episode-desc'>
                                <h3>{episode?.title || 'No Title'}</h3>
                                <p>{episode?.duration || 'Unknown Duration'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {videoData.episodes.length > 3 && (
                          <div
                            className='byu-video-stream-episodes-more-btn'
                            onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                          >
                            <div className='byu-video-stream-episodes-more-btn-txt'>
                              {showAllEpisodes
                                ? t('byu.showLess')
                                : t('byu.showMore')}
                            </div>
                            <div className='byu-video-stream-desc-more-btn-icon'>
                              {showAllEpisodes ? (
                                <AIStylistIcon
                                  width={20}
                                  height={20}
                                  kind={'up-arrow'}
                                />
                              ) : (
                                <AIStylistIcon
                                  width={20}
                                  height={20}
                                  kind={'down-arrow'}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                </div>
              </div>
              <div className='byu-video-stream-also-like'>
                <h2>{t(byuYouMayLikeSection?.title)}</h2>
                <div className='byu-video-stream-also-like-wrapper'>
                  <ByuVideosScroll
                    sectionData={byuYouMayLikeSection}
                    showTitle={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DataUsageInfoModal
        open={openDataUsageInfoModal}
        handleClose={() => setOpenDataUsageInfoModal(false)}
        handleConfirm={() => {
          redirectStream(videoData)
        }}
      />
    </>
  )
}

ByuVideoStream.propTypes = {
  redirectToStream: PropTypes.func
}

export default ByuVideoStream
