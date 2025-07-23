import React from 'react'
import { Dialog, DialogContent } from '@mui/material'
import { MILESTONE_TEXT_DATA } from '../../../../common/milestoneConstant'
import PropTypes from 'prop-types'

const constantText = MILESTONE_TEXT_DATA

const MilestoneCompletionDialog = ({
  openCompletionDialog,
  navigateToExplore
}) => {
  return (
    <Dialog className='milestone-completion-dialog' open={openCompletionDialog}>
      <DialogContent>
        <div className='milestone-completion-container'>
          <div className='milestone-completion-icon'>
            <img
              src='/images/ai_milestone_quest/milestone_completion_err.png'
              alt='Gift_Icon'
            />
          </div>
          <h2>Sorry</h2>
          <p className='message'>
            All offers are claimed. Watch this space for the next challenge.
          </p>
          <div
            className='ai-store-milestone-lp-banner-back-cta'
            onClick={navigateToExplore}
          >
            <div className='ai-store-milestone-lp-banner-back-cta-text dialog'>
              {constantText?.dailyQuestCompleteCTA}
            </div>
            <div className='ai-store-milestone-lp-banner-back-cta-bar'></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

MilestoneCompletionDialog.propTypes = {
  openCompletionDialog: PropTypes.bool.isRequired,
  navigateToExplore: PropTypes.func.isRequired
}

export default MilestoneCompletionDialog
