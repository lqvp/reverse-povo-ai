import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, IconButton } from '@mui/material'
import './InterestSelectionDialog.css'
import CloseIcon from '@mui/icons-material/Close'
import tiktokInterestTopics from '../../../../static/tiktokInterestTopics'
import common from '@kelchy/common'
import { axiosGet, axiosPost } from '../../../../utils/axios'
import Loader from '../../../Loader/Loader'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const InterestSelectionDialog = ({ open, handleSelectionDialogClose }) => {
  const { authorizationId } = useAppContext()
  const [showOtherInterestInput, setShowOtherInterestInput] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState([])
  const [otherInterestTopicsText, setOtherInterestTopicsText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    callNewsInterestApi()
  }, [])

  const callNewsInterestApi = async () => {
    setIsLoading(true)
    const { data: newsInterestApiResponse } = await common.awaitWrap(
      axiosGet('/news/interests', {})
    )
    if (newsInterestApiResponse?.data?.news_interest_categories) {
      const selectedTopicsArray =
        newsInterestApiResponse?.data?.news_interest_categories.map((item) => ({
          ...item,
          category_id: Number(item.category_id)
        }))
      setSelectedTopics(selectedTopicsArray)
    }
    if (newsInterestApiResponse?.data?.other_news_interest) {
      setShowOtherInterestInput(true)
      setOtherInterestTopicsText(
        newsInterestApiResponse?.data?.other_news_interest
      )
    }
    setIsLoading(false)
  }

  const handleClose = () => {
    handleSelectionDialogClose()
  }

  const handleInterestTopicClicked = ({
    category_id,
    category_key,
    category_name
  }) => {
    const topicExists = selectedTopics.some(
      (topic) => topic.category_id === category_id
    )

    if (topicExists) {
      setSelectedTopics(
        selectedTopics.filter((topic) => topic.category_id !== category_id)
      )
    } else {
      const properties = {
        external_id: authorizationId,
        category_name: category_key,
        app_name: 'quick_news_app'
      }
      trackEvent('news_survey_category_click', properties)

      setSelectedTopics([...selectedTopics, { category_id, category_name }])
    }
  }

  const handleOtherInterestClicked = () => {
    if (showOtherInterestInput) {
      setOtherInterestTopicsText('')
      setShowOtherInterestInput(false)
    } else {
      setShowOtherInterestInput(true)
    }
  }

  const handleSubmitInterestTopicsClicked = async () => {
    const body = {
      news_interest_categories: selectedTopics,
      other_news_interest: otherInterestTopicsText
    }
    setIsLoading(true)
    await common.awaitWrap(axiosPost('/news/interests', body))
    setIsLoading(false)
    handleSelectionDialogClose()
  }

  return (
    <Dialog fullScreen open={open} onClose={null} className='tt-isd-dialog'>
      <IconButton
        aria-label='close'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 15,
          top: 25,
          zIndex: 22
        }}
      >
        <CloseIcon className='tt-isd-close-icon' />
      </IconButton>
      <DialogContent>
        {isLoading ? (
          <Loader />
        ) : (
          <div className='tt-isd-container'>
            <div className='tt-isd-title'>{t('news.whatInterestsYou')}</div>
            <div className='tt-isd-interest-wrapper'>
              {tiktokInterestTopics?.map((topic) => (
                <div
                  key={topic.category_id}
                  className={`tt-isd-interest-div ${
                    selectedTopics.some(
                      (t) => t.category_id === topic.category_id
                    )
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleInterestTopicClicked(topic)}
                >
                  {topic?.category_name}
                </div>
              ))}
              <div
                className={`tt-isd-interest-div ${
                  showOtherInterestInput ? 'selected' : ''
                }`}
                onClick={handleOtherInterestClicked}
              >
                {t('news.others')}
              </div>
            </div>
            {showOtherInterestInput ? (
              <>
                <div className='tt-isd-other-interest-input-text'>
                  {t('news.addMoreInterests')}
                </div>
                <input
                  type='text'
                  name='otherInterestTopics'
                  className='tt-isd-other-interest-input'
                  placeholder={t('news.addyourInterestsHere')}
                  value={otherInterestTopicsText}
                  onChange={(e) => setOtherInterestTopicsText(e.target.value)}
                />
              </>
            ) : null}
            <button
              className='tt-isd-submit-button'
              disabled={
                (!selectedTopics?.length && !showOtherInterestInput) ||
                (showOtherInterestInput && !otherInterestTopicsText)
              }
              onClick={handleSubmitInterestTopicsClicked}
            >
              {t('submit')}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

InterestSelectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleSelectionDialogClose: PropTypes.func.isRequired
}

export default InterestSelectionDialog
