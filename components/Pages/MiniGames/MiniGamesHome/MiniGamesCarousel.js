import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import GeneralIcons from '../../../../static/GeneralIcons'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import common from '@kelchy/common'
import PropTypes from 'prop-types'
import './MiniGamesHome.css'
import { useTenantConfig } from '../../../../useTenantConfig'

const MiniGamesCarousel = ({ redirectToGame, tenant }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [gamesData, setGamesData] = useState([])
  const { authorizationId } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)

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
        axiosGet('/games?page=1&section=banner', {})
      )
      if (response?.data) {
        setGamesData(response.data)
      }
      setIsLoading(false)
    }
    fetchAppData()
  }, [authorizationId])

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 1,
    speed: 500,
    dots: true,
    arrows: false
  }

  return (
    <div className={`byu-mini-game-container ${tenant}`}>
      <Slider className='byu-mini-game-carousel' {...settings}>
        {!isLoading &&
          gamesData.length > 0 &&
          gamesData.map((game, index) => (
            <div
              key={game.external_game_id + index}
              className='byu-mini-game-slide'
              onClick={() => redirectToGame(game)}
            >
              <div className='byu-mini-game-content'>
                <img
                  src={
                    game?.media?.cover_img
                      ? game?.media?.cover_img
                      : game?.media?.thumbnail_img
                        ? game?.media?.thumbnail_img
                        : '/images/byu/mini-games/gamesFallback.png'
                  }
                  alt='byu-mini-game-utainment'
                  className='byu-mini-game-thumbnail'
                  onError={(e) =>
                    (e.target.src = '/images/byu/mini-games/gamesFallback.png')
                  }
                />
                <div className='byu-mini-game-overlay'>
                  <div className='byu-mini-game-tags'>
                    <div className='byu-mini-game-title'>{game?.title}</div>
                    <div className='byu-mini-game-category'>
                      {game?.metadata?.tag?.title}
                    </div>
                  </div>
                  <div
                    className='byu-mini-game-watch-btn'
                    style={{
                      backgroundColor: tenantLayout?.byu?.common?.ctaColor
                    }}
                  >
                    <div className='byu-mini-game-play-icon'>
                      <GeneralIcons
                        kind='playByu'
                        width={20}
                        height={20}
                        color='#FFF'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  )
}

MiniGamesCarousel.propTypes = {
  redirectToGame: PropTypes.func,
  tenant: PropTypes.string
}

export default MiniGamesCarousel
