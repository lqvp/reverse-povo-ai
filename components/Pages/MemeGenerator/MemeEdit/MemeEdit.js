import { Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InputTextEdit from './InputTextEdit'
import { useAppContext } from '../../../../context/AppContext'
import { axiosPost } from '../../../../utils/axios'
import common from '@kelchy/common'
import Loader from '../../../Loader/Loader'
import ErrorModal from '../../../Modal/ErrorModal/ErrorModal'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const MemeEdit = ({ selectedMeme, setPage, setGeneratedMemeData }) => {
  const imageRef = useRef(null)
  const moveableRefs = useRef(
    Array(selectedMeme.box_count || 5)
      .fill(null)
      .map(() => React.createRef())
  )
  const { authorizationId } = useAppContext()
  const [textInputs, setTextInputs] = useState([])
  const [allowedTextCount, setAllowedTextCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0
  })
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const { t } = useTranslation('common')

  useEffect(() => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId
    }
    trackEvent('edit_meme_visit', properties)
  }, [authorizationId])

  useEffect(() => {
    setTextInputs([
      {
        id: 0,
        text: selectedMeme.name,
        color: '#ffffff',
        outline_width: 2,
        outlineColor: '#000000',
        x: 0,
        y: 0,
        height: 100,
        width: 200
      }
    ])
    setAllowedTextCount(selectedMeme.box_count)
  }, [selectedMeme])

  const handleImageLoad = () => {
    const boundingRect = imageRef.current?.getBoundingClientRect()
    const { width = 400, height = 400 } = boundingRect || {}
    setImageDimensions({ width, height })
  }

  const handleDrag = (id, e, ui) => {
    const { x, y } = ui
    const updatedTextInputs = [...textInputs]
    const index = updatedTextInputs.findIndex((input) => input.id === id)
    updatedTextInputs[index].x = x
    updatedTextInputs[index].y = y
    setTextInputs(updatedTextInputs)
  }

  const handleInputChange = (id, newText) => {
    const updatedTextInputs = [...textInputs]
    const index = updatedTextInputs.findIndex((input) => input.id === id)
    updatedTextInputs[index].text = newText
    setTextInputs(updatedTextInputs)
  }

  const onTextStyleChange = (id, style) => {
    const updatedTextInputs = [...textInputs]
    const index = updatedTextInputs.findIndex((input) => input.id === id)
    updatedTextInputs[index].color = style.color
    updatedTextInputs[index].outlineColor = style.outlineColor
    setTextInputs(updatedTextInputs)
  }

  const handleAddNewText = () => {
    if (textInputs.length < allowedTextCount) {
      setTextInputs([
        ...textInputs,
        {
          id: textInputs.length,
          text: selectedMeme.name,
          color: '#ffffff',
          outline_width: 2,
          outlineColor: '#000000',
          x: 0,
          y: 0,
          height: 100,
          width: 200
        }
      ])
    }
  }

  const getTextInputDimesions = () => {
    const updatedTextInputs = [...textInputs]
    moveableRefs?.current?.forEach((textRef, id) => {
      if (textRef?.current) {
        const { width = 200, height = 100 } =
          textRef.current.getBoundingClientRect()
        updatedTextInputs[id].width = width
        updatedTextInputs[id].height = height
        updatedTextInputs[id].outline_color = updatedTextInputs[id].outlineColor
      }
    })
    setTextInputs(updatedTextInputs)
    return updatedTextInputs
  }

  const onDiscardMemeClick = () => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: selectedMeme?.id
    }
    trackEvent('discard_edit_click', properties)
    setPage('searchResult')
  }

  const onSaveMemeClick = async () => {
    if (!(selectedMeme?.id && textInputs.length)) {
      return
    }

    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: selectedMeme?.id
    }
    trackEvent('save_edit_click', properties)

    const updatedTextInputs = getTextInputDimesions()
    const headers = {
      Authorization: authorizationId
    }
    const body = {
      imageDimensions,
      templateId: selectedMeme?.id,
      templateUrl: selectedMeme?.url,
      max_font_size: '36px',
      boxes: [...updatedTextInputs]
    }
    setIsLoading(true)
    const { data: memeGeneratedRes, error: memeGeneratorError } =
      await common.awaitWrap(axiosPost(`/media/meme`, body, headers))

    if (memeGeneratorError) {
      console.error('Error in generating error:', memeGeneratorError)
      setErrorModalData({ openModal: true })
    }
    setIsLoading(false)
    if (memeGeneratedRes) {
      setGeneratedMemeData(memeGeneratedRes?.data)
      setPage('generatedMeme')
    }
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className='save-meme-button-wrapper'>
        <Button
          disableElevation={true}
          variant='contained'
          sx={{
            textTransform: 'none',
            color: '#2A333D',
            fontSize: '12px',
            background: 'transparent',
            borderRadius: '4rem',
            width: '6rem',
            height: '2rem',
            border: '1px solid #2A333D',
            '&:hover': {
              backgroundColor: '#FFF',
              color: '#2A333D'
            }
          }}
          onClick={onDiscardMemeClick}
        >
          {t('meme.memeEdit.discard')}
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
            width: '6rem',
            height: '2rem'
          }}
          onClick={onSaveMemeClick}
        >
          {t('meme.memeEdit.save')}
        </Button>
      </div>
      {selectedMeme ? (
        <div className='meme-edit-wrapper'>
          <div className='edit-image-container'>
            <div>
              <img
                src={selectedMeme?.url}
                alt='Not available'
                className='edit-image-preview'
                ref={imageRef}
                onLoad={handleImageLoad}
              />
            </div>
            {textInputs?.map(({ id, text, color, outlineColor, x, y }) => (
              <Draggable
                key={id}
                defaultPosition={{ x, y }}
                position={{ x, y }}
                onStop={(e, ui) => handleDrag(id, e, ui)}
                bounds='parent'
              >
                <div
                  className='draggable-text'
                  ref={moveableRefs.current[id]}
                  style={{
                    color: color,
                    textShadow: `1px 1px 0 ${outlineColor}, -1px -1px 0 ${outlineColor}, 1px -1px 0 ${outlineColor}, -1px 1px 0 ${outlineColor}`
                  }}
                >
                  {text}
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      ) : null}
      <div className='meme-input-wrapper'>
        {textInputs?.map(({ id, text, color, outlineColor }) => (
          <div key={id} className='meme-input-container'>
            <div>{`${t('meme.memeEdit.textLine')} ${id + 1}`}</div>
            <InputTextEdit
              id={id}
              text={text}
              color={color}
              outlineColor={outlineColor}
              handleInputChange={handleInputChange}
              onTextStyleChange={onTextStyleChange}
            />
          </div>
        ))}
        {textInputs?.length < allowedTextCount && (
          <div className='new-text-button-container'>
            <div onClick={handleAddNewText}>
              <button>{t('meme.memeEdit.addNewText')}</button>
              <AddCircleIcon fontSize='small' />
            </div>
          </div>
        )}
      </div>
      {errorModalData?.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
        />
      )}
    </>
  )
}

MemeEdit.propTypes = {
  selectedMeme: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  setGeneratedMemeData: PropTypes.func.isRequired
}

export default MemeEdit
