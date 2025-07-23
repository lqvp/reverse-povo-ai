import { translatedJsonData } from '../i18nextConfig'

export const funGamesListData = [
  {
    key: 'beat_the_clock',
    imagePath: `/images/fun_games/list/ten-seconds-click_${translatedJsonData.appLanguage}.png`,
    appRoute: '/fun-games/ten-seconds-click'
  },
  {
    key: 'reaction_time',
    imagePath: `/images/fun_games/list/reaction-time_${translatedJsonData.appLanguage}.png`,
    appRoute: '/fun-games/reaction-time'
  },
  {
    key: 'count_to_ten',
    imagePath: `/images/fun_games/list/count-to-ten_${translatedJsonData.appLanguage}.png`,
    appRoute: '/fun-games/count-to-ten'
  },
  {
    key: 'typing_test',
    imagePath: `/images/fun_games/list/typing-test_${translatedJsonData.appLanguage}.png`,
    appRoute: '/fun-games/typing-test'
  }
]
