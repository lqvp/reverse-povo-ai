import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PUZZLE_EMBED_URLS } from '../../../common/constants'
import BackButton from '../../../static/BackButton'
import './index.css'

const Puzzles = () => {
  const { puzzleName } = useParams()
  const puzzleEmbedUrl = PUZZLE_EMBED_URLS?.[puzzleName]
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='puzzle-container'>
      <div className='puzzle-header'>
        <BackButton color='#7d3636' fontSize='18px' onClick={handleBackClick} />
      </div>
      {puzzleEmbedUrl ? (
        <iframe
          title='Puzzle'
          src={`https://puzzel.org${puzzleEmbedUrl}`}
          width='100%'
          height='800'
          frameBorder='0'
        ></iframe>
      ) : (
        <span className='empty-puzzle'>Puzzle is not available</span>
      )}
    </div>
  )
}

export default Puzzles
