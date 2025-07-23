import { getTenantName } from '../../helpers/tenantHelper'
import { translatedJsonData } from '../../i18nextConfig'

const videoImg = '/videos.png'
const gamesImg = '/games.png'
const dailyQuizImg = '/dailyQuiz.png'
const beatTheClockImg = '/beatTheClock.png'
const reactionImg = '/reaction.png'
const jigsawImg = '/jigsaw.png'
const searchImg = '/search.png'
const summarizeImg = '/summarize.png'
const chatPDFImg = '/chatPDF.png'
const memeImg = '/meme.png'
const wellnessImg = '/wellnessScan.png'
const foodScanImg = '/foodScan.png'
const IBLCornerImg = '/tselhalo/IBLCorner.png'
const jadiKreatorImg = '/tselhalo/jadiKreator.png'
const duniaGamesImg = '/tselhalo/duniaGames.png'
const gameHubImage = '/tselhalo/gameHub.png'
const dengarMusikImg = '/tselhalo/dengarMusik.png'
const myTelkomselQuizImg = '/tselhalo/myTelkomselQuiz.png'
const mainAndJelajahImg = '/tselhalo/mainAndJelajah.png'
const pickupLineImage = '/tselhalo/pickupLine.png'
const maxstreamImg = '/tselhalo/maxstream.png'
const horoscopeImg = '/horoscope.png'
const countToTenImg = '/countToTen.png'
const pollsImg = '/polls.png'
const riddlesImg = '/riddles.png'
const typingTestImg = '/typingTest.png'
const byuMixtape = '/byu-navigation-component/mixtape.png'
const byuHoroscope = '/byu-navigation-component/horoscope.png'
const byuCasualGames = '/byu-navigation-component/games.png'
const byuUstream = '/byu-navigation-component/ustream.png'
const byuDailyQuiz = '/byu-navigation-component/dailyQuiz.png'
const byuPodcast = '/byu-navigation-component/podcast.png'
const byuAIAssistant = '/byu-navigation-component/aiAssistant.png'
const byuAnimate = '/byu-navigation-component/animateMe.png'
const byuAvatar = '/byu-navigation-component/avatar.png'
const byuGlowUp = '/byu-navigation-component/glowMeUp.png'
const byuSticker = '/byu-navigation-component/stickerPicker.png'
const byuRiddles = '/byu-navigation-component/riddles.png'
const byuPolls = '/byu-navigation-component/polls.png'
const byuBeatTheClock = '/byu-navigation-component/beatTheClock.png'
const byuCountToTen = '/byu-navigation-component/countToTen.png'
const byuReactionTime = '/byu-navigation-component/reactionTime.png'

export const recentVisitedIconLayout = {
  0: {
    backgroundColor: '#9DD3F9'
  },
  1: {
    backgroundColor: '#EECAFB'
  },
  2: {
    backgroundColor: '#EECAFB'
  },
  3: {
    backgroundColor: '#FFCC96'
  },
  4: {
    backgroundColor: '#ABFF9B'
  },
  5: {
    backgroundColor: '#FDF492'
  },
  6: {
    backgroundColor: '#FFC0D5'
  }
}

export const recentVisitedIconLayoutMobicom = {
  0: {
    backgroundColor: '#FDD3D3'
  },
  1: {
    backgroundColor: '#FDD3D3'
  },
  2: {
    backgroundColor: '#FDD3D3'
  },
  3: {
    backgroundColor: '#FDD3D3'
  },
  4: {
    backgroundColor: '#FDD3D3'
  },
  5: {
    backgroundColor: '#FDD3D3'
  },
  6: {
    backgroundColor: '#FDD3D3'
  }
}

