import React, { useEffect, useState } from 'react'
import Carousel from '../../Carousel/Carousel'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { Button } from '@mui/material'
import common from '@kelchy/common'
import ShareModal from '../../Modal/ShareModal/ShareModal'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { useNavigate } from 'react-router-dom'
import Loader from '../../Loader/Loader'
import {
  downloadMedia,
  shareMediaNativePopUp,
  shareMediaToUGC
} from '../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const MemeResults = ({
  searchText,
  onSearchTextChange,
  onRefreshButtonClick,
  memeList,
  displayMeme,
  selectedMeme,
  onMemeSelected,
  onPageChange
}) => {
  const autoMemeUrl = displayMeme?.image_url
  const { authorizationId } = useAppContext()
  const [imageRendered, setImageRendered] = useState(false)
  const navigate = useNavigate()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const { t } = useTranslation('common')

  useEffect(() => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId
    }
    trackEvent('ai_results_visit', properties)
  }, [authorizationId])

  useEffect(() => {
    setImageRendered(!autoMemeUrl)
  }, [autoMemeUrl])

  const imageLoaded = () => {
    setImageRendered(true)
  }

  const onRegenerateClick = () => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId
    }
    trackEvent('regenerate_new_click', properties)
    onRefreshButtonClick()
  }

  const onEditMemeClick = () => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: selectedMeme?.id
    }
    trackEvent('edit_meme_click', properties)
    onPageChange('edit')
  }

  const handleDownload = async () => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: searchText
    }
    trackEvent('download_click', properties)

    downloadMedia(autoMemeUrl)
  }

  const handleOpenShareModal = async () => {
    setTimeout(() => {
      const properties = {
        external_id: authorizationId,
        app_name: 'meme_generator'
      }
      trackEvent('share_prompt_view', properties)
      setOpenShareModal(true)
    }, 1000)
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: searchText
    }
    trackEvent('share_click', properties)

    const { error: shareMediaError } = common.awaitWrap(
      shareMediaNativePopUp(autoMemeUrl)
    )
    if (shareMediaError) {
      setErrorModalData({ openModal: true })
    }
  }

  const handleShareModalClose = async (success) => {
    const shareMediaUGCUrl = `/media/meme/${displayMeme?.media_id}`
    setOpenShareModal(false)

    const { error: shareMediaToUGCError } = await common.awaitWrap(
      shareMediaToUGC(
        success,
        authorizationId,
        'meme_generator',
        shareMediaUGCUrl,
        navigate
      )
    )
    if (shareMediaToUGCError) {
      console.error('Error in sharing UGC:', shareMediaToUGCError)
      setErrorModalData({ openModal: true })
    }
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  return (
    <>
      {!imageRendered ? <Loader /> : null}
      <div className='search-text-container'>
        <div className='search-text-title'>
          {t('meme.memeSearch.createMemeWithAI')}
        </div>
        <div className='input-wrapper'>
          <input
            type='text'
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
          />
          <button className='refresh-search-button' onClick={onRegenerateClick}>
            <RefreshIcon fontSize='medium' />
          </button>
        </div>
      </div>
      {autoMemeUrl || selectedMeme ? (
        <>
          <div className='selected-meme-wrapper'>
            <img
              src={selectedMeme?.url || autoMemeUrl}
              alt='Not available'
              className='image-preview'
              onLoad={imageLoaded}
            />
            {selectedMeme && imageRendered ? (
              <button className='edit-meme-button' onClick={onEditMemeClick}>
                <EditIcon fontSize='medium' />
              </button>
            ) : null}
          </div>
        </>
      ) : null}
      {autoMemeUrl && !selectedMeme && (
        <div className='buttons-wrapper'>
          <Button
            disableElevation={true}
            variant='contained'
            sx={{
              textTransform: 'none',
              color: '#2A333D',
              fontSize: '12px',
              background: '#FFF',
              borderRadius: '4rem',
              width: '9rem',
              height: '2.2rem',
              border: '1px solid #2A333D',
              '&:hover': {
                backgroundColor: '#FFF',
                color: '#2A333D'
              }
            }}
            onClick={handleDownload}
          >
            {t('download')}
          </Button>
          <Button
            disableElevation={true}
            variant='contained'
            sx={{
              textTransform: 'none',
              color: '#FFF',
              fontSize: '12px',
              background: '#009EFF',
              borderRadius: '4rem',
              width: '9rem',
              height: '2.2rem'
            }}
            onClick={handleOpenShareModal}
          >
            {t('share')}
          </Button>
        </div>
      )}
      {memeList?.length ? (
        <div className='available-meme-wrapper'>
          <div className='available-meme-title'>
            {t('meme.memeSearch.tryTheseMemeTemplates')}
          </div>
          <Carousel
            data={memeList}
            selectedImage={selectedMeme?.id}
            onImageSelect={onMemeSelected}
          />
        </div>
      ) : null}
      {!(memeList?.length || autoMemeUrl) ? (
        <div className='no-available-meme-wrapper'>
          <img
            src={'/images/no_meme_placeholder_image.jpg'}
            alt={t('meme.memeSearch.noMemeAvailablePlaceholder')}
          />
        </div>
      ) : null}
      {openShareModal && (
        <ShareModal
          open={openShareModal}
          handleModalClose={handleShareModalClose}
        />
      )}
      {errorModalData?.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
        />
      )}
    </>
  )
}

MemeResults.propTypes = {
  searchText: PropTypes.string.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
  onRefreshButtonClick: PropTypes.func.isRequired,
  memeList: PropTypes.arrayOf(PropTypes.object).isRequired,
  displayMeme: PropTypes.object,
  selectedMeme: PropTypes.object,
  onMemeSelected: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default MemeResults
