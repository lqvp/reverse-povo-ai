import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import DefaultPromptsCarousel from './DefaultPromptsCarousel/DefaultPromptsCarousel'
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../../Loader/Loader'
import common from '@kelchy/common'
import { axiosGet, fetchPostMethod } from '../../../../utils/axios'
import {
  AIChatbotDefaultAppOptionsKeys,
  AIChatbotDefaultAppOptions,
  API_ERROR_RESPONSE,
  BASIC_UI_CONFIG,
  convertTextUnderscorePipe,
  environmentType
} from '../../../../common/constants'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatBotIcon } from '../../../../static/imageSvg'
import MicNoneIcon from '@mui/icons-material/MicNone'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { formatTimeToHHMMSS } from '../../../../helpers/helperFunctions'
import {
  getConfigForHostname,
  getTenantName,
  tenantObject
} from '../../../../helpers/tenantHelper'
import { useTranslation } from 'react-i18next'
import { isAgentIOS, parseStreamData } from '../../../../utils/converter'
import PropTypes from 'prop-types'
import SystemTypeWriting from '../../AIChatbox/SystemTypeWriting'
import { useTenantConfig } from '../../../../useTenantConfig'
import * as StyledComponents from 'styled-components'

const defaultPromptType = 'text'
const isNavigatorAgentIOS = isAgentIOS()

const tenant = getTenantName()
const { environment } = getConfigForHostname()

const ChatbotAppHeader = StyledComponents.styled.div`
  font-family: ${(props) => props.fontFamily || 'Inter, sans-serif'} !important;
`