const trendingAppsList = [
  {
    widgetComponentId: 'navigationHoroscope',
    iconId: 'horoscope',
    analyticsKey: 'horoscope',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/horoscope',
      production: 'https://aistore.circles.life/horoscope'
    },
    title: translatedJsonData.explore.horoscope,
    active: true,
    imageSrc: horoscopeImg
  },
  {
    widgetComponentId: 'navigationVideos',
    iconId: 'videos',
    analyticsKey: 'videos',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/trending-posts',
      production: 'https://aistore.circles.life/trending-posts'
    },
    title: translatedJsonData.explore.videos,
    active: true,
    imageSrc: videoImg
  },
  {
    widgetComponentId: 'navigationFunAndWeird',
    iconId: 'funAndWeird',
    analyticsKey: 'fun_and_weird',
    redirectingUrl: {
      staging:
        'https://aistore.circleslife.co/quick-news?category=entertainment',
      production:
        'https://aistore.circles.life/quick-news?category=entertainment'
    },
    title: translatedJsonData.explore.funAndWeird,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationNews',
    iconId: 'news',
    analyticsKey: 'news',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/quick-news?category=world_news',
      production: 'https://aistore.circles.life/quick-news?category=world_news'
    },
    title: translatedJsonData.explore.news,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationStoryNews',
    iconId: 'news',
    analyticsKey: 'story_news',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/quick-news?category=story',
      production: 'https://aistore.circles.life/quick-news?category=story'
    },
    title: translatedJsonData.explore.story,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationMoviesNews',
    iconId: 'news',
    analyticsKey: 'movies_news',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/quick-news?category=movies',
      production: 'https://aistore.circles.life/quick-news?category=movies'
    },
    title: translatedJsonData.explore.movies,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationYouthNews',
    iconId: 'news',
    analyticsKey: 'youth_news',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/quick-news?category=youth',
      production: 'https://aistore.circles.life/quick-news?category=youth'
    },
    title: translatedJsonData.explore.youth,
    active: true,
    imageSrc: ''
  }
]

const funAppsList = [
  {
    widgetComponentId: 'navigationGames',
    iconId: 'games',
    analyticsKey: 'games',
    redirectingUrl: {
      staging: 'https://games-parlour.circleslife.co',
      production: 'https://games-parlour.circles.life'
    },
    title: translatedJsonData.explore.games,
    active: true,
    imageSrc: gamesImg
  },
  {
    widgetComponentId: 'navigationDailyQuiz',
    iconId: 'dailyQuiz',
    analyticsKey: 'daily_quiz',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/trivia',
      production: 'https://aistore.circles.life/trivia'
    },
    title: translatedJsonData.explore.dailyQuiz,
    active: true,
    imageSrc: dailyQuizImg
  },
  {
    widgetComponentId: 'navigationAnimate',
    iconId: 'animate',
    analyticsKey: 'animate',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/photo-animator',
      production: 'https://aistore.circles.life/photo-animator'
    },
    title: translatedJsonData.explore.animate,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationAvatar',
    iconId: 'avatar',
    analyticsKey: 'avatar',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/photo-avatar',
      production: 'https://aistore.circles.life/photo-avatar'
    },
    title: translatedJsonData.explore.avatar,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationSticker',
    iconId: 'sticker',
    analyticsKey: 'sticker',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/sticker-picker',
      production: 'https://aistore.circles.life/sticker-picker'
    },
    title: translatedJsonData.explore.sticker,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationGlowUp',
    iconId: 'glowUp',
    analyticsKey: 'glow_up',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/glow-me-up',
      production: 'https://aistore.circles.life/glow-me-up'
    },
    title: translatedJsonData.explore.glowUp,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationPuzzles',
    iconId: 'puzzles',
    analyticsKey: 'puzzles',
    redirectingUrl: {
      staging: '',
      production: ''
    },
    title: translatedJsonData.explore.puzzles,
    active: false,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationBeatTheClock',
    iconId: 'beatTheClock',
    analyticsKey: 'beat_the_clock',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/ten-seconds-click',
      production: 'https://aistore.circles.life/fun-games/ten-seconds-click'
    },
    title: translatedJsonData.explore.beatTheClock,
    active: true,
    imageSrc: beatTheClockImg
  },
  {
    widgetComponentId: 'navigationReaction',
    iconId: 'reaction',
    analyticsKey: 'reaction',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/reaction-time',
      production: 'https://aistore.circles.life/fun-games/reaction-time'
    },
    title: translatedJsonData.explore.reaction,
    active: true,
    imageSrc: reactionImg
  },
  {
    widgetComponentId: 'navigationRiddles',
    iconId: 'riddles',
    analyticsKey: 'riddles',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/riddle-poll?section=riddles',
      production: 'https://aistore.circles.life/riddle-poll?section=riddles'
    },
    title: translatedJsonData.explore.riddles,
    active: true,
    imageSrc: riddlesImg
  },
  {
    widgetComponentId: 'navigationOpinions',
    iconId: 'opinions',
    analyticsKey: 'opinions',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/riddle-poll?section=poll',
      production: 'https://aistore.circles.life/riddle-poll?section=poll'
    },
    title: translatedJsonData.explore.opinions,
    active: true,
    imageSrc: pollsImg
  },
  {
    widgetComponentId: 'navigationCountToTen',
    iconId: 'countToTen',
    analyticsKey: 'count_to_ten',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/count-to-ten',
      production: 'https://aistore.circles.life/fun-games/count-to-ten'
    },
    title: translatedJsonData.explore.countToTen,
    active: true,
    imageSrc: countToTenImg
  },
  {
    widgetComponentId: 'navigationTypingTest',
    iconId: 'typingTest',
    analyticsKey: 'typing_test',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/typing-test',
      production: 'https://aistore.circles.life/fun-games/typing-test'
    },
    title: translatedJsonData.explore.typingTest,
    active: true,
    imageSrc: typingTestImg
  },
  {
    widgetComponentId: 'navigationJigsaw',
    iconId: 'jigsaw',
    analyticsKey: 'jigsaw',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/puzzles/jigsaw',
      production: 'https://aistore.circles.life/puzzles/jigsaw'
    },
    title: translatedJsonData.explore.jigsaw,
    active: false,
    imageSrc: jigsawImg
  },
  {
    widgetComponentId: 'navigationWordSearch',
    iconId: 'wordSearch',
    analyticsKey: 'word_search',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/puzzles/word_search',
      production: 'https://aistore.circles.life/puzzles/word_search'
    },
    title: translatedJsonData.explore.wordSearch,
    active: false,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationCrossword',
    iconId: 'crossword',
    analyticsKey: 'crossword',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/puzzles/crossword',
      production: 'https://aistore.circles.life/puzzles/crossword'
    },
    title: translatedJsonData.explore.crossword,
    active: false,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationMemoryGame',
    iconId: 'memoryGame',
    analyticsKey: 'memory_game',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/puzzles/memory-game',
      production: 'https://aistore.circles.life/puzzles/memory-game'
    },
    title: translatedJsonData.explore.memoryGame,
    active: false,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationMatchingPairs',
    iconId: 'matchingPairs',
    analyticsKey: 'matching_pairs',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/puzzles/matching-pairs',
      production: 'https://aistore.circles.life/puzzles/matching-pairs'
    },
    title: translatedJsonData.explore.matchingPairs,
    active: false,
    imageSrc: ''
  }
]

