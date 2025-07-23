export const MILESTONE_LAYOUT_CONFIG = {
  primaryColor: '#FFFB8E',
  secondaryColor: '#D3A400;',
  textColor: '#333',
  pointerColor: '#FF7527',
  textPrimaryColor: '#222',
  textSecondaryColor: '#333'
}

export const ALLOWED_CATEGORIES = ['games', 'quiz', 'riddles', 'polls']

export const MILESTONE_TEXT_DATA = {
  title: '20% off on your next recharge',
  questStart: 'Complete the tasks for each day to unlock your reward!',
  questComplete: 'Congratulations! Reward unlocked',
  questCompleteCTA: 'Claim Reward',
  questError:
    'Oops! Looks like all quests were not completed, Please Try again next week.',
  questCompletionNotification: 'Challenge ends on ',
  dailyQuestCompleteTitle: 'Todays quest completed',
  dailyQuestCompleteSubtitle: 'Next Quest unlocks tomorrow',
  dailyQuestCompleteCTA: 'Back to Explore',
  milestoneCompletionDesc: 'You can claim your Reward now',
  rewardClaimedTitle:
    'Well done! Already claimed the reward for this challenge.',
  couponAvailableThresholdTitle: 'Few offers remaining Hurry up, Play now!'
}

export const MILESTONE_REDEEM_DATA = {
  _id: '',
  title: '20% off on your next recharge',
  subtitle: 'on data top ups',
  questCompletionStatus: true,
  couponCode: 'TP2095QNDB',
  couponSummary: 'Flat 20% off',
  end_date: new Date(),
  totalQuests: 5,
  completedQuests: 0,
  dailyQuestData: {
    id: '',
    title: '',
    quest_url: '',
    order_rank: 2,
    tasks: [
      {
        task_id: 'games',
        title: 'Play a game from the games library',
        url: '',
        completed: false
      },
      {
        task_id: 'riddlePoll',
        title: 'Complete the Riddles and Polls',
        url: '',
        completed: true
      },
      {
        task_id: 'quiz',
        title: 'Complete the Daily Quiz',
        url: '',
        completed: true
      },
      {
        task_id: 'games',
        title: 'Play a game from the games library',
        url: '',
        completed: true
      }
    ]
  }
}
