import React, { useState, useEffect } from 'react'
import Joyride, { STATUS } from 'react-joyride'
import PropTypes from 'prop-types'
import SpotlightOverlay from './SpotlightOverlay'
import './CustomJoyride.css'
import { useAppContext } from '../../context/AppContext'
import { useTenantConfig } from '../../useTenantConfig'
import { getConfigForHostname } from '../../helpers/tenantHelper'
import { trackEvent } from '../../helpers/analyticsHelper'

const { tenant } = getConfigForHostname()

const Tooltip = ({
  stepIndex,
  total,
  onNext,
  onSkip,
  isLastStep,
  step,
  showIndex
}) => {
  const placement = step.placement || 'bottom'

  const arrowStyles = {
    position: 'absolute',
    left: step?.leftArrow,
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent'
  }

  if (placement === 'top') {
    arrowStyles.borderTop = '8px solid white'
    arrowStyles.top = '100%'
  } else if (placement === 'bottom') {
    arrowStyles.borderBottom = '8px solid white'
    arrowStyles.bottom = '100%'
  }

  return (
    <div className={`tooltip-wrapper ${placement}`}>
      <div className='tooltip-description-wrapper'>
        <div className='tooltip-header'>
          <span className='tooltip-title'>{step?.title}</span>
          {showIndex && (
            <span className='tooltip-step'>
              {stepIndex + 1}/{total}
            </span>
          )}
        </div>

        <div className='tooltip-desc'>{step?.content}</div>

        <div className={`custom-footer ${isLastStep ? 'last' : ''}`}>
          {!isLastStep && (
            <button className='custom-skip' onClick={onSkip}>
              {step?.skipCTAText}
            </button>
          )}
          <button className='custom-next' onClick={onNext}>
            {step?.nextCTAText}
          </button>
        </div>
      </div>

      {/* Custom arrow */}
      <div className='custom-arrow' style={arrowStyles} />
    </div>
  )
}

Tooltip.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  step: PropTypes.shape({
    placement: PropTypes.string,
    leftArrow: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    skipCTAText: PropTypes.string,
    nextCTAText: PropTypes.string
  }).isRequired,
  showIndex: PropTypes.bool
}

const CustomJoyride = ({ steps, storageKey, onFinish, showIndex = true }) => {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [spotlightStyle, setSpotlightStyle] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0 })
  const { authorizationId, appVersion } = useAppContext()
  const tenantLayout = useTenantConfig(tenant)
  const maxRetries = 10
  const retryDelay = 100

  const startTour = () => {
    if (steps && steps.length > 0) {
      const alreadyCompleted = storageKey
        ? localStorage.getItem(storageKey) === 'true'
        : false
      if (!alreadyCompleted) {
        // Google Analytics
        if (authorizationId) {
          const properties = {
            external_id: authorizationId,
            feature_name: storageKey,
            app_version: appVersion,
            tenant: tenant,
            explore_version: tenantLayout?.exploreVersion || 'V4',
            event_source: 'podcast_page'
          }
          trackEvent('app_coachmark_navigation_user_impression', properties)
        }
        setRun(true)
      }
    }
  }

  useEffect(() => {
    if (document.readyState === 'complete') {
      startTour()
    } else {
      const handleLoad = () => {
        startTour()
      }
      window.addEventListener('load', handleLoad)

      return () => {
        window.removeEventListener('load', handleLoad)
      }
    }
    // eslint-disable-next-line
  }, [steps, storageKey])

  useEffect(() => {
    const currentStep = steps[stepIndex]
    if (!currentStep) return

    const checkElementAvailability = (retries) => {
      const element = document.querySelector(currentStep.target)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })

        setTimeout(() => {
          const rect = element.getBoundingClientRect()
          const radius = currentStep.spotlightRadius || 60

          setSpotlightStyle({
            top: rect.top + rect.height / 2 - radius,
            left: rect.left + rect.width / 2 - radius,
            size: radius * 2
          })

          setTooltipPosition({
            top: rect.top + rect.height + (currentStep.tooltipOffset || 20)
          })
        }, 300)
      } else if (retries < maxRetries) {
        setTimeout(() => checkElementAvailability(retries + 1), retryDelay)
      }
    }

    checkElementAvailability(0)
  }, [stepIndex, steps])

  useEffect(() => {
    if (run) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [run])

  const completeTour = () => {
    if (storageKey) {
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          feature_name: storageKey,
          app_version: appVersion,
          tenant: tenant,
          explore_version: tenantLayout?.exploreVersion || 'V4',
          event_source: 'podcast_page'
        }
        trackEvent('app_coachmark_navigation_user_journey_complete', properties)
      }
      localStorage.setItem(storageKey, 'true')
    }
    onFinish && onFinish()
  }

  const handleJoyrideCallback = ({ status }) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false)
      setStepIndex(0)
      setSpotlightStyle(null)
      completeTour()
    }
  }

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1)
    } else {
      setRun(false)
      setStepIndex(0)
      setSpotlightStyle(null)
      completeTour()
    }
  }

  const handleSkip = () => {
    setRun(false)
    setStepIndex(0)
    setSpotlightStyle(null)
    completeTour()
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous={false}
        showSkipButton={false}
        showProgress
        disableOverlayClose
        showDefaultBeacon={false}
        scrollToFirstStep
        scrollOffset={100}
        disableScrolling
        callback={handleJoyrideCallback}
        tooltipComponent={() => (
          <div
            style={{
              position: 'absolute',
              top: `${tooltipPosition.top}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              animation: 'tooltipFadeIn 0.3s ease-out'
            }}
          >
            <Tooltip
              stepIndex={stepIndex}
              total={steps.length}
              onNext={handleNext}
              onSkip={handleSkip}
              isLastStep={stepIndex === steps.length - 1}
              step={steps[stepIndex]}
              showIndex={showIndex}
            />
          </div>
        )}
        styles={{
          options: {
            overlayColor: 'rgba(0, 0, 0, 0)',
            zIndex: 999
          }
        }}
      />

      {run && spotlightStyle && (
        <SpotlightOverlay
          top={spotlightStyle.top}
          left={spotlightStyle.left}
          size={spotlightStyle.size}
        />
      )}
    </>
  )
}

CustomJoyride.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      target: PropTypes.string.isRequired,
      spotlightRadius: PropTypes.number,
      tooltipOffset: PropTypes.number,
      placement: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
      leftArrow: PropTypes.string,
      skipCTAText: PropTypes.string,
      nextCTAText: PropTypes.string
    })
  ).isRequired,
  storageKey: PropTypes.string,
  onFinish: PropTypes.func,
  showIndex: PropTypes.bool
}

export default CustomJoyride