const healthAppsList = [
  {
    widgetComponentId: 'navigationFoodScan',
    iconId: 'foodScan',
    analyticsKey: 'food_scan',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/food-scanner',
      production: 'https://aistore.circles.life/food-scanner'
    },
    title: translatedJsonData.explore.foodScan,
    active: false,
    imageSrc: foodScanImg
  },
  {
    widgetComponentId: 'navigationWellnessScan',
    iconId: 'wellnessScan',
    analyticsKey: 'wellness_scan',
    redirectingUrl: {
      staging: 'https://wellness-tracker.circleslife.co/wellness-tracker',
      production: 'https://wellness-tracker.circles.life/wellness-tracker'
    },
    title: translatedJsonData.explore.wellnessScan,
    active: false,
    imageSrc: wellnessImg
  }
]

const productivityAppsList = [
  {
    widgetComponentId: 'navigationSearch',
    iconId: 'search',
    analyticsKey: 'search',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox',
      production: 'https://aistore.circles.life/ai-chatbox'
    },
    title: translatedJsonData.explore.search,
    active: true,
    imageSrc: searchImg
  },
  {
    widgetComponentId: 'navigationSummarize',
    iconId: 'summarize',
    analyticsKey: 'summarize',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/summarize',
      production: 'https://aistore.circles.life/ai-chatbox/summarize'
    },
    title: translatedJsonData.explore.summarize,
    active: true,
    imageSrc: summarizeImg
  },
  {
    widgetComponentId: 'navigationWrite',
    iconId: 'write',
    analyticsKey: 'write',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/write',
      production: 'https://aistore.circles.life/ai-chatbox/write'
    },
    title: translatedJsonData.explore.write,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationCheck',
    iconId: 'check',
    analyticsKey: 'check',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/check',
      production: 'https://aistore.circles.life/ai-chatbox/check'
    },
    title: translatedJsonData.explore.check,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationParaphrase',
    iconId: 'paraphrase',
    analyticsKey: 'paraphrase',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/paraphrase',
      production: 'https://aistore.circles.life/ai-chatbox/paraphrase'
    },
    title: translatedJsonData.explore.paraphrase,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationChatPDF',
    iconId: 'chatPDF',
    analyticsKey: 'chat_pdf',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/chat_pdf',
      production: 'https://aistore.circles.life/ai-chatbox/chat_pdf'
    },
    title: translatedJsonData.explore.chatPDF,
    active: true,
    imageSrc: chatPDFImg
  }
]

