import i18next from 'i18next'
import { environmentType, tenantType } from '../common/constants'

const translate = (key, options) => {
  return i18next.t(`common:${key}`, options)
}

export const getExternalIdFromParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const externalId = urlParams.get('aistore_external_id')
  return externalId
}

export const validateEmail = (email) => {
  // Regular expression to validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const transformUppercase = (input) => {
  // Replace underscores with spaces and convert to uppercase
  return input.replace(/_/g, ' ').toUpperCase()
}

export const getNewsUpdatedTime = (timestamp) => {
  const currentTime = Date.now()
  const timeDifference = currentTime - timestamp

  const minutes = Math.floor(timeDifference / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 60) {
    return `${translate('news.updated')} ${translate('homePage.justNow')}`
  } else if (hours < 24) {
    return `${translate('news.updated')} ${hours} ${
      hours > 1 ? translate('homePage.hours') : translate('homePage.hour')
    } ${translate('homePage.ago')}`
  } else {
    return `${translate('news.updated')} ${days} ${
      days > 1 ? translate('homePage.days') : translate('homePage.day')
    } ${translate('homePage.ago')}`
  }
}

export const transformTitleCase = (word) => {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export const adjustColorBrightness = (hex, percent) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  // Calculate the lightening amount for each component
  const lightenAmount = Math.round(255 * (percent / 100))

  // Lighten each RGB component independently
  r = Math.max(0, r + lightenAmount)
  g = Math.max(0, g + lightenAmount)
  b = Math.max(0, b + lightenAmount)

  // Convert back to hex
  const rHex = r.toString(16).padStart(2, '0')
  const gHex = g.toString(16).padStart(2, '0')
  const bHex = b.toString(16).padStart(2, '0')

  // Return the darker color in hexadecimal format
  return '#' + rHex + gHex + bHex
}

export const numberToWords = (num, language = 'en') => {
  if (!num) {
    return ''
  }

  const translations = {
    en: {
      belowTwenty: [
        'Zero',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen'
      ],
      tens: [
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety'
      ],
      thousands: ['Thousand', 'Million', 'Billion', 'Trillion']
    },
    idBy: {
      belowTwenty: [
        'Zero',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen'
      ],
      tens: [
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety'
      ],
      thousands: ['Thousand', 'Million', 'Billion', 'Trillion']
    },
    mn: {
      belowTwenty: [
        'Тэг',
        'Нэг',
        'Хоёр',
        'Гурав',
        'Дөрөв',
        'Тав',
        'Зургаа',
        'Долоо',
        'Найм',
        'Ес',
        'Арав',
        'Арван нэг',
        'Арван хоёр',
        'Арван гурав',
        'Арван дөрөв',
        'Арван тав',
        'Арван зургаа',
        'Арван долоо',
        'Арван найм',
        'Арван ес'
      ],
      tens: ['Хорь', 'Гуч', 'Дөч', 'Тавь', 'Жар', 'Дал', 'Ная', 'Ер'],
      thousands: ['Мянга', 'Сая', 'Тэрбум', 'Их наяд']
    }
  }

  const { belowTwenty, tens, thousands } = translations[language]

  const convertToWords = (num) => {
    if (num < 20) return belowTwenty[num]
    if (num < 100)
      return `${tens[Math.floor(num / 10) - 2]}${num % 10 ? ' ' + belowTwenty[num % 10] : ''}`
    if (num < 1000)
      return `${belowTwenty[Math.floor(num / 100)]} ${language === 'en' ? 'Hundred' : 'Зуу'}${num % 100 ? ' ' + convertToWords(num % 100) : ''}`

    for (let i = 0; i < thousands.length; i++) {
      const divisor = Math.pow(1000, i + 1)
      if (num < divisor) {
        return `${convertToWords(Math.floor(num / (divisor / 1000)))} ${thousands[i - 1]}${num % (divisor / 1000) ? ' ' + convertToWords(num % (divisor / 1000)) : ''}`
      }
    }
  }
  let numToWord = convertToWords(num)
  if (!numToWord) {
    numToWord = ''
  }
  return numToWord
}

export const getGroupedByCategory = (data) => {
  const groupByCategory = (data) => {
    const uniqueCategories = [
      ...new Set(data?.map((item) => item?.category_id))
    ]
    let grouped = uniqueCategories.reduce((acc, category) => {
      acc[category] = data?.filter((item) => item?.category_id === category)
      return acc
    }, {})
    return grouped
  }

  const groupDataByCategory = groupByCategory(data)
  const categories = Object.keys(groupDataByCategory)
  let categoryTitle = { featured: translate('aiApps.featured') }
  categories?.forEach((category) => {
    if (category !== 'featured') {
      categoryTitle[category] = groupDataByCategory[category][0]?.category
    }
  })
  return { groupedFeature: groupDataByCategory, categoryTitle }
}

export const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const getFontSizeByWordCount = (wordCount) => {
  if (wordCount <= 5) {
    return '24px'
  } else if (wordCount <= 10) {
    return '20px'
  } else {
    return '16px'
  }
}

export const formatTimeToHHMMSS = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '00:00' // Handle invalid or negative input
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    // Format as hh:mm:ss
    return [
      hours,
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':')
  } else {
    // Format as mm:ss
    return [minutes, secs.toString().padStart(2, '0')].join(':')
  }
}

