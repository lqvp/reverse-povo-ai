import common from '@kelchy/common'
import { maxFileSize } from '../common/constants'
import { axiosPatch, getImageBlob } from '../utils/axios'
import { getFileTypeFromUrl } from './fileTypeHelper'
import { getDeeplinkBaseURL } from './tenantHelper'
import { trackEvent } from './analyticsHelper'

export const imageUploadToUrl = (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0]

    if (!file) {
      reject(new Error('No file selected.'))
      return
    }

    if (file.size > maxFileSize) {
      reject(new Error('File size should be less than 15 MB.'))
      alert('File size should be less than 15 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      resolve(url)
    }

    reader.onerror = () => {
      reader.abort()
      reject(new Error('Failed to read the file.'))
    }

    reader.readAsDataURL(file)
  })
}

export const downloadMedia = async (url) => {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = url
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export const shareMediaNativePopUp = async (mediaUrl) => {
  const fileType = getFileTypeFromUrl(mediaUrl)
  const isAndroid = /Android/i.test(navigator.userAgent)
  if (isAndroid && window.AndroidShareHandlerV1) {
    window.AndroidShareHandlerV1.shareMedia(mediaUrl, fileType, '')
  } else if (isAndroid && window.AndroidShareHandler) {
    window.AndroidShareHandler.share(mediaUrl)
  } else if (navigator.share) {
    const { data: mediaBlob, error: mediaBlobError } = await common.awaitWrap(
      getImageBlob(mediaUrl)
    )
    if (mediaBlobError) {
      console.error('Error in sharing media:', mediaBlobError)
      throw new Error('Error in sharing media')
    } else {
      const file = new File([mediaBlob], 'media.jpg', { type: 'image/jpeg' })
      await common.awaitWrap(navigator.share({ files: [file] }))
    }
  } else {
    window.open(mediaUrl, 'CustomShareWindow', 'width=600, height=400')
  }
}

export const shareMediaToUGC = async (
  success,
  authorizationId,
  endpoint,
  shareMediaUGCUrl,
  navigate
) => {
  if (success) {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('share_prompt_click', properties)

    const headers = {
      Authorization: authorizationId
    }
    const body = { publish_on_ugc_platform: true }
    const { error: shareUGCError } = await common.awaitWrap(
      axiosPatch(shareMediaUGCUrl, body, headers)
    )
    if (shareUGCError) {
      throw new Error(shareUGCError)
    } else {
      navigate('/?aistore_tab=discover')
    }
  } else {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('share_prompt_close', properties)
  }
}

export const getFileNameFromUrl = (url) => {
  const urlObj = new URL(url)
  const filePath = urlObj.pathname
  const pathParts = filePath.split('/')
  const fileName = pathParts[pathParts.length - 1]
  return fileName
}

export const shareDeeplinkURL = async (title, eventText) => {
  if (!eventText) {
    return
  }

  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isAndroid) {
    if (window?.AndroidShareHandlerV1) {
      window.AndroidShareHandlerV1?.shareMedia('', 'txt', eventText)
    } else if (window.AndroidShareHandler) {
      window.AndroidShareHandler?.share(eventText)
    }
  } else if (navigator.share) {
    const { error } = await common.awaitWrap(
      navigator.share({
        title: title,
        text: eventText
      })
    )
    if (error) return
  }
}

export const shareExploreFunGamesDeeplink = (authorizationId, gameName) => {
  trackEvent('shared_deeplink', {
    external_id: authorizationId,
    app_name: 'fun_apps',
    game_name: gameName
  })
  const deeplinkURL = getDeeplinkBaseURL() + '?card=funGamesApp'
  shareDeeplinkURL(
    'Explore the world of fun games on Circles Network',
    deeplinkURL
  )
}

export const shareExploreNewsDeeplink = (authorizationId, currentNews) => {
  trackEvent('shared_deeplink', {
    external_id: authorizationId,
    app_name: 'quick_news_app',
    category_name: currentNews?.news_category,
    content_id: currentNews?.news_id || 'N/A'
  })

  const deeplinkURL = `${
    currentNews?.news_title
  }. Checkout further exciting news :  ${getDeeplinkBaseURL()}?card=newsInMinute`
  shareDeeplinkURL(
    'Explore the world of quick news on Circles Network',
    deeplinkURL
  )
}

export const copyTextToClipboard = async (
  textToCopy,
  setIsCopied,
  setIsCopying
) => {
  if (!textToCopy) return
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Attempt to copy the text using the clipboard API
    const { error } = await common.awaitWrap(
      navigator.clipboard.writeText(textToCopy)
    )
    if (error) {
      let textField = document.createElement('textarea')
      textField.innerText = textToCopy
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()
    }
  } else {
    // Fallback method if clipboard API is not available
    let textField = document.createElement('textarea')
    textField.innerText = textToCopy
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  setTimeout(() => {
    setIsCopying(false)
    setIsCopied(true)
  }, 500)
}

export const shareTextMessages = async (title, eventText) => {
  if (!eventText) {
    return
  }

  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isAndroid) {
    if (window?.AndroidShareHandlerV1) {
      window.AndroidShareHandlerV1?.shareMedia('', 'txt', eventText)
    } else if (window.AndroidShareHandler) {
      window.AndroidShareHandler?.share(eventText)
    }
  } else if (navigator.share) {
    const { error } = await common.awaitWrap(
      navigator.share({
        title: title,
        text: eventText
      })
    )
    if (error) return
  }
}
