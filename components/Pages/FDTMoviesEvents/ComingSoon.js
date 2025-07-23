import React, { useState } from 'react'
import './ComingSoon.css'
import AIStylistIcon from '../../../static/AIStylistIcon'
import common from '@kelchy/common'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useAppContext } from '../../../context/AppContext'
import { axiosPost } from '../../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { isValidEmail } from '../../../utils/converter'

const ComingSoon = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    error && setError('')
  }

  const handleBackToExplore = () => {
    navigate(-1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    const FDTInterestPayload = { user_email: email }
    setLoading(true)
    const { data: apiResponse } = await common.awaitWrap(
      axiosPost('/shop/save_movies_events_interest', FDTInterestPayload)
    )
    setLoading(false)

    if (apiResponse?.data?.code === 200) {
      const properties = {
        external_id: authorizationId,
        app_name: 'movies_and_events'
      }
      trackEvent('clicked submit_email', properties)
      setEmail('')
      setSuccess(true)
    } else {
      setError('Something went wrong, please try again later.')
    }
  }

  return (
    <div className='coming-container'>
      <div className='content'>
        <div className='coming-soon-icon'>
          <img src='/images/moviesevents/VLCPlayer.png' alt='movies-events' />
        </div>
        <div className='description'>
          <h2 className='heading'>Hello! You caught us before we’re ready</h2>
          <p className='text'>
            We’re working hard to put the finishing touches to this experience.
          </p>
          <p className='text'>
            We can send you a reminder when we’re ready, just put your email in
            below.
          </p>
        </div>
        {success ? (
          <div className='movie-events-message'>
            Thank you for your interest!
          </div>
        ) : (
          <>
          {
            error && (
              <div className='fdt-movie-events-error'>
                {error}
              </div>
            )
          }
          <form className='movie-events-form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Email ID'
              value={email}
              onChange={handleEmailChange}
            />
            <button type='submit' disabled={loading}>
              <AIStylistIcon
                kind='right_arrow'
                width={24}
                height={24}
                color='#fff'
              />
            </button>
          </form>
          </>
        )}
        <button
          className='movie-events-back-to-explore'
          onClick={handleBackToExplore}
        >
          Back to Explore
        </button>
      </div>
    </div>
  )
}

export default ComingSoon
