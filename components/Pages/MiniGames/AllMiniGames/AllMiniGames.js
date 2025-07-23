import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useLocation } from 'react-router-dom'
import BackButton from '../../../../static/BackButton'
import { useTranslation } from 'react-i18next'
import './AllMiniGames.css'
import PropTypes from 'prop-types'
import common from '@kelchy/common'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import { keyframes } from '@emotion/react'
import { Box } from '@mui/system'
import { toCamelCase } from '../../../../common/constants'
import GeneralIcons from '../../../../static/GeneralIcons'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'

const { tenant } = getConfigForHostname()

const allCategoryData = {
  _id: '9',
  external_game_tag_id: '694856abcd103b0a752a89eb1fa',
  title: 'All Games',
  published_at: '2024-03-30T18:03:15.000Z',
  icon: null,
  icon_id: 'all-games',
  createdAt: '2024-02-21T12:07:30.000Z',
  updatedAt: '2024-02-21T12:07:32.000Z'
}

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`

const ShimmerCard = memo(() => (
  <Box
    sx={{
      width: '100%',
      height: '250px',
      borderRadius: '8px',
      overflow: 'hidden',
      background:
        'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200px 100%',
      animation: `${shimmer} 1.5s infinite linear`
    }}
  />
))

ShimmerCard.displayName = 'ShimmerCard'

const GameCard = memo(({ imageUrl, title, gameData }) => {
  const navigateToGame = (gameData) => {
    window.location.href = gameData?.game_url
  }

  return (
    <div
      className='byu-mini-games-card'
      onClick={() => navigateToGame(gameData)}
    >
      <img
        src={imageUrl}
        alt={title}
        className='byu-mini-games-card-image'
        onError={(e) =>
          (e.target.src = '/images/byu/mini-games/gamesFallbackThumbnail.png')
        }
      />
    </div>
  )
})

GameCard.displayName = 'GameCard'

GameCard.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  gameData: PropTypes.object.isRequired
}

const PillSelector = memo(({ categories, selectedPill, setSelectedPill }) => {
  const tenantLayout = useTenantConfig(tenant)
  return (
    <div className='byu-mini-games-lp-category-pill-wrapper'>
      {categories.map((pillItem, index) => (
        <div
          className={`byu-mini-games-lp-category-pill ${tenant} ${selectedPill === pillItem.title ? 'active' : ''}`}
          key={index}
          onClick={() => setSelectedPill(pillItem.title)}
        >
          <div className='byu-mini-games-lp-category-pill-content-wrapper'>
            <div className='byu-mini-games-lp-category-pill-content-icon-wrap'>
              {pillItem?.icon ? (
                <img
                  src={pillItem?.icon}
                  alt={pillItem?.external_game_tag_id}
                  className='byu-mini-games-lp-category-pill-content-icon'
                  onError={(e) =>
                    (e.target.src = '/images/byu/gamesFallbackThumbnail.png')
                  }
                />
              ) : (
                <GeneralIcons
                  kind='all-games'
                  width={24}
                  height={24}
                  color={
                    selectedPill === pillItem.title
                      ? '#FFF'
                      : tenantLayout?.byu?.common?.ctaColor
                  }
                />
              )}
            </div>
            <div className='byu-mini-games-lp-category-pill-content-text'>
              {pillItem.title}
            </div>
          </div>
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

const AllMiniGames = () => {
  const { t } = useTranslation('common')
  const { authorizationId } = useAppContext()
  const location = useLocation()
  const gamesData = useMemo(
    () =>
      location.state && typeof location.state === 'object'
        ? location.state
        : {},
    [location.state]
  )
  const [gamesGroupedCategory, setGamesGroupedCategory] = useState([])
  const [gamesResponse, setGamesResponse] = useState(null)
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPill, setSelectedPill] = useState(gamesData?.data?.title)

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
        axiosGet('/game-tags', {})
      )
      if (response?.data) {
        setGamesGroupedCategory([allCategoryData, ...response.data])
        if (!gamesData?.data?.title) {
          setSelectedPill(response?.data[0]?.title)
        }
      }
      setIsLoading(false)
    }
    fetchCategories()
  }, [authorizationId, gamesData?.data?.title])

  const fetchGames = useCallback(
    async (pageNum = 1, reset = false) => {
      if (!selectedPill) return
      setIsLoading(true)
      const slug =
        selectedPill !== 'All Games'
          ? `/games?tag=${toCamelCase(selectedPill)}&page=${pageNum}`
          : `/games`
      const { data: response } = await common.awaitWrap(axiosGet(slug, {}))
      if (response?.data) {
        setGamesResponse(response)
        setGames((prevGames) =>
          reset ? response.data : [...prevGames, ...response.data]
        )
      }
      setIsLoading(false)
    },
    [selectedPill]
  )

  useEffect(() => {
    if (selectedPill) {
      fetchGames(1, true)
    }
  }, [selectedPill, fetchGames])

  const loadMoreGames = useCallback(() => {
    if (gamesResponse?.total_pages > gamesResponse?.current_page) {
      fetchGames(gamesResponse.current_page + 1)
    }
  }, [gamesResponse, fetchGames])

  return (
    <div className='byu-mini-games-home-wrap'>
      <div className='byu-mini-games-list-header'>
        <BackButton color='#1F2D3D' textVisible={false} />
        <div className='byu-mini-games-list-title'>{t('byu.games')}</div>
      </div>
      <PillSelector
        categories={gamesGroupedCategory}
        selectedPill={selectedPill}
        setSelectedPill={setSelectedPill}
      />
      <div className='byu-mini-games-container'>
        <div className='byu-mini-games-grid'>
          {isLoading && games.length > 0
            ? Array.from({ length: 9 }, (_, index) => (
                <ShimmerCard key={index} />
              ))
            : games.map((game) => (
                <GameCard
                  key={game?._id}
                  imageUrl={game?.media?.thumbnail_img}
                  title={game?.title}
                  gameData={game}
                />
              ))}
        </div>
      </div>
      <div className='byu-all-mini-games-container wrap'>
        {gamesGroupedCategory.length > 0 && (
          <>
            {isLoading ? (
              <>
                {Array.from({ length: 3 }, (_, index) => (
                  <ShimmerCard key={index} />
                ))}
              </>
            ) : (
              <>
                {gamesResponse && (
                  <>
                    {gamesResponse?.total_pages >
                      gamesResponse?.current_page && (
                      <div className='byu-mini-games-home-section-btn'>
                        <div
                          className='byu-mini-games-home-section-btn-dap all-video'
                          onClick={loadMoreGames}
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

AllMiniGames.displayName = 'AllMiniGames'

export default AllMiniGames
