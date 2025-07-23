import React, { useEffect, useRef, useState } from 'react'
import { Radio, FormControlLabel, RadioGroup } from '@mui/material'
import { getUpdatedStats } from '../../../../helpers/pollingGameHelper'
import { RIDDLE_POLL_LAYOUT } from '../../../../common/constants'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const pollingGameLayout = RIDDLE_POLL_LAYOUT['poll']

const OptionCard = React.forwardRef(
  (
    { option, selectedOption, optionId, currentStats, pollingGameLayout },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`aistore-poll-section-option-card ${
          selectedOption === optionId ? 'selected' : ''
        }`}
        style={{
          backgroundColor:
            selectedOption === optionId ? pollingGameLayout?.tabActiveColor : ''
        }}
      >
        <FormControlLabel
          control={<Radio icon={<></>} checkedIcon={<></>} />}
          label={
            <div
              className={`aistore-poll-section-option-label ${
                selectedOption === optionId ? 'selected' : ''
              }`}
            >
              <div
                className={`aistore-poll-section-option-text ${
                  selectedOption === optionId ? 'selected' : ''
                }`}
              >
                {option}
              </div>
              {currentStats && selectedOption && (
                <div className='aistore-poll-section-percent-count'>
                  {Math.round(
                    (currentStats[optionId] / currentStats.total) * 100
                  ) || 0}
                  %
                </div>
              )}
            </div>
          }
          value={optionId}
          checked={selectedOption === optionId}
        />
      </div>
    )
  }
)
OptionCard.displayName = 'OptionCard'

OptionCard.propTypes = {
  option: PropTypes.string.isRequired,
  selectedOption: PropTypes.string,
  optionId: PropTypes.string.isRequired,
  currentStats: PropTypes.object,
  pollingGameLayout: PropTypes.object.isRequired
}

const PollingCard = ({
  question,
  handleUserResponse,
  userResponse,
  responseStats,
  pollId,
  externalId
}) => {
  const [selectedOption, setSelectedOption] = useState('')
  const [currentStats, setCurrentStats] = useState()
  const [dividerTop, setDividerTop] = useState(0)
  const firstCardRef = useRef(null)
  const secondCardRef = useRef(null)
  const { t } = useTranslation('common')

  useEffect(() => {
    const updateDividerTop = () => {
      if (firstCardRef.current && secondCardRef.current) {
        const firstRowHeight = Math.max(
          firstCardRef.current.clientHeight,
          secondCardRef.current.clientHeight
        )
        setDividerTop(firstRowHeight)
      }
    }

    // Initial calculation
    updateDividerTop()

    // Use ResizeObserver to handle dynamic content changes
    const observer = new ResizeObserver(updateDividerTop)
    if (firstCardRef.current) observer.observe(firstCardRef.current)
    if (secondCardRef.current) observer.observe(secondCardRef.current)

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect()
    }
  }, [question])

  const handleOptionChange = (optionId) => {
    if (selectedOption) return
    const properties = {
      external_id: externalId,
      poll_id: pollId,
      question_id: question?.question_id,
      app_name: 'riddles_app'
    }
    trackEvent(`poll_option_click`, properties)
    setSelectedOption(optionId)
    getUpdatedStats(optionId, responseStats, setCurrentStats)
    handleUserResponse({
      question_id: question?.question_id,
      option_id: optionId
    })
  }

  useEffect(() => {
    if (userResponse) {
      setSelectedOption(userResponse?.option_id ?? '')
    }
  }, [userResponse])

  useEffect(() => {
    setCurrentStats(responseStats)
  }, [responseStats, question.question_id])

  return (
    <div className='aistore-poll-section-container'>
      <div className='aistore-poll-section-question'>{question?.text_en}</div>
      <div className='ai-store-poll-section-option-wrapper'>
        <div className='aistore-poll-section-description'>
          {t('riddlePolls.chooseAnAnswerToRevealTheResults')}
        </div>
        <div className='aistore-poll-section-desc-option-wrapper'>
          <RadioGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              borderRadius: '7px',
              border: `1px solid ${pollingGameLayout?.secondaryColor}`,
              position: 'relative',
              overflow: 'auto'
            }}
            className='aistore-poll-section-radio-group'
            value={selectedOption}
            onChange={(e) => handleOptionChange(e.target.value)}
          >
            {question?.option?.length > 2 && (
              <div
                className='aistore-poll-section-divider-horizontal'
                style={{ top: `${dividerTop}px` }}
              ></div>
            )}
            <div className='aistore-poll-section-divider-vertical'></div>
            {question?.option?.map((item, index) => (
              <OptionCard
                key={item?.option_id}
                ref={
                  index === 0
                    ? firstCardRef
                    : index === 1
                      ? secondCardRef
                      : null
                }
                option={item?.text_en}
                selectedOption={selectedOption}
                optionId={item?.option_id}
                currentStats={currentStats}
                pollingGameLayout={pollingGameLayout}
              />
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

PollingCard.propTypes = {
  question: PropTypes.object.isRequired,
  handleUserResponse: PropTypes.func.isRequired,
  userResponse: PropTypes.object,
  responseStats: PropTypes.object,
  pollId: PropTypes.string.isRequired,
  externalId: PropTypes.string.isRequired
}

export default PollingCard
