import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import common from '@kelchy/common'
import './MiniGamesHome.css'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'

const { tenant } = getConfigForHostname()

const GameCategoryCard = ({ category, navigateToSection }) => {
  const tenantLayout = useTenantConfig(tenant)
  return (
    <div
      className='byu-mini-game-content-category-wrapper'
      style={{
        background: tenantLayout?.byu?.common?.ctaColor
      }}
      onClick={() => navigateToSection(category)}
    >
      <div className='byu-mini-game-content-category-content-title'>
        {category?.title}
      </div>
      <div className='byu-mini-game-content-category-icon'>
        <img
          src={
            category?.icon
              ? category?.icon
              : '/images/byu/mini-games/gamesFallbackThumbnail.png'
          }
          alt='byu-mini-game-thumbnail'
          className='byu-mini-game-thumbnail-images-category'
          onError={(e) =>
            (e.target.src = '/images/byu/mini-games/gamesFallbackThumbnail.png')
          }
        />
      </div>
    </div>
  )
}

GameCategoryCard.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.string
  }),
  navigateToSection: PropTypes.func
}

const MiniGamesCategories = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [gamesData, setGamesData] = useState([])
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()

  const navigateToSection = (data) => {
    navigate('/mini-game/all', { state: { data } })
  }

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
        axiosGet('/game-tags', {})
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
    slidesToShow: gamesData.length > 4 ? 2.5 : 2,
    initialSlides: gamesData.length > 4 ? -0.25 : 0,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
    infinite: gamesData.length > 4
  }

  // Group games into chunks of 2 per slide
  const groupedGames = []
  for (let i = 0; i < gamesData.length; i += 2) {
    groupedGames.push(gamesData.slice(i, i + 2))
  }

  return (
    <div className='byu-mini-game-container categories'>
      <div className='byu-mini-game-container-heading'>Game Categories</div>
      <Slider
        {...settings}
        className={`byu-mini-game-carousel category ${gamesData.length > 4 ? 'full' : ''}`}
      >
        {!isLoading &&
          groupedGames.map((group, slideIndex) => (
            <div key={slideIndex} className='byu-mini-game-slide'>
              <div className='byu-mini-game-column'>
                {group.map((game) => (
                  <GameCategoryCard
                    key={game?.external_game_tag_id}
                    category={game}
                    navigateToSection={navigateToSection}
                  />
                ))}
              </div>
            </div>
          ))}
      </Slider>
    </div>
  )
}

export default MiniGamesCategories
