import React, { useEffect, useState } from 'react'
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_ERROR_RESPONSE } from '../../../../common/constants'
import common from '@kelchy/common'
import { fetchPostMethod } from '../../../../utils/axios'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Loader from '../../../Loader/Loader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'
import { parseStreamData } from '../../../../utils/converter'
import SystemTypeWriting from '../../AIChatbox/SystemTypeWriting'

const AIStoreSearchBannerChatBot = () => {
  const [historyMessages, setHistoryMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [appData, setAppData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [historyContextId, setHistoryContextId] = useState('')
  const [isNFSWContent, setIsNFSWContent] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    if (location.state) {
      setAppData(location.state)
      handlePromptSubmit(null, location.state?.initialPrompt)
    }
    // eslint-disable-next-line
  }, [location.state])

  useEffect(() => {
    const msgContainer = document.querySelector('.ai-chatbox-messages')
    const lastChild = msgContainer?.lastElementChild
    lastChild?.scrollIntoView({ behavior: 'smooth' })
  }, [historyMessages, userInput])

  const handlePromptSubmit = async (
    event,
    prompt = userInput,
    type = 'text'
  ) => {
    event?.preventDefault()
    if (prompt.trim() === '') return

    const userMessage = { key: 'user', text: prompt }
    setHistoryMessages([...(historyMessages || []), userMessage])

    const formData = new FormData()
    formData.append('feature_id', '')
    formData.append('request_type', type)
    formData.append('user_prompt', prompt)
    formData.append('context_id', historyContextId)

    setIsLoading(true)
    const { data: chatBotResponse, error: chatBotError } =
      await common.awaitWrap(
        fetchPostMethod('/chatbot/completions', formData, {}, true)
      )
    setIsLoading(false)
    if (isNFSWContent) setIsNFSWContent(false)
    if (!chatBotResponse.body || chatBotError) {
      let systemMessage = API_ERROR_RESPONSE.generic_error
      if (chatBotError?.response?.data?.error?.error_code) {
        const error_code = chatBotError.response.data.error.error_code
        if (API_ERROR_RESPONSE[error_code]) {
          systemMessage = API_ERROR_RESPONSE[error_code]
        }
      }
      const systemMessageObj = {
        key: 'system',
        text: `### Answer \n\n ${systemMessage}`
      }
      setHistoryMessages((prevMessages) => [...prevMessages, systemMessageObj])
    }
    if (chatBotResponse.body) {
      const reader = chatBotResponse.body.getReader()
      const decoder = new TextDecoder()
      let fullResponseContent = ''
      let lastLength = 0
      // Add a new system message once at the start
      setHistoryMessages((prevMessages) => [
        ...prevMessages,
        { key: 'system', text: '### Answer \n\n ' } // Empty message, will update later
      ])

      let streamComplete = false
      while (!streamComplete) {
        const { value, done: isDone } = await reader.read()
        streamComplete = isDone

        const responseChunk = decoder.decode(value, { stream: true })
        const responseStream = parseStreamData(responseChunk)
        let isFlaggedContent = false
        if (responseStream?.text) {
          fullResponseContent += responseStream.text
        }
        if (responseStream?.json) {
          const responseData = responseStream.json
          const responseCode = responseData?.data?.status?.code
          if (responseCode === 422) {
            fullResponseContent = responseData.data.response.content
            isFlaggedContent = true
            setIsNFSWContent(true)
            setHistoryContextId(responseData?.data?.response?.context_id || '')
          } else if (responseCode === 200) {
            setHistoryContextId(responseData?.data?.response?.context_id || '')
          }

          // check if error message exists
          const errorMessage = responseData?.error?.message
          if (errorMessage) {
            fullResponseContent = API_ERROR_RESPONSE.generic_error
            const error_code = responseData.error?.error_code
            if (API_ERROR_RESPONSE[error_code]) {
              fullResponseContent = API_ERROR_RESPONSE[error_code]
            }
          }
          streamComplete = true
        }

        // Extract only the newly added text
        const newResponseChunk = fullResponseContent.slice(lastLength)
        const updatedFullResponse = fullResponseContent // Capture value in a constant
        lastLength = fullResponseContent.length // Update last recorded length
        setHistoryMessages((prevMessages) =>
          prevMessages.map((msg, index) => {
            if (index === prevMessages.length - 1) {
              return {
                ...msg,
                text: isFlaggedContent
                  ? updatedFullResponse
                  : msg.text + newResponseChunk // Use the captured constant
              }
            }
            return msg
          })
        )
      }
    }
    setUserInput('')
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  useEffect(() => {
    const msgContainer = document.querySelector('.ai-search-chatbox-messages')
    const lastChild = msgContainer?.lastElementChild
    lastChild?.scrollIntoView({ behavior: 'smooth' })
  }, [historyMessages])

  return (
    <div className='ai-search-chatbox-container'>
      {isLoading && <Loader />}
      <div className='ai-search-chatbot-app-header'>
        <div
          className='ai-search-chatbot-app-back-icon'
          onClick={handleBackClick}
        >
          <ArrowBackIosNewIcon
            fontSize='small'
            style={{ fill: '#000' }}
          ></ArrowBackIosNewIcon>
        </div>
        <div className='ai-search-chatbot-app-name'>
          {appData?.title || t('aiApps.aiSearch')}
        </div>
      </div>
      <div className='ai-search-chatbox-body-container'>
        <div className='ai-search-chatbox-messages'>
          {historyMessages?.map((message, index) => (
            <div key={index} className='ai-search-chatbox-message-container'>
              <div
                className={`ai-search-chatbox-message ${
                  message?.key === 'user'
                    ? 'ai-search-chatbox-user-message'
                    : 'ai-search-chatbox-system-message'
                }`}
              >
                {message.key === 'user' ? (
                  <SystemTypeWriting
                    text={message?.text.replace(/\[\d+\]/g, '') || ''}
                    isNFSWContent={isNFSWContent}
                  />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message?.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <form className='ai-search-chatbox-input' onSubmit={handlePromptSubmit}>
        <input
          type='text'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t('aiApps.landingPage.searchBanner.inputPlaceholder')}
        />
        <button type='submit'>
          <ArrowForwardIcon fontSize='medium' style={{ fill: '#fff' }} />
        </button>
      </form>
    </div>
  )
}

export default AIStoreSearchBannerChatBot
