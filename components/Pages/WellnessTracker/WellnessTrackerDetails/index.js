import React, { useEffect, useState } from 'react'
import './index.css'
import WellnessTrackerCard from './WellnessTrackerCard'
import ArrowDownIcon from '../../../../static/ArrowDownIcon'
import WellnessHeader from '../WellnessTrackerHeader'
import { useAppContext } from '../../../../context/AppContext'
import {
  getIndicatorColor,
  // getIndicatorPosition,
  getWellnessValue,
  handleAnalytics
} from '../../../../hooks/constant'
import PropTypes from 'prop-types'

// To be used later after confirmation from Binah Team
// import EmojisIcon from '../../../../static/EmojisIcon'
// import WellnessIndicatorIcon from '../../../../static/WellnessIndicatorIcon'

// const WELNESS_SCORE_EMOJIS = [
//   {
//     kind: 'veryBad'
//   },
//   {
//     kind: 'bad'
//   },
//   {
//     kind: 'moderate'
//   },
//   {
//     kind: 'good'
//   },
//   {
//     kind: 'veryGood'
//   }
// ]

// const WELNESS_SCORE_CONFIG = [
//   {
//     color: '#FF7474'
//   },
//   {
//     color: '#FF8574'
//   },
//   {
//     color: '#FA984A'
//   },
//   {
//     color: '#FAB44A'
//   },
//   {
//     color: '#F1CC09'
//   },
//   {
//     color: '#F1DA09'
//   },
//   {
//     color: '#E4E82D'
//   },
//   {
//     color: '#C3E82D'
//   },
//   {
//     color: '#A0E72D'
//   },
//   {
//     color: '#89DD00'
//   }
// ]

const WELLNESS_META_DATA = [
  {
    title: 'Heart Rate',
    icon: 'images/wellness_track/pulseRate.png',
    startColor: '#FFDDDD',
    endColor: '#ffffff',
    measurementValue: 'pulseRate',
    measurementUnit: 'bpm'
  },
  {
    title: 'Blood Pressure',
    icon: 'images/wellness_track/bloodPressure.png',
    startColor: '#E6E0FF',
    endColor: '#ffffff',
    measurementValue: 'bloodPressure',
    measurementUnit: 'mmHg'
  },
  {
    title: 'Sympathetic Stress',
    icon: 'images/wellness_track/sympatheticStress.png',
    startColor: '#FFE7B9',
    endColor: '#ffffff',
    measurementValue: 'stress'
  },
  {
    title: 'Breathing Rate',
    icon: 'images/wellness_track/respirationRate.png',
    startColor: '#D4F2FF',
    endColor: '#ffffff',
    measurementValue: 'respirationRate',
    measurementUnit: 'brpm'
  },
  {
    title: 'Hemoglobin',
    icon: 'images/wellness_track/hemoglobin.png',
    startColor: '#FFDCF5',
    endColor: '#ffffff',
    measurementValue: 'hemoglobin',
    measurementUnit: 'g/dL'
  }
]

const WellnessTrackerDetails = ({ handleStart, vitalSigns }) => {
  const { authorizationId } = useAppContext()
  const [isScrollBtnVisible, setIsScrollBtnVisible] = useState(true)

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
    setIsScrollBtnVisible(false)
  }

  useEffect(() => {
    const parentDiv = document.querySelector('.ai-wellness-details-bod')
    const childDiv = document.querySelector('.ai-track-wellness-btn')

    if (!parentDiv || !childDiv) return

    if (
      childDiv.offsetHeight > parentDiv.offsetHeight ||
      childDiv.offsetWidth > parentDiv.offsetWidth
    ) {
      setIsScrollBtnVisible(true)
    } else {
      setIsScrollBtnVisible(false)
    }
  }, [vitalSigns])

  useEffect(() => {
    if (authorizationId) {
      handleAnalytics(`wellness_results_impression`, authorizationId)
    }
  }, [authorizationId])

  const handleStartScan = () => {
    handleAnalytics(`wellness_scan_again_click`, authorizationId)
    handleStart()
  }

  return (
    <div className='ai-wellness-details'>
      <WellnessHeader handleBack={handleStart} title='Wellness Score' />
      <div className='ai-wellness-details-body'>
        <div className='ai-wellness-info'>
          {/* To be used later after confirmation from Binah Team */}
          {/* <div className='ai-wellness-score-emojis'>
            {WELNESS_SCORE_EMOJIS?.map((emoji, index) => (
              <div className='ai-wellness-score-emoji' key={`emoji-${index}`}>
                <EmojisIcon kind={emoji.kind} height={60} width={60} />
              </div>
            ))}
          </div>
          <div className='ai-wellness-score-indicator'>
            {WELNESS_SCORE_CONFIG?.map((config, index) => (
              <div
                key={`config-color-${index}`}
                className='ai-wellness-score-indicator-item'
                style={{ backgroundColor: config.color }}
              ></div>
            ))}
            <div
              className='ai-wellness-indicator-pointer'
              style={{
                left: `${getIndicatorPosition(
                  vitalSigns?.wellnessLevel?.value
                )}%`
              }}
            >
              <WellnessIndicatorIcon />
            </div>
          </div>
          <div className='ai-wellness-score'>
            {vitalSigns?.wellnessLevel?.value ?? 0}/10
          </div> */}
          <div className='ai-wellness-score-description'>
            The measured indicators are not intended for medical use.
          </div>
        </div>
        <div className='ai-wellness-metadata'>
          {WELLNESS_META_DATA?.map((meta) => (
            <WellnessTrackerCard
              key={meta.title}
              title={meta.title}
              icon={meta.icon}
              startColor={meta.startColor}
              endColor={meta.endColor}
              measurementValue={getWellnessValue(
                vitalSigns,
                meta.measurementValue
              )}
              measurementUnit={meta.measurementUnit}
              indicatorColor={getIndicatorColor(
                vitalSigns,
                meta.measurementValue
              )}
            />
          ))}
        </div>
        <button className='ai-track-wellness-btn' onClick={handleStartScan}>
          Start Scan
        </button>
        {isScrollBtnVisible && (
          <div className='more-content-indicator' onClick={scrollToBottom}>
            <div className='more-content-indicator-icon'>
              <ArrowDownIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

WellnessTrackerDetails.propTypes = {
  handleStart: PropTypes.func.isRequired,
  vitalSigns: PropTypes.shape({
    wellnessLevel: PropTypes.shape({
      value: PropTypes.number
    }),
    pulseRate: PropTypes.shape({
      value: PropTypes.number
    }),
    bloodPressure: PropTypes.shape({
      value: PropTypes.shape({
        systolic: PropTypes.number,
        diastolic: PropTypes.number
      })
    }),
    stress: PropTypes.shape({
      value: PropTypes.number
    }),
    respirationRate: PropTypes.shape({
      value: PropTypes.number
    }),
    hemoglobin: PropTypes.shape({
      value: PropTypes.number
    })
  }).isRequired
}

export default WellnessTrackerDetails