export const formatTimeToHHMMSSByu = (seconds) => {
  seconds = +seconds
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '00:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':')
  } else {
    return [minutes.toString(), secs.toString().padStart(2, '0')].join(':')
  }
}

export const generateRandomCount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to measure text width
const measureTextWidth = (text, font) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  return context.measureText(text).width
}

// Function to truncate text based on max width and max height
const truncateText = (text, maxWidth, maxHeight, font) => {
  let truncated = text
  let lines = []
  let line = ''

  const lineHeight = 22 // Define the line height used for the maxHeight calculation

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const newLine = line + char
    const lineWidth = measureTextWidth(newLine, font)

    if (lineWidth > maxWidth) {
      lines.push(line)
      line = char
    } else {
      line = newLine
    }

    if (lines.length >= Math.floor(maxHeight / lineHeight)) {
      break
    }
  }

  lines.push(line)
  truncated = lines.join('\n')
  const finalWidth = measureTextWidth(truncated, font)
  if (finalWidth > maxWidth || lines.length * lineHeight > maxHeight) {
    truncated = `${truncated.trim().slice(0, -4)}...`
  }

  return truncated
}

// Function to update truncated text in the state
export const updateTruncatedText = (container, text, setTruncatedText) => {
  const { width, height } = container.getBoundingClientRect()
  const font = window.getComputedStyle(container).font
  const truncated = truncateText(text, width, height, font)
  setTruncatedText(truncated)
}

export function formatDatetoVerbose(date, delimiter) {
  if (!date) date = new Date()
  if (typeof date === 'number') {
    date = new Date(date)
  }
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return new Intl.DateTimeFormat('en-GB', options)
    .format(date)
    .replace(/ /g, delimiter)
}

export function getCurrentDateMonthName(date) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return monthNames[date.getMonth()]
}

export const formatDateTextual = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

// Get dd/mm/yyyy date formatted
export const formatDateToDDMMYYYY = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const getWidgetBaseUrl = (environment) => {
  const hostname = window.location.hostname

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001'
  }

  const baseUrls = {
    production: 'https://aistore.circles.life',
    staging: 'https://aistore.circleslife.co',
    default: 'https://aistore.circleslife.co'
  }

  if (!environment) {
    if (hostname.includes('circles.life')) {
      return baseUrls.production
    } else {
      return baseUrls.default
    }
  }

  return baseUrls[environment] || baseUrls.default
}

export const isIOSVersionCompatible = () => {
  const userAgent =
    window.navigator.userAgent || window.navigator.vendor || window.opera
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
  if (isIOS) {
    const match = userAgent.match(/OS (\d+)_?(\d+)?_?(\d+)?/)
    if (match && match.length > 2) {
      const majorVersion = parseInt(match[1], 10) || 0
      const minorVersion = parseInt(match[2], 10) || 0
      if (majorVersion > 16 || (majorVersion === 16 && minorVersion > 7))
        return true
    }
  }
  return false
}

// Function to format date in the format 'DDMMMYYYY'
export const formatDateToDDMMMYYYY = (dateString, addSuffix = false) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'short', day: 'numeric' }

  // If the addSuffix flag is true, format with the suffix
  if (addSuffix) {
    const day = date.getDate()
    const suffix = getDaySuffix(day)
    const month = date.toLocaleString('en-GB', { month: 'short' })
    return `${day}${suffix} ${month}`
  }

  // Otherwise, return the default format (DD MMM YYYY)
  return date.toLocaleDateString('en-GB', options).replace(/,/g, '')
}

// Helper function to determine the suffix for the day
const getDaySuffix = (day) => {
  const lastDigit = day % 10
  if (day >= 11 && day <= 13) {
    return 'th'
  }
  switch (lastDigit) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

// Identify whether the url is a complete routing URL
export const isCompleteHttpsUrl = (url) => {
  // Regex checks for URLs that start with https:// followed by a domain
  const httpsRegex = /^https:\/\/[^\s/$.?#].[^\s]*$/
  return httpsRegex.test(url)
}

export const getFileType = (url) => {
  const imageExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'bmp',
    'webp',
    'svg',
    'tiff',
    'ico'
  ]
  const pathname = new URL(url).pathname
  const match = pathname.match(/\.([0-9a-z]+)$/i)
  if (!match) return 'unknown'

  const extension = match[1].toLowerCase()
  return imageExtensions.includes(extension) ? 'image' : extension
}

export const findByTransactionTriggerEvent = (dataArray, event) => {
  return dataArray.find((item) => item.transaction_trigger_event === event)
}

export const findByWidgetComponentId = (dataArray, widgetComponentID) => {
  if (!dataArray || dataArray?.length === 0 || !widgetComponentID) return {}
  return dataArray.find(
    (item) => item.widget_component_id === widgetComponentID
  )
}

export const getYouTubeVideoIdFromParam = (url) => {
  if (typeof url !== 'string' || !url.startsWith('http')) return null
  const urlObj = new URL(url)
  return urlObj.searchParams.get('v')
}

export const formatDateToUTCFormat = (timestamp) => {
  const date = new Date(timestamp)
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

export function getVideoUrl({ environment, tenant, game }) {
  if (!game) return
  if (environment === environmentType.production) {
    if (tenant === tenantType.onic) {
      return game.prod_game_url?.replace('sg', 'pk')
    }
    return game.prod_game_url
  }
  return game.game_url
}
