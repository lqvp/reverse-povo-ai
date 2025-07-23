import React, { useEffect, useState } from 'react'
import { Radio, FormControlLabel, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import { getUpdatedStats } from '../../../../../helpers/pollingGameHelper'

const OptionCard = React.forwardRef(
  ({ option, selectedOption, optionId, currentStats }, ref) => {
    return (
      <div
        ref={ref}
        className={`ai-ws-aistore-poll-section-option-card-sublayout ${
          selectedOption === optionId ? 'selected' : ''
        }`}
      >
        <FormControlLabel
          control={<Radio icon={<></>} checkedIcon={<></>} />}
          label={
            <div
              className={`ai-ws-aistore-poll-section-option-label-sublayout ${
                selectedOption === optionId ? 'selected' : ''
              }`}
            >
              <div
                className={`ai-ws-aistore-poll-section-option-text-sublayout ${
                  selectedOption === optionId ? 'selected' : ''
                }`}
              >
                {option}
              </div>
              {currentStats && selectedOption && (
                <div className='ai-ws-aistore-poll-section-percent-count-sublayout'>
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
  currentStats: PropTypes.object
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
  const { t } = useTranslation('common')

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
    <div className='ai-ws-aistore-poll-section-container-sublayout'>
      <div className='ai-ws-aistore-poll-section-question-sublayout'>
        {question?.text_en}
      </div>
      <div className='ai-ws-ai-store-poll-section-option-wrapper-sublayout'>
        <div className='ai-ws-aistore-poll-section-description-sublayout'>
          {t('riddlePolls.chooseAnAnswerToRevealTheResults')}
        </div>
        <div className='ai-ws-aistore-poll-section-desc-option-wrapper-sublayout'>
          <RadioGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              borderRadius: '7px',
              gap: '.25rem',
              overflow: 'auto'
            }}
            className='ai-ws-aistore-poll-section-radio-group-sublayout'
            value={selectedOption}
            onChange={(e) => handleOptionChange(e.target.value)}
          >
            {question?.option?.map((item, index) => (
              <OptionCard
                key={`${item?.option_id} ${index}`}
                option={item?.text_en}
                selectedOption={selectedOption}
                optionId={item?.option_id}
                currentStats={currentStats}
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
