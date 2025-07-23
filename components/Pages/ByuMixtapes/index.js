import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'
import common from '@kelchy/common'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import './mixtapes.css'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { axiosGet, axiosPost } from '../../../utils/axios'
import Loader from '../../Loader/Loader'
import PropTypes from 'prop-types'
import { getWidgetBaseUrl } from '../../../helpers/helperFunctions'
import { getConfigForHostname } from '../../../helpers/tenantHelper'

const { environment } = getConfigForHostname()

const ByuMixtapes = ({ isExploreSublayout = false }) => {
  const howlRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [mixtapesData, setMixtapesData] = useState([])
  const [currentMixtapeData, setCurrentMixtapeData] = useState(null)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
  const [nextSongData, setNextSongData] = useState(null)
  const animationRef = useRef(null)
  const hasPreloadedNextSong = useRef(false)
  const nextSongDataRef = useRef(nextSongData)
  const { authorizationId } = useAppContext()

  useEffect(() => {
    const fetchMixtapesData = async () => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'byu_mixtapes'
        }
        trackEvent('byu_mixtapes_loaded', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosGet(`/mixtapes`, {})
      )
      if (response?.data) {
        setMixtapesData(response.data?.[0])
        const currentPlaylist = response.data?.[0]?.playlist?.[0]
        setCurrentMixtapeData({
          currentPlaylist: currentPlaylist?.playlist_side,
          song_name: currentPlaylist?.songs?.[0]?.song_name,
          song_id: currentPlaylist?.songs?.[0]?.song_id
        })
      }
      setIsLoading(false)
    }
    fetchMixtapesData()
  }, [authorizationId])

  useEffect(() => {
    if (!currentMixtapeData?.song_id) {
      return
    }
    const fetchSongsData = async () => {
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'byu_mixtapes'
        }
        trackEvent('byu_mixtapes_played_song', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosPost(
          `/mixtapes-songs`,
          { songsId: currentMixtapeData?.song_id },
          {}
        )
      )
      if (response?.data) {
        setCurrentMixtapeData((prev) => ({
          ...prev,
          streaming_url: response.data?.streamingUrl
        }))
      }
      setIsLoading(false)
    }
    fetchSongsData()
  }, [currentMixtapeData?.song_id, authorizationId])

  const updateProgress = useCallback(() => {
    const preloadNextSong = async () => {
      const currentSide = currentMixtapeData?.currentPlaylist
      const currentId = currentMixtapeData?.song_id

      const sidePlaylist = mixtapesData.playlist.find(
        (p) => p.playlist_side === currentSide
      )
      const songs = sidePlaylist?.songs || []
      const currentIndex = songs.findIndex((s) => s.song_id === currentId)
      const nextSong = songs[currentIndex + 1]

      if (!nextSong) return

      const { data: response } = await common.awaitWrap(
        axiosPost(`/mixtapes-songs`, { songsId: nextSong.song_id }, {})
      )

      if (response?.data?.streamingUrl) {
        setNextSongData({
          ...nextSong,
          streaming_url: response.data.streamingUrl,
          currentPlaylist: currentSide
        })
        nextSongDataRef.current = {
          ...nextSong,
          streaming_url: response.data.streamingUrl,
          currentPlaylist: currentSide
        }
      }
    }
    if (howlRef.current && howlRef.current.playing()) {
      const seek = howlRef.current.seek()
      const duration = howlRef.current.duration()
      const remainingTime = duration - seek
      setProgress((seek / duration) * 100)

      // Update Media Session Position
      if (
        'mediaSession' in navigator &&
        'setPositionState' in navigator.mediaSession
      ) {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: 1.0,
          position: seek
        })
      }

      // Preload next song if 15s left and not already fetched
      if (remainingTime <= 15 && !hasPreloadedNextSong.current) {
        hasPreloadedNextSong.current = true
        preloadNextSong()
      }

      animationRef.current = requestAnimationFrame(updateProgress)
    }
  }, [
    currentMixtapeData?.currentPlaylist,
    currentMixtapeData?.song_id,
    mixtapesData.playlist
  ])

  useEffect(() => {
    nextSongDataRef.current = nextSongData
  }, [nextSongData])

  // eslint-disable-next-line
  const handlePlayPause = async () => {
    const streamURL = currentMixtapeData.streaming_url

    if (!streamURL) {
      return
    }

    if (Howler.ctx?.state === 'suspended') {
      await Howler.ctx.resume()
    }

    const rawSrc = howlRef.current?._src
    const currentSrc = Array.isArray(rawSrc) ? rawSrc[0] : rawSrc
    const isDifferentURL = currentSrc !== streamURL

    // Recreate Howl if new song or no instance
    if (!howlRef.current || isDifferentURL) {
      if (howlRef.current) {
        howlRef.current.unload()
      }

      howlRef.current = new Howl({
        src: [streamURL],
        html5: true,
        preload: true,
        onend: () => {
          cancelAnimationFrame(animationRef.current)

          const next = nextSongDataRef.current

          if (next?.streaming_url) {
            setCurrentMixtapeData({
              currentPlaylist: next.currentPlaylist,
              song_name: next.song_name,
              song_id: next.song_id,
              streaming_url: next.streaming_url
            })
            setNextSongData(null)
            setShouldAutoPlay(true)
          } else {
            setIsPlaying(false)
            setProgress(0)
          }
        }
      })

      howlRef.current.on('play', () => {
        hasPreloadedNextSong.current = false
        setIsPlaying(true)
        updateProgress()

        // Media Session metadata setup
        if ('mediaSession' in navigator) {
          const metadata = new window.MediaMetadata({
            title: currentMixtapeData?.song_name || 'Unknown',
            artist: 'Diskoria',
            album: 'Kopi dan Senja',
            artwork: [
              {
                src: '/images/byu/mixtapes/mixtape-cassette.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          })
          navigator.mediaSession.metadata = metadata

          navigator.mediaSession.setActionHandler('play', () => {
            howlRef.current?.play()
          })
          navigator.mediaSession.setActionHandler('pause', () => {
            howlRef.current?.pause()
            setIsPlaying(false)
            cancelAnimationFrame(animationRef.current)
          })
        }
      })

      howlRef.current.on('loaderror', () => {
        setIsPlaying(false)
      })
    }

    const sound = howlRef.current

    if (sound.playing()) {
      sound.pause()
      setIsPlaying(false)
      cancelAnimationFrame(animationRef.current)
    } else {
      sound.play()
    }
  }

  const changePlaylistSide = (side) => {
    if (!mixtapesData?.playlist) return

    const selectedPlaylist = mixtapesData.playlist.find(
      (p) => p.playlist_side === side
    )

    if (!selectedPlaylist) return

    const firstSong = selectedPlaylist?.songs?.[0]
    if (!firstSong) return

    // Only change if song ID is different (prevents unnecessary updates)
    if (firstSong.song_id !== currentMixtapeData?.song_id) {
      setCurrentMixtapeData({
        currentPlaylist: selectedPlaylist.playlist_side,
        song_name: firstSong.song_name,
        song_id: firstSong.song_id
      })
      // Stop current audio
      if (howlRef.current) {
        howlRef.current.unload()
        howlRef.current = null
      }

      setIsPlaying(false)
      cancelAnimationFrame(animationRef.current)
      setShouldAutoPlay(true) // Set flag to trigger auto-play later
    }
  }
  useEffect(() => {
    if (shouldAutoPlay && currentMixtapeData?.streaming_url) {
      handlePlayPause()
      setShouldAutoPlay(false) // Reset the flag
    }
  }, [shouldAutoPlay, currentMixtapeData?.streaming_url, handlePlayPause])

  return (
    <div
      className={`cassette-container ${isExploreSublayout ? 'sublayout' : ''}`}
    >
      <div className='cassette-image-wrapper'>
        <img
          src={`${getWidgetBaseUrl(environment)}/images/byu/mixtapes/mixtape-cassette.png`}
          alt='Cassette Tape'
          className='cassette-image'
        />
        <div className='cassette-label'></div>
      </div>

      <div className='track-info-wrapper'>
        <div className={`track-info ${isExploreSublayout ? 'sublayout' : ''}`}>
          <span>{currentMixtapeData?.song_name}</span>
          <button className='play-button' onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon className='song-icon' />
            ) : (
              <PlayArrowIcon className='song-icon' />
            )}
          </button>
        </div>
        <div className='mixtape-progress-bar'>
          <div
            className='mixtape-progress-fill'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {isLoading && <Loader />}
      {mixtapesData.playlist && mixtapesData.playlist.length > 0 && (
        <div
          className={`side-wrapper ${isExploreSublayout ? 'sublayout' : ''}`}
        >
          {mixtapesData.playlist.map((playlist, index) => (
            <div
              key={index}
              className='side-wrapper-card'
              onClick={() => changePlaylistSide(playlist.playlist_side)}
            >
              <div
                className={`side-label cassette-side ${playlist.playlist_side === currentMixtapeData?.currentPlaylist ? 'active-side' : ''}`}
              >
                <div
                  className={`side-label-wrapper-list ${isExploreSublayout ? 'sublayout' : ''}`}
                >
                  <div className={`side-label-title`}>Side</div>
                  <div className={`side-label-side-desc`}>
                    {playlist.playlist_side}
                  </div>
                </div>
              </div>
              <div className='mixtape-text-content'>
                <h3>{playlist.playlist_title}</h3>
                <p>{playlist.playlist_subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='mixtape-powered-container'>
        <p>Powered by</p>
        <img
          src={`${getWidgetBaseUrl(environment)}/images/byu/mixtapes/langit-musik-logo.png`}
          alt='Langit Musik Logo'
          className='logo'
        />
        <span className='mixtape-brand'>Langit Musik</span>
      </div>
    </div>
  )
}

ByuMixtapes.propTypes = {
  isExploreSublayout: PropTypes.bool
}

export default ByuMixtapes
