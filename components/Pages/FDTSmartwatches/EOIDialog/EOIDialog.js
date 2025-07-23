import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import common from '@kelchy/common'
import { axiosPost } from '../../../../utils/axios'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { smartwatchesData } from '../../../../static/smartwatchesData'
import Loader from '../../../Loader/Loader'
import './EOIDialog.css'
import { validateEmail } from '../../../../helpers/helperFunctions'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'
import PropTypes from 'prop-types'

export default function FormDialog({
  openEOIDialog,
  EOIWatchId,
  handleEOIDialogClose
}) {
  const { authorizationId } = useAppContext()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [EOIFormSubmitted, setEOIFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const smartWatchName = smartwatchesData.find(
    (x) => x.id === Number(EOIWatchId)
  )?.name

  const handleClose = () => {
    setUserName('')
    setUserEmail('')
    setEOIFormSubmitted(false)
    handleEOIDialogClose()
  }

  const submitEOIForm = async () => {
    if (!userName || !userEmail) {
      alert('Please enter your name and email')
    } else if (validateEmail(userEmail) === false) {
      alert('Please enter a valid email address')
    } else {
      const EOIPayload = {
        user_name: userName,
        user_email: userEmail,
        smart_watch_id: EOIWatchId,
        smart_watch_name: smartWatchName
      }
      setIsLoading(true)

      const { data: apiResponse } = await common.awaitWrap(
        axiosPost('/shop/pre_order_smart_watch', EOIPayload)
      )

      setIsLoading(false)
      if (apiResponse?.data?.code === 200) {
        const properties = {
          external_id: authorizationId,
          app_name: 'smartwatches_fdt'
        }
        trackEvent('confirmation_success_popup_visit', properties)

        setEOIFormSubmitted(true)
      } else {
        alert('Something went wrong, please try again later.')
      }
    }
  }

  return (
    <Dialog open={openEOIDialog} onClose={handleClose}>
      <IconButton
        aria-label='close'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 22
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        {isLoading ? (
          <Loader />
        ) : (
          <form className='eoi-form'>
            <div className='eoi-form-div' />
            <div className='eoi-form-inner'>
              <div className='eoi-form-frame'>
                <div className='eoi-header-wrapper'>
                  <h1 className='eoi-header-container'>
                    {EOIFormSubmitted ? (
                      <>
                        <p className='eoi-header-1'>
                          You’re
                          <span className='eoi-header-span-2'> in!</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className='eoi-header-1'>Like what </p>
                        <p className='eoi-header-2'>
                          <span className='eoi-header-span-1'>you </span>
                          <span className='eoi-header-span-2'>see?</span>
                        </p>
                      </>
                    )}
                  </h1>
                </div>

                <p className='eoi-subheader-container'>
                  <span className='eoi-subheader'>
                    {EOIFormSubmitted
                      ? 'Thanks for registering your interest! '
                      : `We’re launching soon.`}
                  </span>
                  <span className='eoi-subheader'>
                    {EOIFormSubmitted
                      ? 'Check back this space for update and look forward to our launch! 🎉'
                      : `Leave your details to be the first in queue. `}
                  </span>
                </p>
              </div>
            </div>
            {!EOIFormSubmitted && (
              <>
                <div className='eoi-input-wrapper'>
                  <input
                    type='text'
                    name='user_name'
                    className='eoi-dialog-input'
                    placeholder='Your Name'
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input
                    type='text'
                    name='user_email'
                    className='eoi-dialog-input eoi-input-email'
                    placeholder='Your Email Address'
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className='eoi-submit-wrapper'>
                  <button
                    className='eoi-submit-btn'
                    type='button'
                    onClick={submitEOIForm}
                  >
                    <span className='eoi-submit-btn-span'>Submit</span>
                  </button>
                </div>

                <div className='eoi-footer-label'>
                  We promise to send you only the good stuff!
                </div>
              </>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

FormDialog.propTypes = {
  openEOIDialog: PropTypes.bool.isRequired,
  EOIWatchId: PropTypes.string.isRequired,
  handleEOIDialogClose: PropTypes.func.isRequired
}
