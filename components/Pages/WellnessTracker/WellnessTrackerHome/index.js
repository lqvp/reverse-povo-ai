import React from 'react'
import './index.css'
import CameraIcon from '../../../../static/CameraIcon'
import {
  WELLNESS_TRACKER_BANNER_DESC,
  WELLNESS_TRACKER_SCROLL_INDICATOR,
  WELLNESS_TRACKER_TERMS_CONDITIONS
} from '../../../../common/constants'
import WellnessTrackerHeader from '../WellnessTrackerHeader'
import GeneralIcons from '../../../../static/GeneralIcons'
import { useRef } from 'react'
import PropTypes from 'prop-types'

const WellnessTrackerHome = ({ setStarted }) => {
  const contentRef = useRef(null)

  const handleScrollIndicatorClick = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
      setTimeout(() => {
        contentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }, 1000)
    }
  }

  return (
    <div className='ai-track-wellness-container'>
      <div className='ai-track-wellness-header-banner'>
        <WellnessTrackerHeader color='#ffffff' title='Wellness Scanner' />
        <img
          src='/images/wellness_track/wellness_tracker_banner_background.gif'
          alt='wellness_banner_image'
          className='ai-track-wellness-banner-icon'
        />
        <div className='ai-track-wellness-banner-desc'>
          <ul>
            {Object.keys(WELLNESS_TRACKER_BANNER_DESC)?.map((note, index) => (
              <li key={index}>{WELLNESS_TRACKER_BANNER_DESC[note]}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className='ai-track-wellness-content' ref={contentRef}>
        <div className='ai-track-wellness-indicator'>
          <p>{WELLNESS_TRACKER_SCROLL_INDICATOR}</p>
          <div
            className='ai-track-wellness-indicator-icon'
            onClick={handleScrollIndicatorClick}
          >
            <GeneralIcons
              kind={'downArrow'}
              color='#005483'
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className='ai-track-wellness-description'>
          <div className='ai-track-wellness-terms'>
            {WELLNESS_TRACKER_TERMS_CONDITIONS?.terms}
          </div>
          <div className='ai-track-wellness-notes'>
            {WELLNESS_TRACKER_TERMS_CONDITIONS?.notes}
            <ul>
              {WELLNESS_TRACKER_TERMS_CONDITIONS?.notesDetails?.map(
                (note, index) => (
                  <li key={index}>{note}</li>
                )
              )}
            </ul>
          </div>
          <div className='ai-track-wellness-warning'>
            {WELLNESS_TRACKER_TERMS_CONDITIONS?.warning}
          </div>
        </div>
      </div>
      <div className='ai-track-wellness-footer'>
        <button
          className='ai-track-wellness-btn'
          onClick={() => setStarted(true)}
        >
          <CameraIcon /> Start Scan
        </button>
      </div>
    </div>
  )
}

WellnessTrackerHome.propTypes = {
  setStarted: PropTypes.func.isRequired
}

export default WellnessTrackerHome
