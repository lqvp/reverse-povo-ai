import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import common from '@kelchy/common'
import PropTypes from 'prop-types'
import './MiniGamesHome.css'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'

const { tenant } = getConfigForHostname()

const MiniGameCard = ({ data }) => {
  const tenantLayout = useTenantConfig(tenant)
  return (
    <div className='byu-mini-game-popular-card-wrap'>
      <img
        src={
          data?.media?.thumbnail_img
            ? data?.media?.thumbnail_img
            : data?.media?.cover_img
              ? data?.media?.cover_img
              : '/images/byu/mini-games/gamesFallbackThumbnail.png'
        }
        alt='byu-mini-game-thumbnail'
        className='byu-mini-game-thumbnail-popular'
        onError={(e) =>
          (e.target.src = '/images/byu/mini-games/gamesFallbackThumbnail.png')
        }
      />
      <div className='byu-mini-game-popular-card-text'>
        <div className='byu-mini-game-popular-card-title'>{data?.title}</div>
        <div className='byu-mini-game-popular-card-category'>
          {data?.metadata?.tag?.title}
        </div>
      </div>
      <div
        className='byu-mini-game-popular-card-cta'
        style={{
          background: tenantLayout?.byu?.common?.ctaColor
        }}
      >
        {' '}
        Play
      </div>
    </div>
  )
}

MiniGameCard.propTypes = {
  data: PropTypes.object
}

const MiniGamesPopular = ({ redirectToGame }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [gamesData, setGamesData] = useState([])
  const { authorizationId } = useAppContext()

  useEffect(() => {
    const fetchAppData = async () => {
      setIsLoading(true)
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'ai_app_new'
        }
        trackEvent('byu_games_carousel', properties)
      }
      const { data: response } = await common.awaitWrap(
        axiosGet('/games?page=1&section=popular', {})
      )
      if (response?.data) {
        setGamesData(response.data)
      }
      setIsLoading(false)
    }
    fetchAppData()
  }, [authorizationId])

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: gamesData.length > 3 ? 1.25 : 1,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
    infinite: gamesData.length > 3,
    initialSlide: -0.25
  }

  // Group games into chunks of 3 per slide
  const groupedGames = []
  for (let i = 0; i < gamesData.length; i += 3) {
    groupedGames.push(gamesData.slice(i, i + 3))
  }

  return (
    <div className={`byu-mini-game-container popular ${tenant}`}>
      <div className='byu-mini-game-container-heading'>Popular Games</div>
      <Slider
        {...settings}
        className={`byu-mini-game-carousel ${groupedGames.length > 6 ? 'full' : ''}`}
      >
        {!isLoading &&
          groupedGames.map((group, slideIndex) => (
            <div key={slideIndex} className='byu-mini-game-slide'>
              <div className='byu-mini-game-column'>
                {group.map((game, index) => (
                  <div
                    key={game.external_game_id + index}
                    className='byu-mini-game-card'
                    onClick={() => redirectToGame(game)}
                  >
                    <MiniGameCard data={game} />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </Slider>
    </div>
  )
}

MiniGamesPopular.propTypes = {
  redirectToGame: PropTypes.func.isRequired
}

export default MiniGamesPopular
