import i18next from 'i18next'
import { translatedJsonData } from '../i18nextConfig'

const translate = (key, options) => {
  return i18next.t(`common:${key}`, options)
}

export const maxFileSize = 15 * 1024 * 1024 // 15 MB
export const allowedImageFormats = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/bmp',
  'image/webp'
]

export const clevertapConfig = { key: 'RZK-774-875Z', region: 'sg1' }

export const TENANTS = {
  SGCIRCLES: 'sgcircles',
  ONIC: 'onic',
  ATT: 'att',
  TSELHALO: 'tselhalo',
  MOBICOM: 'mobicom',
  BYU: 'byu',
  POVO: 'povo'
}

// Mapping object to convert news categories to their corresponding display names
export const newsCategoryMapper = (category, camelCase) => {
  if (camelCase) {
    if (category === 'entertainment') return 'fun_weird'
    if (category === 'world_news') return 'news'
    return category
  } else {
    return translate(`news.newsTitle.${category}`)
  }
}

// Helper function to convert the text to camel case
export function toCamelCase(input) {
  return input
    ?.trim()
    ?.replace(/[^a-zA-Z ]/g, '')
    ?.toLowerCase()
    ?.split(/\s+/)
    ?.map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    ?.join('')
}

// Helper function to convert the text to text separated by underscore
export function convertTextUnderscorePipe(title) {
  return title.toLowerCase()?.split(' ')?.join('_')
}