const entertainmentAppsList = [
  {
    widgetComponentId: 'navigationJoke',
    iconId: 'joke',
    analyticsKey: 'joke',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/joke',
      production: 'https://aistore.circles.life/ai-chatbox/joke'
    },
    title: translatedJsonData.explore.joke,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationMeme',
    iconId: 'meme',
    analyticsKey: 'meme',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/meme',
      production: 'https://aistore.circles.life/ai-chatbox/meme'
    },
    title: translatedJsonData.explore.meme,
    active: true,
    imageSrc: memeImg
  },
  {
    widgetComponentId: 'navigationQuote',
    iconId: 'quote',
    analyticsKey: 'quote',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/quote',
      production: 'https://aistore.circles.life/ai-chatbox/quote'
    },
    title: translatedJsonData.explore.quote,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationQuiz',
    iconId: 'quiz',
    analyticsKey: 'quiz',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/quiz',
      production: 'https://aistore.circles.life/ai-chatbox/quiz'
    },
    title: translatedJsonData.explore.quiz,
    active: false,
    imageSrc: ''
  }
]

const socialAppsList = [
  {
    widgetComponentId: 'navigationInstaCap',
    iconId: 'instaCap',
    analyticsKey: 'insta_cap',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/instagram_caption',
      production: 'https://aistore.circles.life/ai-chatbox/instagram_caption'
    },
    title: translatedJsonData.explore.instaCap,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationTiktokCap',
    iconId: 'tiktokCap',
    analyticsKey: 'tiktok-cap',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/tiktok_caption',
      production: 'https://aistore.circles.life/ai-chatbox/tiktok_caption'
    },
    title: translatedJsonData.explore.tiktokCap,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationTweet',
    iconId: 'tweet',
    analyticsKey: 'tweet',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/tweet',
      production: 'https://aistore.circles.life/ai-chatbox/tweet'
    },
    title: translatedJsonData.explore.tweet,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationLinkedin',
    iconId: 'linkedIn',
    analyticsKey: 'linkedin',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/linkedin',
      production: 'https://aistore.circles.life/ai-chatbox/linkedin'
    },
    title: translatedJsonData.explore.linkedIn,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationPickupLine',
    iconId: 'pickupLine',
    analyticsKey: 'pickup-line',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/pick_up_line',
      production: 'https://aistore.circles.life/ai-chatbox/pick_up_line'
    },
    title: translatedJsonData.explore.pickupLine,
    active: true,
    imageSrc: ''
  }
]

const travelAppsList = [
  {
    widgetComponentId: 'navigationRecommend',
    iconId: 'recommend',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/recommend',
      production: 'https://aistore.circles.life/ai-chatbox/recommend'
    },
    title: translatedJsonData.explore.recommend,
    active: true,
    imageSrc: ''
  },
  {
    widgetComponentId: 'navigationBuild',
    iconId: 'build',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox/build',
      production: 'https://aistore.circles.life/ai-chatbox/build'
    },
    title: translatedJsonData.explore.build,
    active: true,
    imageSrc: ''
  }
]

