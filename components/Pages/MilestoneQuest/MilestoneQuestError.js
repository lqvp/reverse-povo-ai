import React from 'react'
import PropTypes from 'prop-types'

const MilestoneQuestError = ({ errorMessage }) => {
  return (
    <div className='ai-store-milestone-error-container errored'>
      <div className='ai-store-milestone-error-content'>
        <p className='ai-store-milestone-error-banner-title'>
          {errorMessage ?? 'Something Went Wrong, Please try again later!'}
        </p>
      </div>
    </div>
  )
}

MilestoneQuestError.propTypes = {
  errorMessage: PropTypes.string
}

export default MilestoneQuestError
