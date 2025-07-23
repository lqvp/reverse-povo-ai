import { tenantType } from '../common/constants'
import { getAllAppDrawerIconIds } from '../widgets/Navigation/navigationData'
import { getTenantName } from './tenantHelper'

export const funWithSelfiesMapper = {
  animateMe: 'animate',
  avatarMe: 'avatar',
  stickerPicker: 'sticker',
  glowMeUp: 'glowUp'
}

export const defaultAppVisit = [
  {
    widgetComponentId: 'navigationDailyQuiz',
    timestamp: '2024-08-07T00:00:02.000Z',
    appId: 'dailyQuiz'
  },
  {
    widgetComponentId: 'navigationSummarize',
    timestamp: '2024-08-07T00:00:01.000Z',
    appId: 'summarize'
  },
  {
    widgetComponentId: 'navigationVideos',
    timestamp: '2024-08-07T00:00:00.000Z',
    appId: 'videos'
  }
]

export const byuDefaultAppVisit = [
  {
    widgetComponentId: 'navigationMixtape',
    timestamp: '2024-08-07T00:00:02.000Z',
    appId: 'mixtape'
  },
  {
    widgetComponentId: 'navigationHoroscope',
    timestamp: '2024-08-07T00:00:01.000Z',
    appId: 'horoscope'
  },
  {
    widgetComponentId: 'navigationGames',
    timestamp: '2024-08-07T00:00:00.000Z',
    appId: 'casualGames'
  },
  {
    widgetComponentId: 'navigationUstream',
    timestamp: '2024-08-07T00:00:01.000Z',
    appId: 'ustream'
  }
]

export const mobicomDefaultAppVisit = [
  {
    widgetComponentId: 'navigationDailyQuiz',
    timestamp: '2024-12-12T00:00:02.000Z',
    appId: 'dailyQuiz'
  },
  {
    widgetComponentId: 'navigationBeatTheClock',
    timestamp: '2024-12-12T00:00:01.000Z',
    appId: 'beatTheClock'
  },
  {
    widgetComponentId: 'navigationGames',
    timestamp: '2024-12-12T00:00:00.000Z',
    appId: 'games'
  }
]

export const tselHaloDefaultAppVisit = [
  {
    widgetComponentId: 'navigationCasualGames',
    timestamp: '2024-08-07T00:00:02.000Z',
    appId: 'casualGames'
  },
  {
    widgetComponentId: 'navigationDengarMusik',
    timestamp: '2024-08-07T00:00:01.000Z',
    appId: 'dengarMusik'
  },
  {
    widgetComponentId: 'navigationDuniaGames',
    timestamp: '2024-08-07T00:00:00.000Z',
    appId: 'duniaGames'
  }
]

const sliceLimit = {
  byu: 4,
  default: 3
}

// Get the Recent visited apps list
export function getRecentAppVisits() {
  const tenant = getTenantName()
  const visitsData = localStorage.getItem('recent-visited-apps')
  const allAppDrawerIconIds = getAllAppDrawerIconIds()

  // Centralized initialization
  let defaultVisits
  switch (tenant) {
    case tenantType.tselhalo:
      defaultVisits = tselHaloDefaultAppVisit
      break
    case tenantType.mobicom:
      defaultVisits = mobicomDefaultAppVisit
      break
    case tenantType.byu:
      defaultVisits = byuDefaultAppVisit
      break
    default:
      defaultVisits = defaultAppVisit
      break
  }

  let recentVisits = defaultVisits

  if (visitsData) {
    const visits = JSON.parse(visitsData)
    const isValidVisits =
      Array.isArray(visits) &&
      visits.every(
        (visit) =>
          isValidAppVisit(visit) &&
          visit.widgetComponentId &&
          allAppDrawerIconIds.includes(visit.appId)
      )

    if (isValidVisits) {
      recentVisits = visits
    } else {
      localStorage.removeItem('recent-visited-apps')
    }
  }

  const combinedVisits = [...recentVisits, ...defaultVisits]
  const sliceLimitForTenant = sliceLimit[tenant] || sliceLimit.default
  const uniqueVisits = Array.from(
    new Map(combinedVisits.map((visit) => [visit.appId, visit])).values()
  ).slice(0, sliceLimitForTenant)

  return uniqueVisits
}

// Store the recent visited apps in the local storage
export function recordAppVisit(appId, widgetComponentId) {
  const visitsData = localStorage.getItem('recent-visited-apps')
  let visits = []

  if (visitsData) {
    visits = JSON.parse(visitsData)
    if (!Array.isArray(visits) || !visits.every(isValidAppVisit)) {
      visits = []
    }
  }

  // Remove any existing entry for the appId
  visits = visits.filter((visit) => visit.appId !== appId)
  // Add the new visit
  visits.push({
    widgetComponentId,
    timestamp: new Date().toISOString(),
    appId: appId
  })
  // Sort visits from recent to old
  visits.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  // Keep only the last 'sliceLimit' visits
  const tenant = getTenantName()
  const sliceLimitForTenant = sliceLimit[tenant] || sliceLimit.default

  if (visits.length > sliceLimitForTenant) {
    visits = visits.slice(0, sliceLimitForTenant)
  }
  localStorage.setItem('recent-visited-apps', JSON.stringify(visits))
}

function isValidAppVisit(data) {
  if (typeof data !== 'object' || data === null) return false
  const visit = data
  return typeof visit.appId === 'string' && typeof visit.timestamp === 'string'
}