const tselhaloValuePropAppList = [
  {
    widgetComponentId: 'navigationCasualGames',
    iconId: 'casualGames',
    redirectingUrl: {
      staging: 'https://games-parlour.circleslife.co',
      production: 'https://games-parlour.circles.life'
    },
    title: translatedJsonData.explore.casualGames,
    active: true,
    imageSrc: gamesImg
  },
  {
    widgetComponentId: 'navigationGameHub',
    iconId: 'gameHub',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/flexible-iframe/mgamehub',
      production: 'https://my.telkomsel.com/app/flexible-iframe/mgamehub'
    },
    title: translatedJsonData.explore.gameHub,
    active: true,
    imageSrc: gameHubImage
  },
  {
    widgetComponentId: 'navigationMyTelkomselQuiz',
    iconId: 'telkomselQuiz',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/flexible-iframe/game-hub-quiz',
      production: 'https://my.telkomsel.com/app/flexible-iframe/game-hub-quiz'
    },
    title: translatedJsonData.explore.myTelkomselQuiz,
    active: true,
    imageSrc: myTelkomselQuizImg
  },
  {
    widgetComponentId: 'navigationMainAndJelajah',
    iconId: 'mainJelajah',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/flexible-iframe/site-majamojo',
      production: 'https://my.telkomsel.com/app/flexible-iframe/site-majamojo'
    },
    title: translatedJsonData.explore.mainAndJelajah,
    active: true,
    imageSrc: mainAndJelajahImg
  },
  {
    widgetComponentId: 'navigationDuniaGames',
    iconId: 'duniaGames',
    redirectingUrl: {
      staging:
        'https://my.telkomsel.com/app/flexible-iframe/commerce-duniagames',
      production:
        'https://my.telkomsel.com/app/flexible-iframe/commerce-duniagames'
    },
    title: translatedJsonData.explore.duniaGames,
    active: true,
    imageSrc: duniaGamesImg
  },
  {
    widgetComponentId: 'navigationJadiKreator',
    iconId: 'jadiKreator',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/flexible-iframe/commerce-fanmate',
      production:
        'https://my.telkomsel.com/app/flexible-iframe/commerce-fanmate'
    },
    title: translatedJsonData.explore.jadiKreator,
    active: true,
    imageSrc: jadiKreatorImg
  },
  {
    widgetComponentId: 'navigationDengarMusik',
    iconId: 'dengarMusik',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/lifestyle/mainscreen/music',
      production: 'https://my.telkomsel.com/app/lifestyle/mainscreen/music'
    },
    title: translatedJsonData.explore.dengarMusik,
    active: true,
    imageSrc: dengarMusikImg
  },
  {
    widgetComponentId: 'navigationIBLCorner',
    iconId: 'IBLCorner',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/flexible-iframe/ibl',
      production: 'https://my.telkomsel.com/app/flexible-iframe/ibl'
    },
    title: translatedJsonData.explore.IBLCorner,
    active: true,
    imageSrc: IBLCornerImg
  },
  {
    widgetComponentId: 'navigationMaxstream',
    iconId: 'maxstream',
    redirectingUrl: {
      staging: 'https://my.telkomsel.com/app/lifestyle/mainscreen/video',
      production: 'https://my.telkomsel.com/app/lifestyle/mainscreen/video'
    },
    title: translatedJsonData.explore.maxstream,
    active: true,
    imageSrc: maxstreamImg
  },
  {
    widgetComponentId: 'navigationBeatTheClock',
    iconId: 'beatTheClock',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/ten-seconds-click',
      production: 'https://aistore.circles.life/fun-games/ten-seconds-click'
    },
    title: translatedJsonData.explore.beatTheClock,
    active: true,
    imageSrc: beatTheClockImg
  },
  {
    widgetComponentId: 'navigationReaction',
    iconId: 'reactionTime',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/reaction-time',
      production: 'https://aistore.circles.life/fun-games/reaction-time'
    },
    title: translatedJsonData.explore.reaction,
    active: true,
    imageSrc: reactionImg
  }
]

export const allAppDrawerSection = [
  {
    categoryId: 'trending',
    title: translatedJsonData.explore.trending,
    desc: translatedJsonData.explore.trendingDesc,
    appList: trendingAppsList
  },
  {
    categoryId: 'health',
    title: translatedJsonData.explore.health,
    desc: translatedJsonData.explore.healthDesc,
    appList: healthAppsList
  },
  {
    categoryId: 'fun',
    title: translatedJsonData.explore.fun,
    desc: translatedJsonData.explore.funDesc,
    appList: funAppsList
  },
  {
    categoryId: 'productivity',
    title: translatedJsonData.explore.productivity,
    desc: translatedJsonData.explore.poweredByChatgpt,
    appList: productivityAppsList
  },
  {
    categoryId: 'entertainment',
    title: translatedJsonData.explore.entertainment,
    desc: translatedJsonData.explore.poweredByChatgpt,
    appList: entertainmentAppsList
  },
  {
    categoryId: 'social',
    title: translatedJsonData.explore.social,
    desc: translatedJsonData.explore.poweredByChatgpt,
    appList: socialAppsList
  },
  {
    categoryId: 'travel',
    title: translatedJsonData.explore.travel,
    desc: translatedJsonData.explore.poweredByChatgpt,
    appList: travelAppsList
  }
]

