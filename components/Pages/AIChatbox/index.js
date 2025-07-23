import React, { useEffect, useRef, useState } from 'react'
import {
  getConfigForHostname,
  getTenantName,
  tenantObject
} from '../../../helpers/tenantHelper'
import {
  getUserCurrentTimeandTimeZone,
  isAgentIOS,
  parseStreamData
} from '../../../utils/converter'
import { useAppContext } from '../../../context/AppContext'
import { useTranslation } from 'react-i18next'
import {
  AIChatbotDefaultAppOptions,
  AIChatbotDefaultAppOptionsKeys,
  API_ERROR_RESPONSE,
  BASIC_UI_CONFIG,
  convertTextUnderscorePipe,
  environmentType,
  TENANTS
} from '../../../common/constants'
import { axiosGet, axiosPost, fetchPostMethod } from '../../../utils/axios'
import common from '@kelchy/common'
import { trackEvent } from '../../../helpers/analyticsHelper'
import Loader from '../../Loader/Loader'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import MicNoneIcon from '@mui/icons-material/MicNone'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import './index.css'
import './ComingSoonFeatures/ComingSoon.css'
import {
  formatTimeToHHMMSS,
  getFileType
} from '../../../helpers/helperFunctions'
import HeaderSection from './HeaderSection'
import { useTenantConfig } from '../../../useTenantConfig'
import DefaultFeaturesList from './DefaultPromptsList'
import AIChatboxIcon from '../../../static/AIChatboxIcon'
import SystemTypeWriting from './SystemTypeWriting'
import Feedback from './FeedbackFloater/Feedback'
import PropTypes from 'prop-types'
import {
  copyTextToClipboard,
  shareTextMessages
} from '../../../helpers/mediaHelper'
import LoadingDots from './LoadingDots/LoadingDots'
import { styled } from '@mui/material/styles'
import {
  CircularProgress,
  FormControlLabel,
  Switch,
  TextareaAutosize
} from '@mui/material'
import ModelDetails from './ModelDetails/ModelDetails'
import DefaultPromptsCarousel from '../AIStoreApps/AIStoreAppsChatBot/DefaultPromptsCarousel/DefaultPromptsCarousel'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as StyledComponents from 'styled-components'
import { useAIChatboxContext } from '../../../context/AIChatboxContext'
import CustomJoyride from '../../Coachmark/CustomJoyride'
import { AIChatboxSteps } from '../../Coachmark/stepsConstant'
import DisclaimerModal from './DisclaimerModal/DisclaimerModal'
import TermsAndConditionsModal from './TermsConditionsModal/TermsConditionsModal'
import ChatOptionsList from './ChatOptionsList/ChatOptionsList'
import ImageGenrationLoader from './ImageGenrationLoader/ImageGenrationLoader'
import ImagePreviewer from './ImagePreviewer/ImagePreviewer'
import DeepResearchLoader from './DeepResearchLoader/DeepResearchLoader'
import Greeting from './Greetings'
import MaintenanceBanner from '../../MaintenanceBanner/MaintenanceBanner'

const AIChatboxContainer = StyledComponents.styled.div`
  font-family: ${(props) => props.fontFamily || 'Inter, sans-serif'} !important
`
const AIChatboxPlaceholderTitle = StyledComponents.styled.div`
font-family: ${(props) => props.fontFamily || 'Inter, sans-serif'} !important
`

const storageKey = 'aiChatboxCoachmarkSwitch'

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
      {defaultAppOptions ? (
        <div
          className='chatbox-message system-default-options-wrapper'
          style={{ background: uiConfigs?.chatIconBgColor }}
        >
          <div className='system-default-options-title'>
            {defaultAppOptions.question}
          </div>
          {defaultAppOptions.options?.map((option) => {
            if (option?.key === 'file' && tenant === tenantObject.tselhalo) {
              return null
            }
            return (
              <div
                key={option?.key}
                className='ai-system-default-option'
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

DefaultUserOptions.propTypes = {
  uiConfigs: PropTypes.object.isRequired,
  defaultAppOptions: PropTypes.object,
  handleDefaultOptionClicked: PropTypes.func.isRequired
}

const ChatboxUseWebSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('/images/ai_chatbox/ellipse_switch_toggle_blue.png')`,
        backgroundSize: 'cover'
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#5297FF',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5'
        })
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#FFF',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('/images/ai_chatbox/ellipse_switch_toggle_grey.png')`,
      backgroundSize: 'cover'
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892'
    })
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#C4C4C4',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5'
    })
  }
}))

const defaultPromptType = 'text'
const tenant = getTenantName()
const { environment } = getConfigForHostname()

