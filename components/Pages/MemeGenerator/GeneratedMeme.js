import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ShareModal from '../../Modal/ShareModal/ShareModal'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { useAppContext } from '../../../context/AppContext'
import common from '@kelchy/common'
import { trackEvent } from '../../../helpers/analyticsHelper'
import Loader from '../../Loader/Loader'
import {
  downloadMedia,
  shareMediaNativePopUp,
  shareMediaToUGC
} from '../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const GeneratedMeme = ({ selectedMeme, generatedMemeData }) => {
  const generatedMemeUrl = generatedMemeData?.meme_image?.image_url

  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
  const [imageRendered, setImageRendered] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const { t } = useTranslation('common')

  useEffect(() => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId
    }
    trackEvent('edit_results_visit', properties)
  }, [authorizationId])

  useEffect(() => {
    setImageRendered(!generatedMemeUrl)
  }, [generatedMemeUrl])

  const imageLoaded = () => {
    setImageRendered(true)
  }

  const handleDownload = async () => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: selectedMeme?.id
    }
    trackEvent('download_click', properties)

    downloadMedia(generatedMemeUrl)
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
      meme_name: selectedMeme?.id
    }
    trackEvent('share_click', properties)

    const { error: shareMediaError } = common.awaitWrap(
      shareMediaNativePopUp(generatedMemeUrl)
    )
    if (shareMediaError) {
      setErrorModalData({ openModal: true })
    }
  }

  const handleShareModalClose = async (success) => {
    const shareMediaUGCUrl = `/media/meme/${generatedMemeData?.id}`
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
      {generatedMemeData ? (
        <div className='generated-meme-wrapper'>
          <div className='selected-meme-wrapper'>
            <img
              src={generatedMemeUrl}
              alt='Not available'
              className='image-preview'
              onLoad={imageLoaded}
            />
          </div>
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

GeneratedMeme.propTypes = {
  selectedMeme: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  generatedMemeData: PropTypes.shape({
    meme_image: PropTypes.shape({
      image_url: PropTypes.string.isRequired
    }).isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
}

export default GeneratedMeme
