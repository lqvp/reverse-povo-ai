import React, { useEffect } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const MemeSearch = ({ searchText, onInputChange, onSeachButtonClick }) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')

  useEffect(() => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId
    }
    trackEvent('create_visit', properties)
  }, [authorizationId])

  return (
    <>
      <div className='search-meme-title'>
        {t('meme.memeSearch.createMemeWithAI')}
      </div>
      <div className='search-card-container'>
        <img src={'/images/meme-doge.png'} alt='' className='doge-meme-image' />
        <div className='meme-search-title'>
          {t('meme.memeSearch.tellYourFeelingToCreateMeme')}
        </div>
        <div className='input-wrapper'>
          <input
            type='text'
            placeholder={t('meme.memeSearch.typeSomethingPlaceholder')}
            value={searchText}
            onChange={(e) => onInputChange(e.target.value)}
          />
          <button
            className='meme-search-button'
            disabled={!searchText}
            onClick={onSeachButtonClick}
          >
            {t('meme.memeSearch.createButton')}
          </button>
        </div>
      </div>
    </>
  )
}

MemeSearch.propTypes = {
  searchText: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSeachButtonClick: PropTypes.func.isRequired
}

export default MemeSearch
