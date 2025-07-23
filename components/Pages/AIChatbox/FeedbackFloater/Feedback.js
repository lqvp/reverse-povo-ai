import React from 'react'
import AIChatboxIcon from '../../../../static/AIChatboxIcon'
import { useTranslation } from 'react-i18next'
import './Feedback.css'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const Feedback = () => {
  const { t } = useTranslation('common')
  const { tenant } = getConfigForHostname()
  const tenantLayout = useTenantConfig(tenant)
  const handleClick = () => {
    window.open(tenantLayout?.aiChatBox?.feedbackLink, '_blank')
  }
  return (
    <div className='ai-chatbox-feedback-wrapper' onClick={handleClick}>
      <div className='ai-chatbox-feedback-icon'>
        <AIChatboxIcon kind='chat-feedback' width={20} height={20} />
      </div>
      <div className='ai-chatbox-feedback-text'>
        {t('aiChatbox.feedbackMessage')}
      </div>
      <div className='ai-chatbox-feedback-icon'>
        <AIChatboxIcon kind='right-arrow' width={10} height={16} />
      </div>
    </div>
  )
}

export default Feedback