export function camelToSnake(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export const BASIC_UI_CONFIG = {
  featured: {
    headerColor: '#DC4848',
    bgColor: '#FFF',
    iconCardBgColor: 'linear-gradient(180deg, #F9BCBC 0%, #FFAEAE 100%)',
    section: 'list',
    chatIconBgColor: '#F4F4F5',
    voiceSupport: true
  },
  funWithSelfies: {
    headerColor: '#7281F2',
    bgColor: '',
    iconCardBgColor: 'linear-gradient(180deg, #DBDFFF 0%, #B3BCFF 100%)',
    section: '',
    voiceSupport: true
  },
  entertainment: {
    headerColor: '#44B732',
    bgColor: '',
    iconCardBgColor: 'linear-gradient(180deg, #FFF 0%, #E4FFDF 100%)',
    section: 'card',
    chatIconBgColor: '#F4F4F5',
    chatSubmitButtonColor: '#7DC870',
    voiceSupport: true
  },
  social: {
    headerColor: '#B7AA32',
    bgColor: '',
    iconCardBgColor: 'linear-gradient(180deg, #FFF 0%, #FFFAD1 100%)',
    section: 'card',
    chatIconBgColor: '#F4F4F5',
    chatSubmitButtonColor: '#CABB36',
    voiceSupport: true
  },
  productivity: {
    headerColor: '#E58219',
    bgColor: '#FFF',
    iconCardBgColor: 'linear-gradient(180deg, #FFE1C1 0%, #FFCB95 100%)',
    section: 'list',
    chatIconBgColor: '#F4F4F5',
    chatSubmitButtonColor: '#EA9B47',
    voiceSupport: false
  },
  travel: {
    headerColor: '#FF3A81',
    bgColor: '',
    iconCardBgColor: 'linear-gradient(180deg, #FFF 0%, #FFEFF5 100%)',
    section: 'card',
    chatIconBgColor: '#F4F4F5',
    chatSubmitButtonColor: '#FF619A',
    voiceSupport: true
  },
  default: {
    headerColor: '#E8F2FF',
    bgColor: '#E8F2FF',
    iconCardBgColor: 'linear-gradient(180deg, #E8F2FF 0%, #E8F2FF 100%)',
    section: 'card',
    chatIconBgColor: '#F4F4F5',
    chatSubmitButtonColor: '#7792BA',
    voiceSupport: true
  }
}

export const API_ERROR_RESPONSE = translatedJsonData.aiApps.error_messages

export const AIChatbotDefaultAppOptionsKeys = [
  'summarize',
  'chat_pdf',
  'instagram_caption'
]

export const AIChatbotDefaultAppOptions = {
  summarize: {
    question: translatedJsonData.aiApps.summarize.question,
    options: [
      {
        key: 'text',
        value: translatedJsonData.aiApps.summarize.options.textValue,
        response: translatedJsonData.aiApps.summarize.options.textResponse
      },
      {
        key: 'url',
        value: translatedJsonData.aiApps.summarize.options.urlValue,
        response: translatedJsonData.aiApps.summarize.options.urlResponse
      },
      {
        key: 'file',
        value: translatedJsonData.aiApps.summarize.options.fileValue
      }
    ],
    keepContext: false
  },
  chat_pdf: {
    question: translatedJsonData.aiApps.chatPdf.question,
    options: [
      {
        key: 'file',
        value: translatedJsonData.aiApps.chatPdf.options.fileValue
      }
    ],
    keepContext: true
  },
  instagram_caption: {
    question: translatedJsonData.aiApps.instagram_caption.question,
    options: [
      {
        key: 'file',
        value: translatedJsonData.aiApps.instagram_caption.options.fileValue
      }
    ],
    keepContext: true
  }
}

export const BASIC_UI_CONFIG_TRIVIA = [
  // daily quiz theme
  {
    primaryColor: '#9DFF9B',
    secondaryColor: '#004C23',
    headerCounterColor: '#00813B',
    tertiaryColor: '#0BB559'
  },
  // other categories theme
  {
    primaryColor: '#FFD79B',
    secondaryColor: '#4C2500',
    headerCounterColor: '#AA5100',
    tertiaryColor: '#F7963D'
  },
  {
    primaryColor: '#9DFF9B',
    secondaryColor: '#004C23',
    headerCounterColor: '#00813B',
    tertiaryColor: '#0BB559'
  },
  {
    primaryColor: '#FFB8B8',
    secondaryColor: '#4C0000',
    headerCounterColor: '#C00000',
    tertiaryColor: '#F73D3D'
  },
  {
    primaryColor: '#9BB7FF',
    secondaryColor: '#001A4C',
    headerCounterColor: '#001791',
    tertiaryColor: '#4954B6'
  },
  {
    primaryColor: '#E8B6FF',
    secondaryColor: '#2B004C',
    headerCounterColor: '#680098',
    tertiaryColor: '#9349B6'
  },
  {
    primaryColor: '#F1FF9B',
    secondaryColor: '#4C4400',
    tertiaryColor: '#B6AB49',
    headerCounterColor: '#8F8100'
  }
]

export const TRIVIA_CATEGORIES = [
  // daily quiz
  {
    _id: 'uuid',
    category_id: 'dailyQuiz',
    title: translatedJsonData.trivia.dailyQuiz,
    is_daily_challenge: false,
    image_url: 'images/ai_store_trivia/dailyChallengeTrivia.png',
    icon_url: 'images/ai_store_trivia/dailyChallengeTriviaCardImage.png',
    order_rank: 4
  },
  // other categories
  {
    _id: 'uuid',
    category_id: 'generalKnowledge',
    title: translatedJsonData.trivia.generalKnowledge,
    is_daily_challenge: false,
    image_url: 'images/ai_store_trivia/noteBooks.png',
    order_rank: 1
  },
  {
    _id: 'uuid',
    category_id: 'geography',
    title: translatedJsonData.trivia.geography,
    is_daily_challenge: true,
    image_url: 'images/ai_store_trivia/geographyTrivia.png',
    order_rank: 2
  },
  {
    _id: 'uuid',
    category_id: 'sports',
    title: translatedJsonData.trivia.sports,
    is_daily_challenge: false,
    image_url: 'images/ai_store_trivia/sportsTrivia.png',
    order_rank: 3
  },
  {
    _id: 'uuid',
    category_id: 'entertainment',
    title: translatedJsonData.trivia.entertainment,
    is_daily_challenge: false,
    image_url: 'images/ai_store_trivia/entertainmentTrivia.png',
    order_rank: 4
  }
]

export const REWARD_LAYOUT_CONFIG = {
  sparklePngPath: 'images/ai_store_trivia/sparkle-rays.png',
  rewardCupPngPath: 'images/ai_store_trivia/reward-cup.png',
  sparkleQuestionCardPath:
    'images/ai_store_trivia/sparkle-rays-questions-card.png'
}

export const PUZZLE_EMBED_URLS = {
  'memory-game': '/en/memory/embed?p=-O4Ei1jni3xiCE_4HdyO',
  'matching-pairs': '/en/matching-pairs/embed?p=-O4Eeklw4Ox3XZBRbwnA',
  jigsaw: '/en/jigsaw/embed?p=-O4sQK1YA7O04zy2QBU0',
  word_search: '/en/wordseeker/embed?p=-O4t3aumtnYsfC8FWmFH',
  crossword: '/en/crossword/embed?p=-O4t4FFywCyme61sbB31'
}

export const RIDDLE_POLL_LAYOUT = {
  riddles: {
    primaryColor: '#FFB8B8',
    secondaryColor: '#4C0000',
    textColor: '#333',
    tabActiveColor: '#EC5E5E'
  },
  poll: {
    primaryColor: '#9BB7FF',
    secondaryColor: '#001A4C',
    textColor: '#333',
    tabActiveColor: '#6077EB'
  }
}

// Polling game service URL
export const POLLING_GAME_STAGING_API =
  'https://polling-game-api.circleslife.co'
export const POLLING_GAME_PROD_API = 'https://polling-game-api.circles.life'

export const FALLBACK_NEWS_IMAGE_STAGING =
  'https://aistore.circleslife.co/images/news_sections/news_section_1.jpg'
export const FALLBACK_NEWS_IMAGE_PROD =
  'https://aistore.circles.life/images/news_sections/news_section_1.jpg'

export const WELLNESS_TRACKER_TERMS_CONDITIONS = {
  terms:
    'To enable Wellness scanner, we request access to your device camera for facial scans. These scans are used to measure health data, which will be shared with Circles.Life to enhance your user experience.',
  notes: 'Please note:',
  notesDetails: [
    'Wellness scanner is provided by Circles on an "as is" and "as available" basis and is powered by the third-party screening app, Binah. This service is intended for general fitness and wellness purposes only, not as a replacement for professional medical advice or diagnosis. For any medical concerns, we recommend consulting a qualified healthcare professional. In the event of an emergency, please contact local emergency services immediately.',
    'Privacy: Binah does not store or share images of your face. For further details, please review the Binah Terms and Conditions.'
  ],
  warning: `Circles makes no representations or warranties of any kind, express or implied, regarding the app's operation, information, content, materials, or products included. To the fullest extent permissible by applicable law, Circles disclaims all warranties, including but not limited to implied warranties of merchantability and fitness for a particular purpose. This disclaimer applies to all products, diagnoses, and advice provided on the app. By clicking on the button below, you acknowledge that your use is at your sole risk.`
}

export const WELLNESS_TRACKER_BANNER_DESC = {
  provider: 'Powered by third party screening app Binah.ai',
  intentionDesc:
    'Intended for general fitness and wellness purposes only, not a replacement for professional medical advice or diagnosis',
  providerDisclaimer:
    ' Binah does not store or share images of your face and wellness result'
}

export const WELLNESS_TRACKER_SCROLL_INDICATOR =
  'For more details, please read below'

export const environmentType = {
  production: 'production',
  staging: 'staging'
}

export const tenantType = {
  sgcircles: 'sgcircles',
  onic: 'onic',
  att: 'att',
  tselhalo: 'tselhalo',
  mobicom: 'mobicom',
  byu: 'byu',
  povo: 'povo'
}

export const snakeToTitleCase = (snakeStr) => {
  return snakeStr
    .split('_')
    .map((word) =>
      word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

export const productVersionKey = {
  V1: 'V1',
  V2: 'V2',
  V3: 'V3',
  V4: 'V4'
}
