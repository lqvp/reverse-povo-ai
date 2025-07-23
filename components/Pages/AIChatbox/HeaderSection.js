import React from 'react'
import PropTypes from 'prop-types'
import AIChatboxIcon from '../../../static/AIChatboxIcon'
import { getConfigForHostname } from '../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../useTenantConfig'
import styled from 'styled-components'
import BackButton from '../../../static/BackButton'
import AIChatboxHistoryPreview from './AIChatboxHistoryPreview/AIChatboxHistoryPreview'
import { TENANTS } from '../../../common/constants'
import { getAIChatboxLandingPagePath } from '../../../common/paths'

const ChatbotAppHeader = styled.div`
  font-family: ${(props) => props.fontFamily || 'Inter, sans-serif'} !important;
`
const supportedModels = {
  'gpt-4o': 'GPT-4o'
}

const HeaderSection = ({
  handleBackClick,
  modelsData,
  clearChat,
  headerLabel,
  showModelDetails,
  redirectURI,
  fetchAndSetHistoryMessages,
  isHistoryDrawerOpen,
  setIsHistoryDrawerOpen,
  isSublayout = false,
  activeContextId
}) => {
  const { tenant } = getConfigForHostname()
  const tenantLayout = useTenantConfig(tenant)
  const headerData =
    modelsData?.filter((model) => model.is_default && model.is_active)?.[0] ||
    supportedModels['gpt-4o']
  const pathname = window.location.pathname
  const hideAIChatboxLandingBackNav =
    tenant === TENANTS.POVO && pathname === getAIChatboxLandingPagePath()
  const redirectBack = (event, redirectURI) => {
    clearChat(event, redirectURI || '')
  }

  const redirectHandleBack = (event, redirectURI) => {
    handleBackClick(event, redirectURI || '')
  }

  return (
    <>
      <ChatbotAppHeader
        className='chatbot-app-header'
        fontFamily={tenantLayout?.aiChatBox?.fontFamily}
      >
        {!hideAIChatboxLandingBackNav ? (
          <div className='chatbot-app-back-icon'>
            <div onClick={(event) => redirectHandleBack(event, redirectURI)}>
              <BackButton
                color={tenantLayout?.aiChatBox?.backButtonColor}
                textVisible={false}
                spacing='0'
              />
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div className='chatbot-app-title-deco'>
          {headerLabel ? (
            headerLabel
          ) : (
            <>
              <div className='chatbot-app-title-icon'>
                <img
                  src={
                    headerData.icon_url
                      ? headerData.icon_url
                      : '/images/ai_chatbox/chatbox-ai-icon.png'
                  }
                  alt='chat-header-icon'
                  width={20}
                  height={20}
                />
              </div>

              <div className='chatbot-app-name'>{headerData.label}</div>
              <div
                className='chatbot-app-title-more-feature'
                onClick={showModelDetails}
              >
                <AIChatboxIcon kind='down-arrow' width={20} height={20} />
              </div>
            </>
          )}
        </div>

        <div className='chatbot-app-header-action'>
          <div
            className='chatbot-app-reset'
            onClick={(event) => redirectBack(event, redirectURI)}
          >
            <AIChatboxIcon kind='new-chat' width={24} height={24} />
          </div>
        </div>
      </ChatbotAppHeader>
      <AIChatboxHistoryPreview
        isDrawerOpen={isHistoryDrawerOpen}
        setIsDrawerOpen={setIsHistoryDrawerOpen}
        fetchAndSetHistoryMessages={fetchAndSetHistoryMessages}
        isSublayout={isSublayout}
        activeContextId={activeContextId}
      />
    </>
  )
}

HeaderSection.propTypes = {
  handleBackClick: PropTypes.func,
  modelsData: PropTypes.array,
  clearChat: PropTypes.func,
  headerLabel: PropTypes.string,
  showModelDetails: PropTypes.func,
  redirectURI: PropTypes.string,
  fetchAndSetHistoryMessages: PropTypes.func,
  isHistoryDrawerOpen: PropTypes.bool,
  setIsHistoryDrawerOpen: PropTypes.func,
  showHistoryIcon: PropTypes.bool,
  isSublayout: PropTypes.bool,
  activeContextId: PropTypes.string
}

export default HeaderSection
