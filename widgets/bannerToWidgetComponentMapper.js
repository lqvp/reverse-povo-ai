import {
  getConfigForHostname,
  getExploreTenantByHostname
} from '../helpers/tenantHelper'

const bannerToWidgetComponentMapper = {
  production: {
    mobicom: {
      daily_quiz: ['trivia_1735881892628']
    }
  },
  staging: {
    sgcircles: {
      daily_quiz: ['daily_quiz_banner_1724734065654']
    },
    onic: {
      daily_quiz: ['daily_quiz_banner_1724734065654']
    },
    mobicom: {
      daily_quiz: ['trivia_1734686631603']
    }
  },
  localhost: {
    sgcircles: {
      daily_quiz: ['daily_quiz_banner_1724734065654']
    },
    onic: {
      daily_quiz: ['daily_quiz_banner_1724734065654']
    },
    mobicom: {
      daily_quiz: ['trivia_1734686631603']
    }
  }
}

// navigation component and the explore section
const exploreComponentToWidgetComponentMapper = {
  production: {
    sgcircles: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    onic: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    att: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    tselhalo: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    mobicom: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    }
  },
  staging: {
    sgcircles: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    onic: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    att: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    tselhalo: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    mobicom: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    }
  },
  local: {
    sgcircles: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    onic: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    att: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    tselhalo: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    },
    mobicom: {
      daily_quiz: ['navigationDailyQuiz'],
      riddle: ['navigationRiddles'],
      more_fun_apps: [
        'navigationBeatTheClock',
        'navigationReaction',
        'navigationTypingTest',
        'navigationCountToTen',
        'moreFunApps'
      ],
      more_riddle_poll: ['moreRiddlePoll'],
      beat_the_clock: ['navigationBeatTheClock'],
      reaction_time: ['navigationReaction'],
      avatar: ['navigationAvatar', 'avatarMe'],
      animate: ['navigationAnimate', 'animateMe']
    }
  }
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

export const getCombinedWidgetComponentMapper = (component) => {
  const tenant = getTenantName()
  const { environment } = getConfigForHostname()
  let combinedMapper = []
  const bannerMapper =
    bannerToWidgetComponentMapper[environment]?.[tenant]?.[component]
  if (bannerMapper) {
    combinedMapper = [...combinedMapper, ...bannerMapper]
  }
  const exploreMapper =
    exploreComponentToWidgetComponentMapper[environment]?.[tenant]?.[component]
  if (exploreMapper) {
    combinedMapper = [...combinedMapper, ...exploreMapper]
  }
  return combinedMapper
}
