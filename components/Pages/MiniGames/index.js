import React from 'react'
import MiniGamesHome from './MiniGamesHome/MiniGamesHome'
import './index.css'

function redirectToGame(gameData) {
  window.location.href = gameData?.game_url
}

const MiniGames = () => {
  return (
    <div className='byu-mini-games-list-container'>
      <div className='byu-mini-games-home-wrapper'>
        <MiniGamesHome redirectToGame={redirectToGame} />
      </div>
    </div>
  )
}

export default MiniGames