const NonImageMediaFile = ({ data }) => {
  return (
    <div className='ai-chatbox-document-file-wrapper'>
      <div className='ai-chatbox-document-file-icon'>
        <AIChatboxIcon kind='document' width={32} height={32} />
      </div>
      <div className='ai-chatbox-document-file-info'>
        <div className='ai-chatbox-document-file-title'>Document</div>
        <div className='ai-chatbox-document-file-type'>
          {data?.type?.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

NonImageMediaFile.propTypes = {
  data: PropTypes.object
}

const AIChatbox = ({ isSublayout = false }) => {
  const location = useLocation()
  const [historyMessages, setHistoryMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [userResponse, setUserResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { chatboxFeatureId } = useParams()
  const [showDefaultOptions, setShowDefaultOptions] = useState(chatboxFeatureId)
  const [defaultAppOptions, setDefaultAppOptions] = useState(null)
  const [selectedDefaultPromptType, setSelectedDefaultPromptType] =
    useState(defaultPromptType)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const { authorizationId } = useAppContext()
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef(null)
  const [mediaURL, setMediaURL] = useState('')
  const [isNFSWContent, setIsNFSWContent] = useState(false)
  const [deleteRecording, setDeleteRecording] = useState(false)
  const { t } = useTranslation('common')
  const [promptInProgress, setPromptInProgress] = useState(false)
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false)
  const tenantLayout = useTenantConfig(tenant)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const aiChatboxWrapperRef = useRef(null)
  const aiChatboxContainerRef = useRef(null)
  const [upcomingModelDetails, setUpcomingModelDetails] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [historyContextId, setHistoryContextId] = useState('')
  const navigate = useNavigate()
  const isNavigatorAgentIOS = isAgentIOS()
  const {
    hideBackRedirectionBtn,
    setHideBackRedirectionBtn,
    searchGlobe,
    setSearchGlobe
  } = useAIChatboxContext()
  const redirectURI = location?.state?.from || ''
  const [showCoachmark, setShowCoachmark] = useState(false)
  const [openDisclaimerModal, setDisclaimerOpenModal] = useState(false)
  const [, setContextFillInProgress] = useState(false)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [openTermsConditionsModal, setOpenTermsConditionsModal] =
    useState(false)
  const [chatOptionsDrawerOpen, setChatOptionsDrawerOpen] = useState(false)
  const [currentChatOption, setCurrentChatOption] = useState(null)
  const [openImagePreviewUrl, setOpenImagePreviewUrl] = useState('')
  const [imageGeneratedLibUrl, setImageGeneratedLibUrl] = useState({})
  const [selfInitiateDefaultPrompt, setSelfInitiateDefaultPrompt] =
    useState(false)

  const [onMaintenance, setOnMaintenance] = useState(false)

  const onTermsAccepted = () => {
    setOpenTermsConditionsModal(false)
    setShowCoachmark(true)
  }

  useEffect(() => {
    setShowCoachmark(
      localStorage.getItem(storageKey) !== 'true' &&
        tenantLayout?.aiChatBox?.coachmarkEnabled &&
        location.pathname.includes('ai-chatbox')
    )

    // eslint-disable-next-line
  }, [tenantLayout?.aiChatBox?.coachmarkEnabled])

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
    if (authorizationId) {
      trackLandingEvent(authorizationId)
    }
    setHideBackRedirectionBtn(isSublayout)
    resetChatSettings()
    setIsLoading(true)
    fetchAppData(chatboxFeatureId)
    // eslint-disable-next-line
  }, [authorizationId, chatboxFeatureId])

  useEffect(() => {
    if (selfInitiateDefaultPrompt && userResponse?.suggested_prompts) {
      handlePromptSubmit(
        null,
        userResponse?.suggested_prompts[0]?.content,
        null,
        null,
        '',
        true,
        true
      )
    }
    setSelfInitiateDefaultPrompt(false)
    // eslint-disable-next-line
  }, [selfInitiateDefaultPrompt, defaultAppOptions])

  const trackLandingEvent = (authorizationId) => {
    trackEvent('ai_app_new_landing', {
      external_id: authorizationId,
      product_name: chatboxFeatureId,
      tenant: tenant,
      app_name: 'ai_app_new'
    })
  }

  const fetchAppData = async (featureId) => {
    if (featureId) {
      await fetchFeatureData(featureId)
    } else {
      await fetchLandingData()
    }
  }

  const updateSupportedModels = (models = [], selectedModel) => {
    if (!selectedModel) return models
    return models.map((model) => ({
      ...model,
      is_default: model.name === selectedModel
    }))
  }

  const processFeatureResponse = (featureResponse, isLanding = false) => {
    const selectedModel = sessionStorage.getItem('selected_ai_model')
    featureResponse.supported_ai_models = updateSupportedModels(
      featureResponse.supported_ai_models,
      selectedModel
    )

    setUserResponse(featureResponse)

    const showOptions = AIChatbotDefaultAppOptionsKeys.includes(
      featureResponse?.feature_id
    )

    if (isLanding) {
      if (showOptions) {
        setShowDefaultOptions(featureResponse?.highlighted_features || [])
      }
    } else {
      setShowDefaultOptions(showOptions)
      if (showOptions) {
        setDefaultAppOptions(
          AIChatbotDefaultAppOptions[featureResponse?.feature_id]
        )
      }
      if (featureResponse?.self_initiate) {
        setSelfInitiateDefaultPrompt(true)
      }
    }
  }

  const fetchFeatureData = async (featureId) => {
    const { data: featureData } = await common.awaitWrap(
      axiosGet('/chatbot/single-feature', {
        params: { feature_id: convertTextUnderscorePipe(featureId) }
      })
    )

    if (featureData?.data) {
      processFeatureResponse(featureData.data, false)
    }

    setIsLoading(false)
  }

  const fetchLandingData = async () => {
    const { data: response } = await common.awaitWrap(
      axiosGet('/chatbox/landing', {})
    )

    if (response?.data) {
      processFeatureResponse(response.data, true)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const msgContainer = document.querySelector('.static-loader')
    const lastChild = msgContainer?.lastElementChild
    lastChild?.scrollIntoView({ behavior: 'smooth' })
  }, [promptInProgress])

  useEffect(() => {
    const msgContainer = document.querySelector('.ai-chatbox-messages')
    const lastChild = msgContainer?.lastElementChild
    lastChild?.scrollIntoView({ behavior: 'smooth' })
  }, [historyMessages, promptInProgress, fileUploadInProgress])

  useEffect(() => {
    return () => {
      resetTimer()
    }
  }, [])

  useEffect(() => {
    if (showCoachmark && inputRef.current) {
      inputRef.current.blur()
    }
  }, [showCoachmark])

  const handleDefaultOptionClicked = (option) => {
    const userMessage = {
      key: 'user',
      text: `${option}`
    }
    setHistoryMessages((prevMessages) => [...prevMessages, userMessage])
  }

  const handleDefaultUserOptionClicked = (option) => {
    const properties = {
      external_id: authorizationId,
      option_name: option?.key,
      product_name: userResponse?.feature_id,
      tenant: tenant,
      app_name: 'ai_chatbot'
    }
    trackEvent('chat_summarise_prompt_click', properties)

    setShowDefaultOptions(false)
    setSelectedDefaultPromptType(option?.key)
    if (option.key === 'file') {
      const fileInput = document.getElementById('fileInput')
      fileInput.dataset.source = 'suggested-prompt'
      fileInput.click()
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

  const handleFileUploadClicked = (event) => {
    event?.preventDefault()
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        app_name: 'ai_app_new',
        tenant: tenant
      }
      trackEvent('ai_chat_upload', properties)
    }
    setShowDefaultOptions(false)
    setSelectedDefaultPromptType('document')
    if (!isSublayout) {
      const fileInput = document.getElementById('fileInput')
      fileInput.dataset.source = 'input-box'
      fileInput.click()
    }
  }

  const handlePromptSubmit = async (
    event,
    prompt = userInput,
    type = selectedDefaultPromptType,
    file = uploadedFile,
    fileName = '',
    aiChatBox = true,
    defaultPromptType = false
  ) => {
    event?.preventDefault()
    if (prompt.trim() === '' && !file) return
    setIsCopying(false)
    setIsCopied(false)
    setIsSharing(false)

    if (aiChatBox) {
      const ai_model =
        userResponse?.supported_ai_models?.find(
          (model) => model.is_active && model.is_default
        )?.name || null
      let payload
      let headers = {}
      const source = event?.target?.dataset?.source
      if (source === 'suggested-prompt') {
        if (type === 'file' && file && fileName) {
          const userMessage = { key: 'user', text: fileName }
          setHistoryMessages([...(historyMessages || []), userMessage])
        } else {
          const userMessage = { key: 'user', text: prompt }
          setHistoryMessages([...(historyMessages || []), userMessage])
        }

        payload = new FormData()
        payload.append('feature_id', chatboxFeatureId)
        payload.append('request_type', type)
        payload.append('user_prompt', prompt)
        payload.append('context_id', historyContextId)
        payload.append('ai_model', ai_model)
        payload.append('user_time', getUserCurrentTimeandTimeZone())
        payload.append('deep_research', currentChatOption === 'deep-research')
        if (type === 'file' && file) {
          payload.append('file', file)
        }
      } else {
        headers = {
          'Content-Type': 'application/json'
        }
        const userMessage = {
          key: 'user',
          text: prompt
        }
        setHistoryMessages((prevMessages) => [...prevMessages, userMessage])
        setPromptInProgress(true)
        payload = {
          user_prompt: prompt,
          feature_id: chatboxFeatureId ? chatboxFeatureId : 'ai_apps_chatbox',
          media_url: mediaURL,
          search_web: searchGlobe,
          context_id: historyContextId,
          ai_model,
          conversation_type: currentChatOption || 'text',
          deep_research: currentChatOption === 'deep-research',
          user_time: getUserCurrentTimeandTimeZone()
        }
      }
      setPromptInProgress(true)
      setUserInput('')
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'ai_app_new',
          tenant: tenant
        }
        trackEvent('ai_chat_send_query', properties)
      }
      const isPayloadFormData = source === 'suggested-prompt'
      const getAPICallMethod =
        currentChatOption === 'image' ? fetchPostMethod : fetchPostMethod
      const { data: chatBotResponse, error: chatBotError } =
        await common.awaitWrap(
          getAPICallMethod(
            '/chatbot/completions',
            payload,
            headers,
            isPayloadFormData
          )
        )
      if (isNFSWContent) setIsNFSWContent(false)
      if (chatBotResponse?.status === 429) {
        setOnMaintenance(true)
      }

      if (!chatBotResponse?.body && !chatBotError?.response) {
        const fullResponseContent = API_ERROR_RESPONSE['request_timeout']
        setHistoryMessages((prevMessages) => [
          ...prevMessages,
          { key: 'system', text: fullResponseContent }
        ])
        setPromptInProgress(false)
        return
      }

      if (!chatBotResponse?.body || chatBotError) {
        setPromptInProgress(false)
        setUserInput('')
        const systemMessage = {
          key: 'system',
          text: API_ERROR_RESPONSE.generic_error
        }
        setHistoryMessages((prevMessages) => [...prevMessages, systemMessage])
      }

      if (chatBotResponse.body) {
        if (currentChatOption === 'deep-research') {
          setPromptInProgress(false)
        }

        const reader = chatBotResponse.body.getReader()
        const decoder = new TextDecoder()
        let fullResponseContent = ''
        let lastLength = 0

        // Add an initial system message (empty) to be updated
        setHistoryMessages((prevMessages) => [
          ...prevMessages,
          {
            key: 'system',
            text: '',
            type: currentChatOption,
            isDeepResearchResponse: currentChatOption === 'deep-research',
            isImageGenerationResponse: currentChatOption === 'image'
          }
        ])

        let streamComplete = false
        while (!streamComplete) {
          const { value, done: isDone } = await reader.read()
          streamComplete = isDone

          const responseChunk = decoder.decode(value, { stream: true })
          const responseStream = parseStreamData(responseChunk)
          let isFlaggedContent = false

          // ✅ Early image_url check regardless of currentChatOption
          if (responseStream?.json?.data?.response?.image_url) {
            const imageMessage = {
              key: 'system',
              text: responseStream.json.data.response.image_url,
              type: 'image'
            }
            setHistoryContextId(
              responseStream?.json?.data?.response?.context_id || ''
            )
            setHistoryMessages((prevMessages) => [
              ...prevMessages,
              imageMessage
            ])
            setPromptInProgress(false)
            setUserInput('')
            streamComplete = true
            return
          }

          if (responseStream?.text) {
            fullResponseContent += responseStream.text
          } else if (responseStream?.json && fullResponseContent === '') {
            fullResponseContent = responseStream.json
            if (!fullResponseContent) {
              const responseCode = responseStream.json?.data?.status?.code
              if (responseCode === 200) {
                fullResponseContent =
                  responseStream.json.data?.response?.content || ''
              }
            }
          }

          if (responseStream?.json) {
            const responseData = responseStream.json
            const responseCode = responseData?.data?.status?.code

            if (responseCode === 422 || responseCode === 500) {
              fullResponseContent = responseData.data.response.content
              isFlaggedContent = true
              setIsNFSWContent(true)
              setHistoryContextId(
                responseData?.data?.response?.context_id || ''
              )
            } else if (responseCode === 200) {
              setHistoryContextId(
                responseData?.data?.response?.context_id || ''
              )
              if (currentChatOption === 'image') {
                const imageMessage = {
                  key: 'system',
                  type: 'image',
                  isImageGenerationResponse: true,
                  text: responseData?.data?.response?.llm__gen_url,
                  image_lib_url: responseData?.data?.response?.image_lib_url
                }

                if (responseData?.data?.response?.image_lib_url) {
                  setImageGeneratedLibUrl({
                    ...imageGeneratedLibUrl,
                    [responseData?.data?.response?.llm__gen_url]:
                      responseData?.data?.response?.image_lib_url
                  })
                } else {
                  setHistoryMessages((prevMessages) => [
                    ...prevMessages,
                    imageMessage
                  ])
                }
              }
            }

            const errorMessage = responseData?.error?.message
            if (errorMessage) {
              fullResponseContent = API_ERROR_RESPONSE.generic_error
              const error_code = responseData.error?.error_code
              if (API_ERROR_RESPONSE[error_code]) {
                fullResponseContent = API_ERROR_RESPONSE[error_code]
              }
            }

            setSelectedDefaultPromptType(
              defaultAppOptions?.keepContext ? type : defaultPromptType
            )
            setPromptInProgress(false)
            setUserInput('')
            setMediaURL('')
            if (
              currentChatOption !== 'image' ||
              responseData?.data?.response?.image_lib_url
            ) {
              streamComplete = true
            }
          }

          if (typeof fullResponseContent === 'string') {
            const newResponseChunk = fullResponseContent?.slice(lastLength)
            const updatedFullResponse = fullResponseContent
            lastLength = fullResponseContent?.length

            setHistoryMessages((prevMessages) =>
              prevMessages.map((msg, index) => {
                if (index === prevMessages.length - 1) {
                  return {
                    ...msg,
                    text: isFlaggedContent
                      ? updatedFullResponse
                      : msg.text + newResponseChunk
                  }
                }
                return msg
              })
            )
          }
        }
      }
    } else {
      const formData = new FormData()
      if (type === 'file' && file) {
        formData.append('file', file)
        formData.append('context_id', historyContextId)
      }
      const headers = {
        'Content-Type': 'multipart/form-data'
      }

      let progress = 0
      const interval = setInterval(() => {
        progress += 30
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 1000)
      const { data: chatBotResponse, error: chatBotError } =
        await common.awaitWrap(
          axiosPost('/chatbox/upload-media', formData, headers)
        )

      if (chatBotResponse?.data) {
        const fileTypeUploaded = getFileType(chatBotResponse?.data?.signed_url)
        if (chatBotResponse?.data?.context_id) {
          setHistoryContextId(chatBotResponse?.data?.context_id)
        }
        if (authorizationId) {
          const properties = {
            external_id: authorizationId,
            product_name: fileName,
            app_name: 'ai_app_new',
            tenant: tenant
          }
          if (fileTypeUploaded === 'image') {
            trackEvent('ai_chat_upload_image', properties)
          } else {
            trackEvent('ai_chat_upload_document', properties)
          }
        }
        const systemMessage = {
          key: 'system',
          text: chatBotResponse?.data?.user_message
        }
        if (chatBotResponse.data?.signed_url) {
          setMediaURL(chatBotResponse?.data?.signed_url)
          const userMessage = {
            key: 'user',
            type: fileTypeUploaded,
            text: chatBotResponse?.data?.signed_url
          }
          setHistoryMessages((prevMessages) => [
            ...prevMessages,
            userMessage,
            systemMessage
          ])
        } else {
          setHistoryMessages((prevMessages) => [...prevMessages, systemMessage])
        }
      } else if (chatBotError) {
        if (chatBotError?.status === 429) {
          setOnMaintenance(true)
        }
        if (chatBotError?.response?.data?.error?.message) {
          const properties = {
            external_id: authorizationId,
            product_name: fileName,
            app_name: 'ai_app_new'
          }
          trackEvent('file_upload_error_ai_chat_new', properties)
        }
        const systemMessage = {
          key: 'system',
          text: API_ERROR_RESPONSE.generic_error
        }
        const errorCode = chatBotError?.response?.data?.error?.error_code
        if (API_ERROR_RESPONSE[errorCode]) {
          systemMessage.text = API_ERROR_RESPONSE[errorCode]
        }
        setHistoryMessages((prevMessages) => [...prevMessages, systemMessage])
      }
      setSelectedDefaultPromptType(
        defaultAppOptions?.keepContext ? type : defaultPromptType
      )
      setFileUploadInProgress(false)
      setUserInput('')
    }
  }

  const handleModelDetailsBackClick = () => {
    setUpcomingModelDetails(false)
  }

  const resetChatSettings = () => {
    setHistoryMessages([])
    setUserInput('')
    setUploadedFile(null)
    setFileUploadInProgress(false)
    if (!tenantLayout?.aiChatBox?.persistSearchGlobeSessionEnabled) {
      setSearchGlobe(false)
    }
    setPromptInProgress(false)
    setIsRecording(false)
    resetTimer()
    setMediaURL('')
    setIsNFSWContent(false)
    setHistoryContextId('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearChat = (event, redirectURI) => {
    resetChatSettings()
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        app_name: 'ai_app_new',
        tenant: tenant
      }
      trackEvent('ai_chat_new', properties)
    }
    if (redirectURI === 'feature-page') {
      navigate(`/feature-products?tenant=${tenant}&section=aiAssistant`)
    } else {
      navigate('/ai-chatbox')
    }
  }

  const showModelDetailsHelper = () => {
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        app_name: 'ai_app_new',
        tenant: tenant
      }
      trackEvent('ai_chat_model_details', properties)
    }
    setUpcomingModelDetails((prev) => !prev)
  }

  const handleSelectPrompt = (prompt) => {
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        prompt_id: prompt?.label,
        app_name: 'ai_app_new',
        tenant: tenant
      }
      trackEvent('ai_chat_prompt_click', properties)
    }
    handlePromptSubmit(null, prompt?.content, null, null, '', true, true)
  }

  const handleFileChange = async (event) => {
    event?.preventDefault()
    const file = event.target.files[0]
    if (!file) return

    const fileName = event.target.files[0]?.name
    const source = event.target?.dataset?.source
    const aiChatBox = source === 'suggested-prompt'
    setUploadedFile(file)
    !aiChatBox && setFileUploadInProgress(true)
    handlePromptSubmit(event, '', 'file', file, fileName, aiChatBox)
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setPromptInProgress(true)
      handlePromptSubmit(e)
    }
  }

  const onFinish = () => {
    if (tenant !== TENANTS.POVO) {
      setDisclaimerOpenModal(true)
    }
    if (aiChatboxWrapperRef.current)
      aiChatboxWrapperRef.current.style.overflowY = 'scroll'
    if (aiChatboxContainerRef.current)
      aiChatboxContainerRef.current.style.overflowY = 'scroll'
  }

  const copyCodeHandler = (couponCode) => {
    if (!couponCode) return
    setIsCopied(false)
    setIsCopying(true)
    copyTextToClipboard(couponCode, setIsCopied, setIsCopying)
  }

  const handleShareClick = (title, text) => {
    setIsSharing(true)
    shareTextMessages(title, text)
    setIsSharing(false)
  }

  const redirectToAIChatbox = () => {
    if (isSublayout) {
      navigate('/ai-chatbox', { state: { from: 'feature-page' } })
    }
  }

  const handleSearchChange = (event) => {
    if (!isSublayout) {
      if (authorizationId) {
        const properties = {
          external_id: authorizationId,
          app_name: 'ai_app_new',
          tenant: tenant
        }
        trackEvent(
          `ai_chat_web_search_${event.target.checked ? 'on' : 'off'}`,
          properties
        )
      }
    }
    setSearchGlobe(event.target.checked)
  }

  const fetchAndSetHistoryMessages = async (contextId) => {
    setIsLoading(true)
    setContextFillInProgress(true)
    setHistoryContextId(contextId)
    const { data: responseData, error } = await common.awaitWrap(
      axiosPost('chatbox/context-fetch', { context_id: contextId }, {})
    )

    if (error || !responseData?.data) {
      setHistoryMessages([])
      return
    }

    const { history = [] } = responseData.data
    const messages = []

    history.forEach(({ user_prompt, response = {}, media_url = '' }) => {
      if (media_url) {
        const fileType = getFileType(media_url)
        messages.push({ key: 'user', type: fileType, text: media_url })
      } else if (user_prompt) {
        messages.push({ key: 'user', text: user_prompt })
      }

      if (response.response_type === 'text' && response.content) {
        messages.push({
          key: 'system',
          text: response.content,
          status: 'delivered'
        })
      }
    })
    setHistoryMessages(messages)
    setContextFillInProgress(false)
    setIsLoading(false)
    setIsHistoryDrawerOpen(false)
  }

  return (
    <>
      {showCoachmark && !isLoading && (
        <CustomJoyride
          steps={AIChatboxSteps}
          storageKey={storageKey}
          showIndex={false}
          onFinish={onFinish}
        />
      )}
      {promptInProgress && <div className='ai-chatbox-page-blocker'></div>}
      <AIChatboxContainer
        className={`ai-chatbox-container ${tenant}`}
        fontFamily={tenantLayout?.aiChatBox?.fontFamily}
      >
        <MaintenanceBanner open={onMaintenance} />
        {isLoading && <Loader newLoader={true} />}
        {upcomingModelDetails && (
          <ModelDetails
            isDrawerOpen={upcomingModelDetails}
            handleBackClick={handleModelDetailsBackClick}
            userResponse={userResponse}
            setUserResponse={setUserResponse}
          />
        )}
        <>
          {userResponse?.supported_ai_models &&
            !isLoading &&
            !hideBackRedirectionBtn && (
              <HeaderSection
                handleBackClick={clearChat}
                modelsData={userResponse?.supported_ai_models}
                clearChat={clearChat}
                showModelDetails={showModelDetailsHelper}
                redirectURI={redirectURI}
                fetchAndSetHistoryMessages={fetchAndSetHistoryMessages}
                isHistoryDrawerOpen={isHistoryDrawerOpen}
                setIsHistoryDrawerOpen={setIsHistoryDrawerOpen}
                showHistoryIcon={true}
                isSublayout={isSublayout}
                activeContextId={historyContextId}
              />
            )}
          {!historyMessages?.length &&
            !fileUploadInProgress &&
            chatboxFeatureId && (
              <div className={`ai-chatbox-empty-chat-container ${tenant}`}>
                <div className='ai-chatbox-placeholder-container'>
                  <div className='chatbot-description-header'>
                    <h4>{userResponse?.title}</h4>
                    <p>{userResponse?.description}</p>
                  </div>
                </div>
              </div>
            )}
          <div className='ai-chatbox-body-wrapper' ref={aiChatboxWrapperRef}>
            <div
              className='ai-chatbox-body-container'
              ref={aiChatboxContainerRef}
            >
              {!historyMessages?.length &&
              !fileUploadInProgress &&
              !chatboxFeatureId ? (
                <div className={`ai-chatbox-empty-chat-container ${tenant}`}>
                  <div className='ai-chatbox-placeholder-container'>
                    <div className='chatbot-description'>
                      {userResponse?.description}
                    </div>
                  </div>
                  <AIChatboxPlaceholderTitle
                    className='ai-chatbox-placeholder-title'
                    fontFamily={tenantLayout?.aiChatBox?.fontFamily}
                  >
                    {tenant === TENANTS.POVO ? (
                      <Greeting />
                    ) : (
                      t('aiChatbox.landingPageTitle')
                    )}
                  </AIChatboxPlaceholderTitle>
                  {userResponse?.highlighted_features?.length > 0 && (
                    <div className='ai-chatbox-default-prompts-carousel'>
                      <DefaultFeaturesList
                        features={userResponse?.highlighted_features}
                        onSelectPrompt={handleSelectPrompt}
                        handleDefaultOptionClicked={handleDefaultOptionClicked}
                        tenant={tenant}
                        isSublayout={isSublayout}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div ref={messagesEndRef} className='ai-chatbox-messages'>
                  {historyMessages?.map((message, index) => {
                    const isUserMessage = message?.key === 'user'
                    const isLastMessage = index === historyMessages.length - 1
                    const backgroundStyle = isUserMessage
                      ? tenantLayout?.aiChatBox?.defaultPromptBackground
                      : 'transparent'

                    return (
                      <div
                        key={index}
                        className={`ai-chatbox-message-container ${
                          isUserMessage
                            ? 'user-message-container'
                            : 'system-message-container'
                        } ${message?.isDeepResearchResponse ? 'deep-research' : ''}`}
                      >
                        <div className='ai-chatbox-message-wrting-container'>
                          <div
                            className={`ai-chatbox-message ${
                              isUserMessage ? 'user-message' : 'system-message'
                            }`}
                            style={{ background: backgroundStyle }}
                          >
                            {!isUserMessage ? (
                              <>
                                {message.type === 'image' ? (
                                  <img
                                    alt={`chat-image-${index}`}
                                    className='ai-chatbox-message-system-image'
                                    src={message?.text}
                                    onClick={() =>
                                      setOpenImagePreviewUrl(message?.text)
                                    }
                                  />
                                ) : (
                                  <SystemTypeWriting
                                    text={
                                      message?.text.replace(/\[\d+\]/g, '') ||
                                      ''
                                    }
                                    isNFSWContent={isNFSWContent}
                                    status={message?.status}
                                  />
                                )}
                              </>
                            ) : message?.type === 'image' ? (
                              <img
                                alt={`chat-image-${index}`}
                                className='ai-chatbox-message-image'
                                src={message?.text}
                              />
                            ) : message.type && message?.type !== 'image' ? (
                              <NonImageMediaFile data={message} />
                            ) : (
                              <div data-color-mode='light'>
                                <SystemTypeWriting
                                  text={
                                    message?.text.replace(/\[\d+\]/g, '') || ''
                                  }
                                  typewriting={false}
                                />
                              </div>
                            )}
                          </div>

                          {isLastMessage && !isUserMessage && (
                            <div className='ai-chatbox-message-last-system-message'>
                              {tenantLayout?.aiChatBox
                                ?.showShareResponseButton && (
                                <div
                                  className={`ai-chatbox-message-lsm-share-icon ${
                                    isSharing ? 'sharing' : ''
                                  }`}
                                  onClick={() =>
                                    handleShareClick(
                                      historyMessages[
                                        historyMessages.length - 2
                                      ]?.text,
                                      message?.text
                                    )
                                  }
                                >
                                  <AIChatboxIcon
                                    kind='share'
                                    width={20}
                                    height={20}
                                  />
                                </div>
                              )}
                              <div
                                className={`ai-chatbox-message-lsm-copy-icon ${
                                  isCopying ? 'copied' : ''
                                }`}
                                onClick={() => copyCodeHandler(message?.text)}
                                disabled={!isCopied || isCopying}
                              >
                                <AIChatboxIcon
                                  kind='copy'
                                  width={20}
                                  height={20}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {promptInProgress && (
                    <>
                      {currentChatOption === 'image' ? (
                        <ImageGenrationLoader />
                      ) : currentChatOption === 'deep-research' ? (
                        <DeepResearchLoader />
                      ) : (
                        <div className='ai-chatbox-message-container system-message-container static-loader'>
                          <LoadingDots />
                        </div>
                      )}
                    </>
                  )}

                  {fileUploadInProgress && (
                    <div className='ai-chatbox-message-container ai-chatbox-image-upload user-message-container static-loader'>
                      <CircularProgress
                        color='inherit'
                        variant='determinate'
                        value={progress}
                      />
                    </div>
                  )}

                  {historyMessages?.length > 0 &&
                    !promptInProgress &&
                    tenantLayout?.aiChatBox?.showFeedbackLink && <Feedback />}
                </div>
              )}
            </div>

            {showDefaultOptions &&
              !historyMessages?.length &&
              chatboxFeatureId && (
                <DefaultUserOptions
                  uiConfigs={uiConfigs}
                  defaultAppOptions={defaultAppOptions}
                  handleDefaultOptionClicked={handleDefaultUserOptionClicked}
                />
              )}
          </div>
          {!defaultAppOptions &&
            !historyMessages?.length &&
            chatboxFeatureId && (
              <div className='default-prompts-carousel-list'>
                <DefaultPromptsCarousel
                  defaultPrompts={userResponse?.suggested_prompts}
                  onSelectPrompt={handleSelectPrompt}
                  handleDefaultOptionClicked={handleDefaultOptionClicked}
                  uiConfigs={uiConfigs}
                />
              </div>
            )}
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
                  className='ai-chatbox-recording-delete-icon'
                  style={{ backgroundColor: uiConfigs?.chatSubmitButtonColor }}
                  onClick={handleDeleteRecording}
                >
                  <DeleteOutlineIcon
                    style={{ fill: uiConfigs?.chatIconBgColor }}
                  />
                </div>
                <div className='ai-chatbox-recording-input-desc'>
                  {'Speak now...'}
                </div>
                <div className='ai-chatbox-recording-input-desc'>
                  {formatTimeToHHMMSS(recordingTime)}
                </div>
                <button
                  style={{
                    backgroundColor:
                      tenantLayout?.aiChatBox?.welcomeIconBackground
                  }}
                  onClick={handleSubmitRecording}
                >
                  <ArrowUpwardIcon fontSize='medium' style={{ fill: '#fff' }} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className='ai-chatbox-input-wrapper-deco'
              onClick={redirectToAIChatbox}
            >
              {!historyMessages?.length &&
                !fileUploadInProgress &&
                !chatboxFeatureId &&
                tenantLayout?.aiChatBox?.showPersonalInfoWarning && (
                  <div className='ai-chatbox-personal-info-warning'>
                    {t('aiChatbox.personalInfoWarning')}
                  </div>
                )}
              <form
                className={`ai-chatbox-input ${tenant}`}
                onSubmit={(e) => handlePromptSubmit(e)}
              >
                {!isSublayout ? (
                  <div className='ai-chatbox-input-wrapper'>
                    <TextareaAutosize
                      ref={inputRef}
                      value={userInput}
                      disabled={promptInProgress || isSublayout}
                      readOnly={isSublayout}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t('aiChatbox.inputPlaceholder')}
                      minRows={1}
                      maxRows={4}
                      className='custom-textarea'
                      id='ai-chatbox-aistore-input'
                    />
                    {/* To be enabled only for onic ios and for sg both ios and android (Added Android Staging onic) */}
                    {uiConfigs?.voiceSupport &&
                      ((isNavigatorAgentIOS && tenant === tenantObject.onic) ||
                        tenant === tenantObject.sgcircles ||
                        (!isNavigatorAgentIOS &&
                          environment === environmentType.staging &&
                          tenant === tenantObject.onic)) && (
                        <div
                          className='ai-chatbox-microphone-icon-div'
                          onClick={handleStartRecording}
                        >
                          <MicNoneIcon
                            style={{ fill: uiConfigs?.chatSubmitButtonColor }}
                          />
                        </div>
                      )}
                  </div>
                ) : (
                  <div className='ai-chatbox-input-sublayout-wrapper'>
                    <div className='ai-chatbox-input-sublayout-placeholder'>
                      {t('aiChatbox.inputPlaceholder')}
                    </div>
                  </div>
                )}
                <div className='ai-chatbox-input-action-wrapper'>
                  <button
                    style={{
                      backgroundColor:
                        tenantLayout?.aiChatBox?.defaultPromptBackground
                    }}
                    onClick={(event) => handleFileUploadClicked(event)}
                  >
                    <AIChatboxIcon
                      kind='add'
                      width={24}
                      height={24}
                      color='#808080'
                    />
                  </button>
                  {currentChatOption === 'image' && (
                    <button className='ai-chatbox-input-action-image-wrapper'>
                      <AIChatboxIcon
                        kind='chat-options-create-image-icon'
                        width={24}
                        height={24}
                        color='none'
                      />
                      <div
                        className='ai-chatbox-input-action-image-close'
                        onClick={() => setCurrentChatOption('text')}
                      >
                        <AIChatboxIcon
                          kind='chat-options-close-icon'
                          width={24}
                          height={24}
                          color='#808080'
                        />
                      </div>
                    </button>
                  )}
                  {currentChatOption === 'deep-research' && (
                    <button className='ai-chatbox-input-action-image-wrapper'>
                      <AIChatboxIcon
                        kind='chat-options-image-icon'
                        width={24}
                        height={24}
                        color='none'
                      />
                      <div
                        className='ai-chatbox-input-action-image-close'
                        onClick={() => setCurrentChatOption('text')}
                      >
                        <AIChatboxIcon
                          kind='chat-options-close-icon'
                          width={24}
                          height={24}
                          color='#808080'
                        />
                      </div>
                    </button>
                  )}
                  <div className='ai-chatbox-input-action-toggle-web-wrapper'>
                    <FormControlLabel
                      className={`ai-chatbox-input-action-toggle-web ${searchGlobe ? 'active' : 'inactive'}`}
                      control={
                        <ChatboxUseWebSwitch
                          checked={searchGlobe}
                          onChange={handleSearchChange}
                        />
                      }
                      label={t('aiChatbox.searchWebLabel')}
                    />
                  </div>
                  <button
                    type='submit'
                    style={{
                      backgroundColor:
                        tenantLayout?.aiChatBox?.welcomeIconBackground
                    }}
                  >
                    <ArrowUpwardIcon
                      fontSize='medium'
                      style={{ fill: '#fff' }}
                    />
                  </button>
                </div>
              </form>
            </div>
          )}
          <input
            className='hidden-input'
            type='file'
            accept='.docx,.pdf,text/plain,.txt,image/png, image/jpeg, image/jpg, image/bmp, image/webp'
            id='fileInput'
            onChange={(e) => handleFileChange(e)}
          />
        </>
      </AIChatboxContainer>

      <DisclaimerModal
        open={openDisclaimerModal}
        setOpen={setDisclaimerOpenModal}
      />
      <TermsAndConditionsModal
        open={openTermsConditionsModal}
        setOpen={setOpenTermsConditionsModal}
        onNext={onTermsAccepted}
      />
      <ChatOptionsList
        drawerOpen={chatOptionsDrawerOpen}
        setDrawerOpen={setChatOptionsDrawerOpen}
        setCurrentChatOption={setCurrentChatOption}
      />
      <ImagePreviewer
        imageUrl={openImagePreviewUrl ? openImagePreviewUrl : ''}
        imageDownloadUrl={imageGeneratedLibUrl[openImagePreviewUrl] || ''}
        openImagePreviewUrl={openImagePreviewUrl}
        setOpenImagePreviewUrl={setOpenImagePreviewUrl}
      />
    </>
  )
}

AIChatbox.propTypes = {
  isSublayout: PropTypes.bool
}

export default AIChatbox
