import { translatedJsonData } from '../../i18nextConfig'

export const AIChatboxSteps = [
  {
    target: '.ai-chatbox-input-action-toggle-web',
    content: translatedJsonData?.aiChatbox?.coachmark?.stepOne?.desc,
    title: translatedJsonData?.aiChatbox?.coachmark?.stepOne?.title,
    placement: 'top',
    disableBeacon: true,
    spotlightRadius: 140,
    tooltipOffset: -350,
    leftArrow: '10%',
    skipCTAText: translatedJsonData?.aiChatbox?.coachmark?.stepOne?.skipCTAText,
    nextCTAText: translatedJsonData?.aiChatbox?.coachmark?.stepOne?.nextCTAText
  },
  {
    target: '.ai-chatbox-empty-chat-container',
    content: translatedJsonData?.aiChatbox?.coachmark?.stepTwo?.desc,
    title: translatedJsonData?.aiChatbox?.coachmark?.stepTwo?.title,
    placement: 'bottom',
    disableBeacon: true,
    spotlightRadius: 200,
    tooltipOffset: 0,
    leftArrow: '50%',
    skipCTAText: translatedJsonData?.aiChatbox?.coachmark?.stepTwo?.skipCTAText,
    nextCTAText: translatedJsonData?.aiChatbox?.coachmark?.stepTwo?.nextCTAText
  },
  {
    target: '.chatbot-app-title-deco',
    content: translatedJsonData?.aiChatbox?.coachmark?.stepThree?.desc,
    title: translatedJsonData?.aiChatbox?.coachmark?.stepThree?.title,
    placement: 'bottom',
    disableBeacon: true,
    spotlightRadius: 100,
    tooltipOffset: 150,
    leftArrow: '50%',
    skipCTAText:
      translatedJsonData?.aiChatbox?.coachmark?.stepThree?.skipCTAText,
    nextCTAText:
      translatedJsonData?.aiChatbox?.coachmark?.stepThree?.nextCTAText
  }
]
