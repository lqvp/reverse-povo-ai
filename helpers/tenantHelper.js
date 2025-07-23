const tenantMapper = {
  'circleslife.co': {
    sgcircles: {
      tenant: 'sgcircles',
      googleAnalyticsFlag: true,
      clevertapFlag: true,
      environment: 'staging',
      appLanguage: 'enSg',
      exploreDeeplinkRoot: 'https://circlescaredevelop.app.link/explore',
      tokenisation: true,
      platformVersionExploreEnabled: false
    },
    onic: {
      tenant: 'onic',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'staging',
      appLanguage: 'enPk',
      exploreDeeplinkRoot: 'https://onic-pk.test-app.link/explore',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    att: {
      tenant: 'att',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'staging',
      appLanguage: 'esMx',
      exploreDeeplinkRoot: '',
      tokenisation: true,
      platformVersionExploreEnabled: false
    },
    tselhalo: {
      tenant: 'tselhalo',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'staging',
      appLanguage: 'idId',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    mobicom: {
      tenant: 'mobicom',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'staging',
      appLanguage: 'mnMn',
      exploreDeeplinkRoot: '',
      tokenisation: true,
      platformVersionExploreEnabled: true
    },
    byu: {
      tenant: 'byu',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'staging',
      appLanguage: 'idBy',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: true
    },
    povo: {
      tenant: 'povo',
      googleAnalyticsFlag: true,
      clevertapFlag: true,
      environment: 'staging',
      appLanguage: 'jpPv',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: false
    }
  },
  'circles.life': {
    sgcircles: {
      tenant: 'sgcircles',
      googleAnalyticsFlag: true,
      clevertapFlag: true,
      environment: 'production',
      appLanguage: 'enSg',
      exploreDeeplinkRoot: 'https://circlescare.app.link/explore',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    onic: {
      tenant: 'onic',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'production',
      appLanguage: 'enPk',
      exploreDeeplinkRoot: 'https://onic-pk.app.link/explore',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    att: {
      tenant: 'att',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'production',
      appLanguage: 'enMx',
      exploreDeeplinkRoot: '',
      tokenisation: true,
      platformVersionExploreEnabled: false
    },
    tselhalo: {
      tenant: 'tselhalo',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'production',
      appLanguage: 'idId',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    mobicom: {
      tenant: 'mobicom',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'production',
      appLanguage: 'mnMn',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    byu: {
      tenant: 'byu',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'production',
      appLanguage: 'idBy',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: true
    },
    povo: {
      tenant: 'povo',
      googleAnalyticsFlag: true,
      clevertapFlag: true,
      environment: 'production',
      appLanguage: 'jpPv',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: true
    }
  },
  localhost: {
    sgcircles: {
      tenant: 'sgcircles',
      googleAnalyticsFlag: false,
      clevertapFlag: false,
      environment: 'local',
      appLanguage: 'enSg',
      exploreDeeplinkRoot: 'https://localhost.app.link/explore',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    onic: {
      tenant: 'onic',
      googleAnalyticsFlag: false,
      clevertapFlag: false,
      environment: 'local',
      appLanguage: 'enPk',
      exploreDeeplinkRoot: 'https://localhost.app.link/explore',
      tokenisation: true,
      platformVersionExploreEnabled: false
    },
    att: {
      tenant: 'att',
      googleAnalyticsFlag: false,
      clevertapFlag: false,
      environment: 'local',
      appLanguage: 'esMx',
      exploreDeeplinkRoot: '',
      tokenisation: true,
      platformVersionExploreEnabled: false
    },
    tselhalo: {
      tenant: 'tselhalo',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'local',
      appLanguage: 'idId',
      exploreDeeplinkRoot: '',
      tokenisation: true,
      platformVersionExploreEnabled: false
    },
    mobicom: {
      tenant: 'mobicom',
      googleAnalyticsFlag: false,
      clevertapFlag: false,
      environment: 'local',
      appLanguage: 'mnMn',
      exploreDeeplinkRoot: '',
      tokenisation: true,
      platformVersionExploreEnabled: true
    },
    byu: {
      tenant: 'byu',
      googleAnalyticsFlag: true,
      clevertapFlag: false,
      environment: 'local',
      appLanguage: 'idBy',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: false
    },
    povo: {
      tenant: 'povo',
      googleAnalyticsFlag: true,
      clevertapFlag: true,
      environment: 'local',
      appLanguage: 'jpPv',
      exploreDeeplinkRoot: '',
      tokenisation: false,
      platformVersionExploreEnabled: false
    }
  }
}

const defaultConfig = {
  tenant: 'sgcircles',
  googleAnalyticsFlag: true,
  clevertapFlag: true,
  environment: 'default',
  appLanguage: 'enSg',
  exploreDeeplinkRoot: ''
}

const exploreTenantMapper = {
  app: 'sgcircles',
  onic: 'onic',
  att: 'att',
  tselhalo: 'tselhalo',
  mobicom: 'mobicom',
  byu: 'byu'
}

export const getConfigForHostname = () => {
  const hostname = window.location.hostname
  const matchingKey = Object.keys(tenantMapper)?.find((key) =>
    hostname?.includes(key)
  )
  if (matchingKey) {
    const environment = tenantMapper[matchingKey]
    const tenantName = getTenantName()
    return environment[tenantName]
      ? environment[tenantName]
      : environment['sgcircles']
  } else {
    return defaultConfig
  }
}

export const getExploreTenantByHostname = () => {
  const hostname = window.location.hostname
  const tenantKey = hostname.split('-')[0]
  return exploreTenantMapper[tenantKey]
}

export const getTenantName = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const urlTenantName = urlParams.get('tenant')
  const exploreTenant = getExploreTenantByHostname()
  const sessionTenantName = sessionStorage.getItem('tenant')
  const tenantName =
    urlTenantName || exploreTenant || sessionTenantName || 'sgcircles'
  return tenantName
}

export const getDeeplinkBaseURL = () => {
  const hostname = tenantMapper[window.location.hostname]
    ? window.location.hostname
    : 'localhost'
  const tenant = getTenantName() || 'sgcircles'
  if (tenantMapper[hostname] === undefined) return
  const exploreDeeplinkURL = tenantMapper[hostname][tenant]?.exploreDeeplinkRoot
  return exploreDeeplinkURL
}

export const getDeeplinkShareVisibility = () => {
  const { environment } = getConfigForHostname()
  return (
    getTenantName() !== 'att' &&
    getTenantName() !== 'mobicom' &&
    getTenantName() !== 'byu' &&
    environment !== 'production'
  )
}

export const tenantObject = {
  onic: 'onic',
  sgcircles: 'sgcircles',
  att: 'att',
  povo: 'povo',
  tselhalo: 'tselhalo'
}

// get feature allowed info
export const useFeatureAllowed = (feature) => {
  const hostname =
    Object.keys(tenantMapper)?.find((key) =>
      window.location.hostname?.includes(key)
    ) || 'localhost'
  const tenantName = getTenantName()

  return tenantMapper[hostname]?.[tenantName]?.[feature] ?? false
}

export const allAllowedFeatures = (feature) => {
  const hostname =
    Object.keys(tenantMapper)?.find((key) =>
      window.location.hostname?.includes(key)
    ) || 'localhost'
  const tenantName = getTenantName()

  return tenantMapper[hostname]?.[tenantName]?.[feature] ?? false
}
