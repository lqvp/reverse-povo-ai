import { translatedJsonData } from '../i18nextConfig'

const productsData = [
  {
    id: 1,
    name: translatedJsonData.mediaAppName.avatar,
    url: '/images/Avatar_me.jpg',
    route: '/photo-avatar',
  },
  {
    id: 2,
    name: translatedJsonData.mediaAppName.animate,
    hero_url: '/images/Animate_me_gif.gif',
    url: './images/animate_effects/5.gif',
    route: '/photo-animator',
  },
  {
    id: 3,
    name: translatedJsonData.mediaAppName.meme,
    url: '/images/AI_meme_generator.jpg',
    route: '/meme-generator',
  },
  {
    id: 4,
    name: translatedJsonData.mediaAppName.sticker_picker,
    url: '/images/sticker_picker.png',
    route: '/sticker-picker',
  },
  {
    id: 5,
    name: translatedJsonData.mediaAppName.glow_me_up,
    url: '/images/glow_me_up.jpg',
    route: '/glow-me-up',
  },
  {
    id: 6,
    name: translatedJsonData.mediaAppName.face_merge,
    url: '/images/face_merge.jpg',
    route: '/face-merge',
  },
]

export default productsData