const tselhaloAIAppsList = [
  {
    widgetComponentId: 'navigationSummarize',
    iconId: 'summariseDrawer',
    redirectingUrl: {
      staging:
        'https://aistore.circleslife.co/ai-chatbox/summarize&tenant=tselhalo',
      production:
        'https://aistore.circles.life/ai-chatbox/summarize&tenant=tselhalo'
    },
    title: translatedJsonData.explore.summarize,
    active: true,
    imageSrc: summarizeImg
  },
  {
    widgetComponentId: 'navigationPickupLine',
    iconId: 'pickupLineDrawer',
    redirectingUrl: {
      staging:
        'https://aistore.circleslife.co/ai-chatbox/pick_up_line&tenant=tselhalo',
      production:
        'https://aistore.circles.life/ai-chatbox/pick_up_line&tenant=tselhalo'
    },
    title: translatedJsonData.explore.pickupLine,
    active: true,
    imageSrc: pickupLineImage
  }
]

const byuPlayAppList = [
  {
    widgetComponentId: 'navigationMixtape',
    iconId: 'mixtape',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/feature-products?section=play',
      production: 'https://aistore.circles.life/feature-products?section=play'
    },
    title: translatedJsonData.byu.widget.navigation.mixtape,
    active: true,
    imageSrc: byuMixtape
  },
  {
    widgetComponentId: 'navigationGames',
    iconId: 'casualGames',
    redirectingUrl: {
      staging: 'https://byu-minisite.majamojo.com/',
      production: 'https://byu-minisite.majamojo.com/'
    },
    title: translatedJsonData.byu.widget.navigation.games,
    active: true,
    imageSrc: byuCasualGames,
    type: 'linkWithMSISDN'
  },
  {
    widgetComponentId: 'navigationUstream',
    iconId: 'ustream',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/byu/video',
      production: 'https://aistore.circles.life/byu/video'
    },
    title: translatedJsonData.byu.widget.navigation.ustream,
    active: true,
    imageSrc: byuUstream
  },
  {
    widgetComponentId: 'navigationPodcast',
    iconId: 'podcast',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/byu/podcast',
      production: 'https://aistore.circles.life/byu/podcast'
    },
    title: translatedJsonData.byu.widget.navigation.podcast,
    active: true,
    imageSrc: byuPodcast
  }
]

const byuAIAssistantList = [
  {
    widgetComponentId: 'navigationAIAssistant',
    iconId: 'aiAssistant',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/ai-chatbox',
      production: 'https://aistore.circles.life/ai-chatbox'
    },
    title: translatedJsonData.byu.widget.navigation.aiAssistant,
    active: true,
    imageSrc: byuAIAssistant
  }
]

