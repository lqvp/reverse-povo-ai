import i18next from 'i18next'

const translate = (key, options) => {
  return i18next.t(`common:${key}`, options)
}

export const getAppName = (pathname) => {
  switch (true) {
    case pathname.includes('photo-avatar'):
      return 'avatar'
    case pathname.includes('photo-animator'):
      return 'animate'
    case pathname.includes('meme-generator'):
      return 'meme'
    case pathname.includes('sticker-picker'):
      return 'sticker_picker'
    case pathname.includes('glow-me-up'):
      return 'glow_me_up'
    case pathname.includes('face-merge'):
      return 'face_merge'
    default:
      return ''
  }
}

export const getApplicationName = (app) => {
  return translate(`mediaAppName.${app}`)
}

export const getApplicationDesc = (app) => {
  return translate(`mediaAppName.${app}_desc`)
}

export const getAppEffectsText = (app) => {
  return translate(`mediaAppEffectsText.${app}`, { defaultValue: '' })
}
