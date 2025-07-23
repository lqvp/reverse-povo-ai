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

const MiniGamesBanners = ({ redirectToGame }) => {
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
        axiosGet('/games?page=1&section=banner_1', {})
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
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    arrows: false
  }

  return (
    <div className='byu-mini-game-container-banner'>
      <Slider className='byu-mini-game-carousel' {...settings}>
        {!isLoading &&
          gamesData.length > 0 &&
          gamesData.map((game, index) => (
            <div
              key={game.external_game_id + index}
              className='byu-mini-game-slide'
              onClick={() => redirectToGame(game)}
            >
              <div className='byu-mini-game-content banner'>
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
              </div>
            </div>
          ))}
      </Slider>
    </div>
  )
}

MiniGamesBanners.propTypes = {
  redirectToGame: PropTypes.func.isRequired
}

export default MiniGamesBanners