export const DefaultUserOptions = ({
  uiConfigs,
  defaultAppOptions,
  handleDefaultOptionClicked
}) => {
  return (
    <div
      key='default-options'
      className='chatbox-message-container system-message-container'
    >
      <div className='system-message-bot-icon-container'>
        <ChatBotIcon
          bgColor={uiConfigs?.chatIconBgColor}
          borderColor={uiConfigs?.chatSubmitButtonColor}
        />
      </div>
      {defaultAppOptions ? (
        <div
          className='chatbox-message system-default-options-wrapper'
          style={{ background: uiConfigs?.chatIconBgColor }}
        >
          {defaultAppOptions.question}
          {defaultAppOptions.options?.map((option) => {
            if (option?.key === 'file' && tenant === tenantObject.tselhalo) {
              return null
            }
            return (
              <div
                key={option?.key}
                className='system-default-option'
                onClick={() => handleDefaultOptionClicked(option)}
              >
                {option?.value}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

const AIStoreAppsChatBot = () => {
  const [historyMessages, setHistoryMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [userResponse, setUserResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDefaultOptions, setShowDefaultOptions] = useState(false)
  const [defaultAppOptions, setDefaultAppOptions] = useState(null)
  const [selectedDefaultPromptType, setSelectedDefaultPromptType] =
    useState(defaultPromptType)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef(null)
  const [deleteRecording, setDeleteRecording] = useState(false)
  const [historyContextId, setHistoryContextId] = useState('')
  const [isNFSWContent, setIsNFSWContent] = useState(false)
  const { t } = useTranslation('common')
  const { tenant } = getConfigForHostname()
  const tenantLayout = useTenantConfig(tenant)

  // Clear timer and reset state
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRecordingTime(0)
  }

  const uiConfigs = userResponse?.category_id
    ? BASIC_UI_CONFIG[userResponse?.category_id]
    : BASIC_UI_CONFIG.default

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const appName = searchParams.get('appName')

    if (appName) {
      setIsLoading(true)
      const fetchAppData = async () => {
        const { data: featureData } = await common.awaitWrap(
          axiosGet('/chatbot/single-feature', {
            params: { feature_id: convertTextUnderscorePipe(appName) }
          })
        )

        if (featureData?.data) {
          setUserResponse(featureData.data)
          const showDefaultOptions = AIChatbotDefaultAppOptionsKeys?.includes(
            featureData.data?.feature_id
          )
          setShowDefaultOptions(showDefaultOptions)
          if (showDefaultOptions) {
            setDefaultAppOptions(
              AIChatbotDefaultAppOptions[featureData.data?.feature_id]
            )
          }
        }
        setIsLoading(false)
      }
      fetchAppData()
    } else if (location.state) {
      setUserResponse(location.state)
      const showDefaultOptions = AIChatbotDefaultAppOptionsKeys?.includes(
        location.state?.feature_id
      )
      setShowDefaultOptions(showDefaultOptions)
      if (showDefaultOptions) {
        setDefaultAppOptions(
          AIChatbotDefaultAppOptions[location.state?.feature_id]
        )
      }
    }
  }, [location.search, location.state])

  useEffect(() => {
    const msgContainer = document.querySelector('.chatbox-messages')
    const lastChild = msgContainer?.lastElementChild
    lastChild?.scrollIntoView({ behavior: 'smooth' })
  }, [historyMessages])

  useEffect(() => {
    return () => {
      resetTimer()
    }
  }, [])

  const handleDefaultOptionClicked = (option) => {
    const properties = {
      external_id: authorizationId,
      option_name: option?.key,
      product_name: userResponse?.feature_id,
      app_name: 'ai_chatbot'
    }
    trackEvent('chat_summarise_prompt_click', properties)

    setShowDefaultOptions(false)
    setSelectedDefaultPromptType(option?.key)
    if (option.key === 'file') {
      document.getElementById('fileInput').click()
      const userMessage = {
        key: 'user',
        text: `${defaultAppOptions?.question} \n **${option?.value}**`
      }
      setHistoryMessages([...(historyMessages || []), userMessage])
    } else {
      const userMessage = {
        key: 'user',
        text: `${defaultAppOptions?.question} \n **${option?.value}**`
      }
      const systemMessage = { key: 'system', text: option?.response }
      setHistoryMessages([
        ...(historyMessages || []),
        userMessage,
        systemMessage
      ])
    }
  }

  const handlePromptSubmit = async (
    event,
    prompt = userInput,
    type = selectedDefaultPromptType,
    file = uploadedFile,
    fileName = ''
  ) => {
    event?.preventDefault()
    if (prompt.trim() === '' && !file) return

    if (type === 'file' && file && fileName) {
      const userMessage = { key: 'user', text: fileName }
      setHistoryMessages([...(historyMessages || []), userMessage])
    } else {
      const userMessage = { key: 'user', text: prompt }
      setHistoryMessages([...(historyMessages || []), userMessage])
    }

    const formData = new FormData()
    formData.append('feature_id', userResponse?.feature_id || '')
    formData.append('request_type', type)
    formData.append('user_prompt', prompt)
    formData.append('context_id', historyContextId)
    if (type === 'file' && file) {
      formData.append('file', file)
    } else if (type === 'audio' && file) {
      const properties = {
        external_id: authorizationId,
        product_name: userResponse?.feature_id,
        app_name: 'ai_chatbot'
      }
      trackEvent('voice_support_recording_submitted', properties)
      formData.append('file', file, 'recording.mp3')
    }

    setIsLoading(true)
    const { data: chatBotResponse, error: chatBotError } =
      await common.awaitWrap(
        fetchPostMethod('/chatbot/completions', formData, {}, true)
      )

    setIsLoading(false)
    setUserInput('')
    if (isNFSWContent) setIsNFSWContent(false)
    if (!chatBotResponse.body || chatBotError) {
      const systemMessage = {
        key: 'system',
        text: API_ERROR_RESPONSE.generic_error
      }
      setHistoryMessages((prevMessages) => [...prevMessages, systemMessage])
    }
    if (chatBotResponse.body) {
      const reader = chatBotResponse.body.getReader()
      const decoder = new TextDecoder()
      let fullResponseContent = ''
      let lastLength = 0
      // Add a new system message once at the start
      setHistoryMessages((prevMessages) => [
        ...prevMessages,
        { key: 'system', text: '' } // Empty message, will update later
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
            if (type === 'audio' && responseData.data.response?.user_prompt) {
              const properties = {
                external_id: authorizationId,
                product_name: userResponse?.feature_id,
                app_name: 'ai_chatbot'
              }
              trackEvent('voice_support_response_success', properties)
              const updatedFullResponse = fullResponseContent
              setHistoryMessages((prevMessages) => {
                if (prevMessages.length < 2) return prevMessages
                const updatedMessages = [...prevMessages]
                updatedMessages[updatedMessages.length - 2] = {
                  ...updatedMessages[updatedMessages.length - 2],
                  text: responseData?.data?.response?.user_prompt
                }
                updatedMessages[updatedMessages.length - 1] = {
                  ...updatedMessages[updatedMessages.length - 1],
                  text: updatedFullResponse
                }

                return updatedMessages
              })
            }
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
            if (responseData?.error?.error_details?.request_type === 'audio') {
              const properties = {
                external_id: authorizationId,
                product_name: userResponse?.feature_id,
                app_name: 'ai_chatbot'
              }
              trackEvent('voice_support_response_error', properties)
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
    setSelectedDefaultPromptType(
      defaultAppOptions?.keepContext ? type : defaultPromptType
    )
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSelectPrompt = (prompt) => {
    const properties = {
      external_id: authorizationId,
      product_name: userResponse?.feature_id,
      prompt_id: prompt?.label,
      app_name: 'ai_chatbot'
    }
    trackEvent('chat_prompt_click', properties)
    handlePromptSubmit(null, prompt?.content)
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const fileName = event.target.files[0]?.name
    setUploadedFile(file)
    handlePromptSubmit(
      null,
      'Provide the summary of the document',
      'file',
      file,
      fileName
    )
  }

  const handleStartRecording = () => {
    if (deleteRecording) {
      setDeleteRecording(false)
    }
    resetTimer()

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Your browser does not support audio recording.')
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstart = () => {
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1)
        }, 1000)
        setIsRecording(true)
      }

      mediaRecorder.onstop = () => {
        setIsRecording(false)

        // Check if audioChunksRef.current has any elements
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/mp3'
          })
          // Pass the audio blob to handlePromptSubmit
          handlePromptSubmit(null, '', 'audio', audioBlob)
        }
        // Clear the audio chunks after processing
        audioChunksRef.current = []
      }

      mediaRecorder.onerror = (event) => {
        console.error('Recording error:', event.error)
        setIsRecording(false)
      }

      mediaRecorder.start()
    })
  }

  const handleDeleteRecording = () => {
    setIsRecording(false)
    resetTimer()
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      audioChunksRef.current = []
      setDeleteRecording(true)
    }
  }

  const handleSubmitRecording = () => {
    resetTimer()
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className='chatbox-container'>
      {isLoading && <Loader />}
      <ChatbotAppHeader
        className='chatbot-app-header'
        fontFamily={tenantLayout?.aiChatBox?.fontFamily}
      >
        <div className='chatbot-app-back-icon' onClick={handleBackClick}>
          <ArrowBackIosNewIcon
            fontSize='small'
            style={{ fill: '#000' }}
          ></ArrowBackIosNewIcon>
        </div>
        <div className='chatbot-app-name'>{userResponse?.title}</div>
      </ChatbotAppHeader>
      <div className='chatbox-body-container'>
        {!historyMessages?.length && !showDefaultOptions ? (
          <div className='chatbox-empty-chat-container'>
            <div className='chatbox-placeholder-container'>
              <img
                src={userResponse?.icon_url}
                alt=''
                className='chatbox-placeholder-icon'
                style={{
                  background: uiConfigs?.chatIconBgColor
                }}
              />
              <div className='chatbot-description'>
                {userResponse?.description}
              </div>
            </div>
            <div className='default-prompts-carousel'>
              <DefaultPromptsCarousel
                defaultPrompts={userResponse?.suggested_prompts}
                onSelectPrompt={handleSelectPrompt}
                uiConfigs={uiConfigs}
              />
            </div>
          </div>
        ) : (
          <div className='chatbox-messages'>
            {showDefaultOptions && !historyMessages?.length && (
              <DefaultUserOptions
                uiConfigs={uiConfigs}
                defaultAppOptions={defaultAppOptions}
                handleDefaultOptionClicked={handleDefaultOptionClicked}
              />
            )}
            {historyMessages?.map((message, index) => (
              <div
                key={index}
                className={`chatbox-message-container ${
                  message?.key === 'user'
                    ? 'user-message-container'
                    : 'system-message-container'
                }`}
              >
                {message?.key !== 'user' ? (
                  <>
                    <div className='system-message-bot-icon-container'>
                      <ChatBotIcon
                        bgColor={uiConfigs?.chatIconBgColor}
                        borderColor={uiConfigs?.chatSubmitButtonColor}
                      />
                    </div>
                    <div className='chatbox-message system-message'>
                      <SystemTypeWriting
                        text={message?.text.replace(/\[\d+\]/g, '') || ''}
                        isNFSWContent={isNFSWContent}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    className='chatbox-message user-message'
                    style={{
                      background: uiConfigs?.chatIconBgColor
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message?.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {isRecording ? (
        <div className='chatbot-recording-bar-container'>
          <div
            className='chatbot-recording-bar'
            style={{
              backgroundColor: uiConfigs?.chatIconBgColor,
              color: uiConfigs?.chatSubmitButtonColor
            }}
          >
            <div
              className='chatbox-recording-delete-icon'
              style={{ backgroundColor: uiConfigs?.chatSubmitButtonColor }}
              onClick={handleDeleteRecording}
            >
              <DeleteOutlineIcon style={{ fill: uiConfigs?.chatIconBgColor }} />
            </div>
            <div className='chatbox-recording-input-desc'>{'Speak now...'}</div>
            <div className='chatbox-recording-input-desc'>
              {formatTimeToHHMMSS(recordingTime)}
            </div>
            <button
              style={{ backgroundColor: uiConfigs?.chatSubmitButtonColor }}
              onClick={handleSubmitRecording}
            >
              <ArrowUpwardIcon fontSize='medium' style={{ fill: '#fff' }} />
            </button>
          </div>
        </div>
      ) : (
        <form className='chatbox-input' onSubmit={handlePromptSubmit}>
          <div className='chatbox-input-wrapper'>
            <input
              type='text'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('aiApps.chatBot.message')}
            />
            {/* To be enabled only for onic ios and for sg both ios and android (Added Android Staging onic) */}
            {uiConfigs?.voiceSupport &&
              ((isNavigatorAgentIOS && tenant === tenantObject.onic) ||
                tenant === tenantObject.sgcircles ||
                (!isNavigatorAgentIOS &&
                  environment === environmentType.staging &&
                  tenant === tenantObject.onic)) && (
                <div
                  className='chatbox-microphone-icon-div'
                  onClick={handleStartRecording}
                >
                  <MicNoneIcon
                    style={{ fill: uiConfigs?.chatSubmitButtonColor }}
                  />
                </div>
              )}
          </div>
          <button
            type='submit'
            style={{ backgroundColor: uiConfigs?.chatSubmitButtonColor }}
          >
            <ArrowUpwardIcon fontSize='medium' style={{ fill: '#fff' }} />
          </button>
        </form>
      )}
      <input
        className='hidden-input'
        type='file'
        accept='.docx,.pdf,text/plain,.txt'
        id='fileInput'
        onChange={handleFileChange}
      />
    </div>
  )
}

DefaultUserOptions.propTypes = {
  uiConfigs: PropTypes.object.isRequired,
  defaultAppOptions: PropTypes.object,
  handleDefaultOptionClicked: PropTypes.func.isRequired
}

export default AIStoreAppsChatBot