const byuFunAppsList = [
  {
    widgetComponentId: 'navigationDailyQuiz',
    iconId: 'dailyQuiz',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/trivia',
      production: 'https://aistore.circles.life/trivia'
    },
    title: translatedJsonData.byu.widget.navigation.dailyQuiz,
    active: true,
    imageSrc: byuDailyQuiz
  },
  {
    widgetComponentId: 'navigationHoroscope',
    iconId: 'horoscope',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/horoscope',
      production: 'https://aistore.circles.life/horoscope'
    },
    title: translatedJsonData.byu.widget.navigation.horoscope,
    active: true,
    imageSrc: byuHoroscope
  },
  {
    widgetComponentId: 'navigationAnimate',
    iconId: 'animate',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/photo-animator',
      production: 'https://aistore.circles.life/photo-animator'
    },
    title: translatedJsonData.byu.widget.navigation.animate,
    active: true,
    imageSrc: byuAnimate
  },
  {
    widgetComponentId: 'navigationGlowUp',
    iconId: 'glowUp',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/glow-me-up',
      production: 'https://aistore.circles.life/glow-me-up'
    },
    title: translatedJsonData.byu.widget.navigation.glowUp,
    active: true,
    imageSrc: byuGlowUp
  },
  {
    widgetComponentId: 'navigationAvatar',
    iconId: 'avatar',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/photo-avatar',
      production: 'https://aistore.circles.life/photo-avatar'
    },
    title: translatedJsonData.byu.widget.navigation.avatar,
    active: true,
    imageSrc: byuAvatar
  },
  {
    widgetComponentId: 'navigationSticker',
    iconId: 'sticker',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/sticker-picker',
      production: 'https://aistore.circles.life/sticker-picker'
    },
    title: translatedJsonData.byu.widget.navigation.sticker,
    active: true,
    imageSrc: byuSticker
  },
  {
    widgetComponentId: 'navigationRiddles',
    iconId: 'riddles',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/riddle-poll?section=riddles',
      production: 'https://aistore.circles.life/riddle-poll?section=riddles'
    },
    title: translatedJsonData.byu.widget.navigation.riddles,
    active: true,
    imageSrc: byuRiddles
  },
  {
    widgetComponentId: 'navigationPolls',
    iconId: 'polls',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/riddle-poll?section=poll',
      production: 'https://aistore.circles.life/riddle-poll?section=poll'
    },
    title: translatedJsonData.byu.widget.navigation.polls,
    active: true,
    imageSrc: byuPolls
  },
  {
    widgetComponentId: 'navigationBeatTheClock',
    iconId: 'beatTheClock',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/ten-seconds-click',
      production: 'https://aistore.circles.life/fun-games/ten-seconds-click'
    },
    title: translatedJsonData.byu.widget.navigation.beatTheClock,
    active: true,
    imageSrc: byuBeatTheClock
  },
  {
    widgetComponentId: 'navigationCountToTen',
    iconId: 'countToTen',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/count-to-ten',
      production: 'https://aistore.circles.life/fun-games/count-to-ten'
    },
    title: translatedJsonData.byu.widget.navigation.countToTen,
    active: true,
    imageSrc: byuCountToTen
  },
  {
    widgetComponentId: 'navigationReactionTime',
    iconId: 'reactionTime',
    redirectingUrl: {
      staging: 'https://aistore.circleslife.co/fun-games/reaction-time',
      production: 'https://aistore.circles.life/fun-games/reaction-time'
    },
    title: translatedJsonData.byu.widget.navigation.reactionTime,
    active: true,
    imageSrc: byuReactionTime
  }
]

export const byuAllAppDrawerSection = [
  {
    categoryId: 'playApps',
    title: translatedJsonData.byu.widget.navigation.play,
    desc: '',
    appList: byuPlayAppList
  },
  {
    categoryId: 'aiApps',
    title: translatedJsonData.byu.widget.navigation.aiAssistant,
    desc: '',
    appList: byuAIAssistantList
  },
  {
    categoryId: 'funApps',
    title: translatedJsonData.byu.widget.navigation.fun,
    desc: '',
    appList: byuFunAppsList
  }
]

export const tselhaloAllAppDrawerSection = [
  {
    categoryId: 'tenantValuedApps',
    title: '',
    desc: '',
    appList: tselhaloValuePropAppList
  },
  {
    categoryId: 'aiApps',
    title: '',
    desc: translatedJsonData.exclusiveContent.aiAppsSectionTitle,
    appList: tselhaloAIAppsList
  }
]

export const getAllAppsSectionList = (tenant) => {
  switch (tenant) {
    case 'tselhalo':
      return tselhaloAllAppDrawerSection
    case 'byu':
      return byuAllAppDrawerSection
    default:
      return allAppDrawerSection
  }
}
export const getAllAppDrawerIconIds = () => {
  const tenant = getTenantName()
  const appDrawerSection = getAllAppsSectionList(tenant)
  let iconIds = []
  appDrawerSection.forEach((section) => {
    section.appList.forEach((app) => {
      if (!iconIds.includes(app.iconId)) {
        iconIds.push(app.iconId)
      }
    })
  })
  return iconIds
}

export const findAppSpecificationByIconId = (targetIconId) => {
  const tenant = getTenantName()
  const appDrawerSection = getAllAppsSectionList(tenant)

  let matchingSectionIndex = null
  let matchingAppIndex = null
  let appSpecification = undefined

  appDrawerSection?.some((section, sectionIndex) => {
    appSpecification = section.appList.find((app, appIndex) => {
      if (app.iconId === targetIconId) {
        matchingSectionIndex = sectionIndex
        matchingAppIndex = appIndex
        return true
      }
      return false
    })
    return appSpecification !== undefined
  })

  return { appSpecification, matchingSectionIndex, matchingAppIndex }
}
