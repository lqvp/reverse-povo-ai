import { translatedJsonData } from './i18nextConfig'

// tenant config to have different configurations for different tenants
const tenantConfig = {
  tselhalo: {
    name: 'Tselhalo',
    funWithSelfies: {
      apps: [
        {
          widgetComponentId: 'stickerPicker',
          key: 'stickerPicker',
          title: translatedJsonData.explore.stickerPicker,
          iconImage: '/images/tselHalo/fun_with_selfies/sticker-picker.png',
          cardImage: `/images/tselHalo/fun_with_selfies/sticker-picker-card.png`,
          url: '/sticker-picker',
          analyticsKey: 'sticker_picker'
        },
        {
          widgetComponentId: 'glowMeUp',
          key: 'glowMeUp',
          title: translatedJsonData.explore.glowMeUp,
          iconImage: '/images/tselHalo/fun_with_selfies/glow-me-up.png',
          cardImage: `/images/tselHalo/fun_with_selfies/glow-me-up-card.png`,
          url: '/glow-me-up',
          analyticsKey: 'glow_me_up'
        },
        {
          widgetComponentId: 'avatarMe',
          key: 'avatarMe',
          title: translatedJsonData.explore.avatarMe,
          iconImage: '/images/tselHalo/fun_with_selfies/avatar-me.png',
          cardImage: `/images/tselHalo/fun_with_selfies/avatar-me-card.png`,
          url: '/photo-avatar',
          analyticsKey: 'avatar'
        },
        {
          widgetComponentId: 'animateMe',
          key: 'animateMe',
          title: translatedJsonData.explore.animateMe,
          iconImage: '/images/tselHalo/fun_with_selfies/animate-me.gif',
          cardImage: `/images/tselHalo/fun_with_selfies/animate-me-card.gif`,
          url: '/photo-animator',
          analyticsKey: 'animate'
        }
      ],
      mainPageBackground:
        'linear-gradient(180deg, #D2A49C 0%, rgba(221, 187, 181, 0.74627) 49.25%, rgba(255, 255, 255, 0) 98.76%)',
      headerBackgroundColor:
        'linear-gradient(180deg, #D2A49C 0%, rgba(221, 187, 181, 0.74627) 49.25%, rgba(255, 255, 255, 0) 98.76%)',
      activeTabBackground: '#A12C1A',
      activeTabColor: '#ffffff',
      tabBottomSpacing: '.75rem',
      boxShadow: 'none',
      restrictShare: ['android'],
      restrictDownload: ['ios'],
      restrictShareToCommunity: ['android', 'ios'],
      widgetPadding: '2rem 1rem 0',
      backBtnConfig: {
        spacing: '.75rem 0',
        isBackText: false,
        isAlternateIcon: true,
        iconColor: '#2c3542',
        showTenantWiseBackBtn: false
      },
      callToAction: {
        fontSize: '.875rem',
        background: '#ffffff',
        borderRadius: '32px',
        fontFamily: 'Poppins, serif',
        fontWeight: 400,
        boxShadow: 'none',
        zIndex: 999,
        isAlternateText: true
      },
      lockedIconConfig: {
        position: 'right',
        width: '34px',
        loadingWidth: '66px'
      },
      btnConfig: {
        background: '#ED0226',
        color: '#fff',
        outlineColor: '#ED0226',
        fontSize: '1.25rem',
        fontWeight: 400
      },
      bodyPadding: '0 1.625rem 0',
      widgetTitleSpacing: '0px 0px 0.75rem',
      productTile: {
        fontFamily: 'Telkomsel Batik Sans',
        fontWeight: 700,
        fontSize: '1.5rem',
        spacing: '1rem 0 0 0'
      },
      uploadImageFrame: {
        width: '100%',
        spacing: '1.25rem auto 0',
        background: 'rgba(255, 255, 255, .3)'
      },
      fontColor: '#333333',
      fontFamily: 'Poppins, serif',
      imageUploadHintText: {
        fontWeight: 400,
        suggestTextSpacing: '0 1rem'
      },
      animationOptionGap: '.5rem',
      cameraIconImage: 'images/add-a-photo.png',
      showAllAppsAIStoreTab: true
    },
    colors: {
      primary: '#ED0226',
      secondary: '#A12C1A'
    },
    fontSize: {
      widgetTitle: '16px'
    },
    fonts: {
      primary: 'Poppins, serif',
      secondary: 'Telkomsel Batik Sans',
      widgetTitle: 'Poppins, serif'
    },
    trivia: {
      dailyQuiz: {
        primaryColor: '#9DFF9B',
        secondaryColor: '#004C23',
        headerCounterColor: '#00813B',
        tertiaryColor: '#0BB559',
        centreIconColor: '#578B2D',
        generalBgColor: '#FFF',
        generalTextColor: '#FFF',
        ctaBgColor: '#004C23',
        indicatingTextColor: '#000',
        secondaryTextColor: '#004C23',
        primaryColorGrad: '#9DFF9B',
        tertiaryColorGrad: '#0BB559',
        progressSecondaryColor: '#004C23',
        progressBgColor: '#00813B',
        ctaSecondaryColor: '#004C23',
        nextCTAColor: '#9DFF9B'
      },
      correctIcon: 'images/ai_store_trivia/trivia_correct_Image.png',
      inCorrectIcon: 'images/ai_store_trivia/trivia_incorrect_Image.png',
      dailyQuizImage: 'images/ai_store_trivia/dailyChallengeTrivia.png',
      dailyQuizIcon: 'images/ai_store_trivia/dailyChallengeTriviaCardImage.png'
    },
    appDrawer: {
      navigationScollBtnVisible: true
    },
    aiChatBox: {
      welcomeIconBackground: '#333',
      defaultPromptBackground: '#F4F4F5',
      highlightCardBackground: '#FFFFFF',
      fontFamily: 'Gilroy, sans-serif',
      showFeedbackLink: true,
      showPrivacyText: false,
      showShareResponseButton: true,
      showPersonalInfoWarning: false,
      feedbackLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSenWNlwbKeRkJLnFktCkdm6n7LzQsJseJ5xS2BlcBqY3ZGLqQ/viewform',
      coachmarkEnabled: false,
      backButtonColor: '#000',
      viewAllBtnCTA: {
        background: '#F4F4F5',
        border: '1px solid #ccc',
        textDecoration: 'none'
      },
      persistSearchGlobeSessionEnabled: false
    },
    games: {
      paddingSlides: '0rem',
      addCenterPadding: true,
      slidesToShowInit: 2.5
    },
    funGames: {
      widget: {
        showArrow: true,
        beatTheClockFontSize: '2.25rem',
        centreSlideHeight: '400px',
        reactionTimeCentreHeight: '440px',
        reactionTimeContainerMarginBottom: '-.5rem',
        countToTenResultBottom: '2rem'
      }
    },
    horoscope: {
      ctaWidth: '',
      dayDisplayFormatDDMM: true,
      titleFontWeight: 400,
      colorWidth: '3.5rem',
      exploreSublayout: {
        background: '#77B341',
        borderRadius: '.5rem',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
        descWidth: '90%'
      },
      bgColor: '',
      secondaryBgColor: '#1d1c30',
      showBgImageOnLuckyCharm: true,
      textColor: '#e14f4f',
      ctaBgColor: '#151424',
      iconImageThumbsUp: '/images/horoscope/thumbs_up.svg',
      iconImageThumbsDown: '/images/horoscope/thumbs_down.svg',
      iconImageLove: '/images/horoscope/love_icon.svg',
      iconImageFinance: '/images/horoscope/finance_icon.svg',
      iconImageCareer: '/images/horoscope/profession_icon.svg',
      iconImagePersonal: '/images/horoscope/personal_icon.svg',
      iconImageHealth: '/images/horoscope/health_icon.svg',
      iconImageEmotion: '/images/horoscope/emotions_icon.svg',
      textColorPrimary: '#e4dccc',
      textColorSecondary: '',
      contentBgColor: '#e2d9ca',
      allowLowerCaseConversion: true
    },
    widget: {
      showWidgetTitle: false,
      showNavigationComponents: false,
      showNavigationIconBG: false
    },
    banner: {
      initialSlide: 0.87,
      showBGGradient: false
    }
  },
  mobicom: {
    name: 'Mobicom',
    funWithSelfies: {
      apps: [
        {
          widgetComponentId: 'avatarMe',
          key: 'avatarMe',
          analyticsKey: 'avatar',
          title: translatedJsonData.explore.avatarMe,
          iconImage: '/images/fun_with_selfies/avatar-me.jpg',
          cardImage: `/images/fun_with_selfies/avatar-me-card.png`,
          url: '/photo-avatar'
        },
        {
          widgetComponentId: 'animateMe',
          key: 'animateMe',
          analyticsKey: 'animate',
          title: translatedJsonData.explore.animateMe,
          iconImage: '/images/fun_with_selfies/animate-me.gif',
          cardImage: `/images/fun_with_selfies/animate-me-card.gif`,
          url: '/photo-animator'
        },
        {
          widgetComponentId: 'stickerPicker',
          key: 'stickerPicker',
          analyticsKey: 'sticke_picker',
          title: translatedJsonData.explore.stickerPicker,
          iconImage: '/images/fun_with_selfies/sticker-picker.png',
          cardImage: `/images/fun_with_selfies/sticker-picker-card.png`,
          url: '/sticker-picker'
        },
        {
          widgetComponentId: 'glowMeUp',
          key: 'glowMeUp',
          analyticsKey: 'glow_me_up',
          title: translatedJsonData.explore.glowMeUp,
          iconImage: '/images/fun_with_selfies/glow-me-up.jpg',
          cardImage: `/images/fun_with_selfies/glow-me-up-card.png`,
          url: '/glow-me-up'
        }
      ],
      mainPageBackground: '#FFF',
      headerBackgroundColor: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 40.11%, #FFF 93.34%) url('../public/images/background-image.png') lightgray 0px -25.401px / 100% 111.842% no-repeat`,
      activeTabBackground: '#8D1C18',
      activeTabColor: '#FFF',
      tabBottomSpacing: '2rem',
      boxShadow: '5px 5px 4px 0px rgba(0, 0, 0, 0.25)',
      restrictShare: [],
      restrictDownload: [],
      restrictShareToCommunity: [],
      widgetPadding: '3.5rem 1rem 0',
      backBtnConfig: {
        spacing: '1.3rem 0 0',
        isBackText: true,
        isAlternateIcon: false,
        iconColor: '#000000',
        showTenantWiseBackBtn: false
      },
      callToAction: {
        fontSize: '1rem',
        background: '#EF3D3D',
        borderRadius: '8px',
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 700,
        boxShadow: '0 10px 24px 0 rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        isAlternateText: false
      },
      lockedIconConfig: {
        position: 'center',
        width: '55px',
        loadingWidth: '90px'
      },
      btnConfig: {
        background: '#009eff',
        color: '#fff',
        outlineColor: '#2A333D',
        fontSize: '0.75rem',
        fontWeight: 600
      },
      bodyPadding: '1.5rem 1rem 0',
      widgetTitleSpacing: '0px 0px 1.25rem',
      productTile: {
        fontFamily: 'avenirLT, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        spacing: '1rem 0 0 2rem'
      },
      uploadImageFrame: {
        width: '90%',
        spacing: '1.5rem auto 0',
        background: 'rgba(255, 255, 255, .6)'
      },
      fontColor: '#000000',
      fontFamily: 'avenirLT, sans-serif',
      imageUploadHintText: {
        fontWeight: 500,
        suggestTextSpacing: '0 1rem'
      },
      animationOptionGap: '1rem',
      cameraIconImage: 'images/add-a-photo.png',
      showAllAppsAIStoreTab: true
    },
    colors: {
      primary: '#8D1C18',
      secondary: '#EF3D3D'
    },
    fontSize: {
      widgetTitle: '1.625rem'
    },
    fonts: {
      primary: 'Nunito, sans-serif',
      secondary: 'Nunito, sans-serif',
      widgetTitle: 'Nunito, sans-serif',
      horoscopePrimary: 'Nunito, sans-serif'
    },
    trivia: {
      fontSize: '1.25rem',
      title: {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '2.25rem',
        wordSpacing: '16px',
        fontWeight: 800,
        fontWeightBold: 900,
        textTransform: 'capitalize',
        largeFontSize: '2.5rem',
        medFontSize: '1.5rem'
      },
      trivia: {
        dailyQuiz: {
          primaryColor: '#9DFF9B',
          secondaryColor: '#004C23',
          headerCounterColor: '#00813B',
          tertiaryColor: '#0BB559',
          centreIconColor: '#578B2D',
          generalBgColor: '#FFF',
          generalTextColor: '#FFF',
          ctaBgColor: '#004C23',
          indicatingTextColor: '#000',
          secondaryTextColor: '#004C23',
          primaryColorGrad: '#9DFF9B',
          tertiaryColorGrad: '#0BB559',
          progressSecondaryColor: '#004C23',
          progressBgColor: '#00813B',
          ctaSecondaryColor: '#004C23',
          nextCTAColor: '#9DFF9B'
        }
      },
      correctIcon: 'images/ai_store_trivia/trivia_correct_Image.png',
      inCorrectIcon: 'images/ai_store_trivia/trivia_incorrect_Image.png',
      dailyQuizImage: 'images/ai_store_trivia/dailyChallengeTrivia.png',
      dailyQuizIcon: 'images/ai_store_trivia/dailyChallengeTriviaCardImage.png'
    },
    riddlePoll: {
      fontFamily: 'Nunito, sans-serif',
      ctaPadding: '8px',
      errorTitle: '1.875rem',
      ctaFlexBase: 0,
      widget: {
        riddleTitle: '1.25rem',
        titleFontWeight: 900,
        pollTitle: '1rem'
      }
    },
    funGames: {
      list: {
        borderRadius: '0.75rem',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)'
      },
      widget: {
        spacingTopCTA: '1.75rem',
        fontStyle: 'Nunito, sans-serif',
        beatTheClockFontWeight: 900,
        beatTheClockFontWeightScore: 700,
        reactionTimeFontWeight: 600,
        titleFontSize: '2.25rem',
        descFontSize: '1.25rem',
        beatTheClockFontSize: '2.25rem',
        largeFontSize: '2.5rem',
        beatTheClockSlideHeight: '470px',
        showArrow: true,
        showWidgetTitle: true,
        beatTheClockImgWidth: '12.5rem',
        centreSlideHeight: '400px',
        reactionTimeCentreHeight: '440px',
        countToTenResultBottom: '2rem'
      }
    },
    games: {
      redirectionCTAFontSize: '1.125rem',
      fontStyle: 'Nunito, sans-serif',
      ctaBackground: '#EF3D3D',
      ctaTextColor: '#FFF',
      othersPlayingHide: true,
      showPlayCTA: false,
      paddingSlides: '0rem',
      addCenterPadding: true,
      slidesToShowInit: 2.5
    },
    trendingNews: {
      fontStyle: 'Nunito, sans-serif',
      activeTabBackground: '#8D1C18',
      activeTabColor: '#FFF',
      titleFontWeight: 900
    },
    appDrawer: {
      navigationScollBtnVisible: false,
      fontStyle: 'Nunito, sans-serif',
      titleWeight: 900,
      sectionTitleWeight: 700,
      allAppsCTAColor: '#8D1C18',
      fontWeight: '400'
    },
    aiChatBox: {
      welcomeIconBackground: '#333',
      defaultPromptBackground: '#F4F4F5',
      highlightCardBackground: '#FFFFFF',
      fontFamily: 'Nunito, sans-serif',
      showFeedbackLink: true,
      showPrivacyText: false,
      showShareResponseButton: false,
      showPersonalInfoWarning: false,
      feedbackLink: 'https://forms.gle/PMqufXi4xRhbaHX2A',
      coachmarkEnabled: false,
      backButtonColor: '#000',
      viewAllBtnCTA: {
        background: '#F4F4F5',
        border: '1px solid #ccc',
        textDecoration: 'none'
      },
      persistSearchGlobeSessionEnabled: false
    },
    horoscope: {
      ctaWidth: '100%',
      dayDisplayFormatDDMM: false,
      titleFontWeight: 900,
      colorWidth: '',
      exploreSublayout: {
        background: '#77B341',
        borderRadius: '.5rem',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
        descWidth: '90%'
      },
      bgColor: '',
      secondaryBgColor: '#1d1c30',
      tertiaryBgColor: '#1d1c30',
      showBgImageOnLuckyCharm: true,
      textColor: '#e14f4f',
      ctaBgColor: '#151424',
      iconImageThumbsUp: '/images/horoscope/thumbs_up.svg',
      iconImageThumbsDown: '/images/horoscope/thumbs_down.svg',
      iconImageLove: '/images/horoscope/love_icon.svg',
      iconImageFinance: '/images/horoscope/finance_icon.svg',
      iconImageCareer: '/images/horoscope/profession_icon.svg',
      iconImagePersonal: '/images/horoscope/personal_icon.svg',
      iconImageHealth: '/images/horoscope/health_icon.svg',
      iconImageEmotion: '/images/horoscope/emotions_icon.svg',
      textColorPrimary: '#e4dccc',
      textColorSecondary: '',
      contentBgColor: '#e2d9ca',
      allowLowerCaseConversion: false
    },
    widget: {
      showWidgetTitle: false,
      showNavigationComponents: false,
      showNavigationIconBG: true
    },
    banner: {
      initialSlide: 0.87,
      showBGGradient: false
    }
  },
  byu: {
    name: 'Byu',
    funWithSelfies: {
      apps: [
        {
          widgetComponentId: 'stickerPicker',
          key: 'stickerPicker',
          title: translatedJsonData.explore.stickerPicker,
          iconImage: '/images/tselHalo/fun_with_selfies/sticker-picker.png',
          cardImage: `/images/tselHalo/fun_with_selfies/sticker-picker-card-byu.png`,
          url: '/sticker-picker',
          analyticsKey: 'sticker_picker'
        },
        {
          widgetComponentId: 'glowMeUp',
          key: 'glowMeUp',
          title: translatedJsonData.explore.glowMeUp,
          iconImage: '/images/tselHalo/fun_with_selfies/glow-me-up.png',
          cardImage: `/images/tselHalo/fun_with_selfies/glow-me-up-card-byu.png`,
          url: '/glow-me-up',
          analyticsKey: 'glow_me_up'
        },
        {
          widgetComponentId: 'avatarMe',
          key: 'avatarMe',
          title: translatedJsonData.explore.avatarMe,
          iconImage: '/images/tselHalo/fun_with_selfies/avatar-me.png',
          cardImage: `/images/tselHalo/fun_with_selfies/avatar-me-card-byu.png`,
          url: '/photo-avatar',
          analyticsKey: 'avatar'
        },
        {
          widgetComponentId: 'animateMe',
          key: 'animateMe',
          title: translatedJsonData.explore.animateMe,
          iconImage: '/images/tselHalo/fun_with_selfies/animate-me.gif',
          cardImage: `/images/tselHalo/fun_with_selfies/animate-me-card-byu.gif`,
          url: '/photo-animator',
          analyticsKey: 'animate'
        }
      ],
      mainPageBackground: '#97D064',
      activeTabBackground: '#53C368',
      activeTabColor: '#ffffff',
      tabBottomSpacing: '2rem',
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
      restrictShare: [],
      restrictDownload: [],
      bgMinHeight: '75vh',
      restrictShareToCommunity: [],
      widgetPadding: '2rem 1rem 0',
      backBtnConfig: {
        spacing: '.75rem 0',
        isBackText: false,
        isAlternateIcon: true,
        iconColor: '#2c3542',
        showTenantWiseBackBtn: true
      },
      callToAction: {
        fontSize: '.875rem',
        background: '#ffffff',
        borderRadius: '32px',
        fontFamily: 'Gilroy, serif',
        fontWeight: 400,
        boxShadow: 'none',
        zIndex: 999,
        isAlternateText: true
      },
      lockedIconConfig: {
        position: 'right',
        width: '34px',
        loadingWidth: '66px'
      },
      btnConfig: {
        background: '#53C368',
        color: '#fff',
        outlineColor: '#53C368',
        fontSize: '1rem',
        fontWeight: 400
      },
      bodyPadding: '0 1.625rem 0',
      widgetTitleSpacing: '0px 0px 0.75rem',
      productTile: {
        fontFamily: 'Gilroy, serif',
        fontWeight: 600,
        fontSize: '1rem',
        spacing: '1rem 0 0 0',
        descFontWeight: 200,
        showDesc: true
      },
      uploadImageFrame: {
        width: '100%',
        spacing: '1.25rem auto 0',
        background: 'rgba(255, 255, 255, .3)'
      },
      fontColor: '#000000',
      fontFamily: 'Gilroy, serif',
      imageUploadHintText: {
        fontWeight: 500,
        suggestTextSpacing: '0 3.5rem',
        topSpacing: '2rem'
      },
      animationOptionGap: '1rem',
      cameraIconImage: 'images/add-a-photo-byu.png',
      showAllAppsAIStoreTab: false
    },
    colors: {
      primary: '#8D1C18',
      secondary: '#EF3D3D'
    },
    fontSize: {
      widgetTitle: '1.625rem'
    },
    fonts: {
      primary: 'Gilroy, serif',
      secondary: 'Gilroy, serif',
      widgetTitle: 'Gilroy, serif',
      horoscopePrimary: 'Gilroy, serif'
    },
    trivia: {
      fontSize: '1.25rem',
      title: {
        fontFamily: 'Gilroy, serif',
        fontSize: '2.25rem',
        wordSpacing: '16px',
        fontWeight: 600,
        fontWeightBold: 600,
        textTransform: 'uppercase',
        largeFontSize: '2rem',
        medFontSize: '1rem',
        fontWeightSemiBold: 200
      },
      dailyQuiz: {
        primaryColor: '#97D064',
        secondaryColor: '#004C23',
        headerCounterColor: '#1F2D3D',
        tertiaryColor: '#00500E',
        centreIconColor: '#578B2D',
        generalBgColor: '#FFF',
        generalTextColor: '#1F732E',
        ctaBgColor: '#FFF',
        indicatingTextColor: '#1F2D3D',
        secondaryTextColor: '#1F2D3D',
        primaryColorGrad: '#578B2D',
        tertiaryColorGrad: '#97D064',
        progressSecondaryColor: '#363533',
        progressBgColor: '#848484',
        ctaSecondaryColor: '#578B2D',
        nextCTAColor: '#FFF'
      },
      correctIcon: 'images/ai_store_trivia/trivia_correct_Image_byu.png',
      inCorrectIcon: 'images/ai_store_trivia/trivia_incorrect_Image_byu.png',
      dailyQuizImage: 'images/ai_store_trivia/dailyChallengeTriviaByu.png',
      dailyQuizIcon:
        'images/ai_store_trivia/dailyChallengeTriviaCardImageByu.png'
    },
    riddlePoll: {
      fontFamily: 'Gilroy, serif',
      ctaPadding: '8px',
      errorTitle: '1.875rem',
      ctaFlexBase: 0,
      widget: {
        riddleTitle: '1.25rem',
        titleFontWeight: 900,
        pollTitle: '1rem'
      }
    },
    funGames: {
      list: {
        borderRadius: '',
        boxShadow: ''
      },
      widget: {
        spacingTopCTA: '2rem',
        fontStyle: 'Gilroy, serif',
        beatTheClockFontWeight: 600,
        beatTheClockFontWeightScore: 200,
        reactionTimeFontWeight: 400,
        titleFontSize: '2.25rem',
        descFontSize: '1.25rem',
        largeFontSize: '2.5rem',
        beatTheClockFontSize: '1.5rem',
        beatTheClockSlideHeight: '377px',
        reactionTimeSlideHeight: '377px',
        countToTenSlideHeight: '377px',
        showArrow: false,
        beatTheClockScoreWidth: '5.125rem',
        beatTheClockScoreHeight: '3rem',
        beatTheClockImgWidth: '11.5rem',
        centreSlideHeight: '377px',
        reactionTimeCentreHeight: '377px',
        reactionTimeContainerMarginBottom: '-2.5rem',
        countToTenResultBottom: '.75rem'
      }
    },
    games: {
      redirectionCTAFontSize: '1.125rem',
      fontStyle: 'Gilroy, serif',
      ctaBackground: '#EF3D3D',
      ctaTextColor: '#FFF',
      othersPlayingHide: true,
      showPlayCTA: true,
      paddingSlides: '1.25rem',
      addCenterPadding: true,
      slidesToShowInit: 1.5
    },
    trendingNews: {
      fontStyle: 'Gilroy, serif',
      activeTabBackground: '#8D1C18',
      activeTabColor: '#FFF',
      titleFontWeight: 900
    },
    appDrawer: {
      navigationScollBtnVisible: false,
      fontStyle: 'Gilroy, serif',
      titleWeight: 400,
      sectionTitleWeight: 400,
      allAppsCTAColor: '#8D1C18',
      fontWeight: 100
    },
    aiChatBox: {
      welcomeIconBackground: '#333',
      defaultPromptBackground: '#F4F4F5',
      highlightCardBackground: '#FFFFFF',
      fontFamily: 'Gilroy, sans-serif',
      showFeedbackLink: true,
      showPrivacyText: false,
      showShareResponseButton: true,
      showPersonalInfoWarning: false,
      feedbackLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSenWNlwbKeRkJLnFktCkdm6n7LzQsJseJ5xS2BlcBqY3ZGLqQ/viewform',
      coachmarkEnabled: true,
      backButtonColor: '#1F2D3D',
      viewAllBtnCTA: {
        background: '#F4F4F5',
        border: '1px solid #ccc',
        textDecoration: 'none'
      },
      persistSearchGlobeSessionEnabled: false
    },
    horoscope: {
      ctaWidth: '100%',
      dayDisplayFormatDDMM: false,
      titleFontWeight: 400,
      colorWidth: '3.5rem',
      exploreSublayout: {
        background: '#77B341',
        textColor: '#FFF',
        borderRadius: '.5rem',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
        descWidth: '90%'
      },
      bgColor: '#1F2D3D',
      secondaryBgColor: '#1C3B4F',
      tertiaryBgColor: '#1F2D3D',
      showBgImageOnLuckyCharm: false,
      textColor: '#956C00',
      ctaBgColor: '#1C3B4F',
      iconImageThumbsUp: '/images/horoscope/thumbs_up_byu.svg',
      iconImageThumbsDown: '/images/horoscope/thumbs_down_byu.svg',
      iconImageLove: '/images/horoscope/love_icon_byu.svg',
      iconImageFinance: '/images/horoscope/finance_icon_byu.svg',
      iconImageCareer: '/images/horoscope/profession_icon_byu.svg',
      iconImagePersonal: '/images/horoscope/personal_icon_byu.svg',
      iconImageHealth: '/images/horoscope/health_icon_byu.svg',
      iconImageEmotion: '/images/horoscope/emotions_icon_byu.svg',
      textColorPrimary: '#FFF',
      textColorSecondary: '',
      contentBgColor: '#FDF5DD',
      allowLowerCaseConversion: true
    },
    navigationFeatureProduct: {
      padding: '2rem 1.375rem 0 1.375rem',
      primaryTextColor: '#1F2D3D',
      secondaryTextColor: '#6A7481',
      tertiaryColor: '#FFF',
      lockBorderRadius: '.5rem'
    },
    banner: {
      centerMode: true,
      initialSlide: 1,
      showBGGradient: false
    },
    byu: {
      common: {
        bgGradient:
          'linear-gradient(180deg, var(--Colors-Orange-Freshorange-100, #00BCF1) 0%, #FFF 100%)',
        ctaColor: '#00BCF1',
        ctaSecondaryColor: '#F48120',
        secondaryGrayTextColor: '#DDE2E8',
        showBGGradient: false
      }
    },
    widget: {
      showWidgetTitle: true,
      showNavigationComponents: true,
      showNavigationIconBG: false
    }
  },
  povo: {
    name: 'Povo',
    exploreVersion: 'V4',
    colors: {
      primary: '#ff7043',
      secondary: '#ff7043'
    },
    fontSize: {
      widgetTitle: '1.625rem'
    },
    fonts: {
      primary: 'Rubik, sans-serif',
      secondary: 'SF Pro Display',
      widgetTitle: 'Rubik Mono One,sans-serif',
      horoscopePrimary: 'Plus Jakarta Sans'
    },
    aiChatBox: {
      welcomeIconBackground: '#333',
      defaultPromptBackground: '#F4F4F5',
      highlightCardBackground: '#FFFFFF',
      fontFamily: 'Gilroy, sans-serif',
      showFeedbackLink: true,
      showShareResponseButton: true,
      showPersonalInfoWarning: true,
      feedbackLink: 'https://questant.jp/q/XY75W16R',
      coachmarkEnabled: false,
      backButtonColor: '#1F2D3D',
      viewAllBtnCTA: {
        background: '#FFFFFF',
        border: 'unset',
        textDecoration: 'underline'
      },
      persistSearchGlobeSessionEnabled: true
    }
  },
  onic: {
    name: 'Onic',
    funWithSelfies: {
      apps: [
        {
          widgetComponentId: 'avatarMe',
          key: 'avatarMe',
          analyticsKey: 'avatar',
          title: translatedJsonData.explore.avatarMe,
          iconImage: '/images/fun_with_selfies/avatar-me.jpg',
          cardImage: `/images/fun_with_selfies/avatar-me-card.png`,
          url: '/photo-avatar'
        },
        {
          widgetComponentId: 'animateMe',
          key: 'animateMe',
          analyticsKey: 'animate',
          title: translatedJsonData.explore.animateMe,
          iconImage: '/images/fun_with_selfies/animate-me.gif',
          cardImage: `/images/fun_with_selfies/animate-me-card.gif`,
          url: '/photo-animator'
        },
        {
          widgetComponentId: 'stickerPicker',
          key: 'stickerPicker',
          analyticsKey: 'sticke_picker',
          title: translatedJsonData.explore.stickerPicker,
          iconImage: '/images/fun_with_selfies/sticker-picker.png',
          cardImage: `/images/fun_with_selfies/sticker-picker-card.png`,
          url: '/sticker-picker'
        },
        {
          widgetComponentId: 'glowMeUp',
          key: 'glowMeUp',
          analyticsKey: 'glow_me_up',
          title: translatedJsonData.explore.glowMeUp,
          iconImage: '/images/fun_with_selfies/glow-me-up.jpg',
          cardImage: `/images/fun_with_selfies/glow-me-up-card.png`,
          url: '/glow-me-up'
        }
      ],
      mainPageBackground: null,
      headerBackgroundColor: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 40.11%, #FFF 93.34%) url('../public/images/background-image.png') lightgray 0px -25.401px / 100% 111.842% no-repeat`,
      activeTabBackground: '#ff9166',
      activeTabColor: '#333333',
      tabBottomSpacing: '2rem',
      boxShadow: '5px 5px 4px 0px rgba(0, 0, 0, 0.25)',
      restrictShare: [],
      restrictDownload: [],
      restrictShareToCommunity: [],
      widgetPadding: '3.5rem 1rem 0',
      backBtnConfig: {
        spacing: '1.3rem 0 0',
        isBackText: true,
        isAlternateIcon: false,
        iconColor: '#000000'
      },
      callToAction: {
        fontSize: '1rem',
        background: '#ff7043',
        borderRadius: '8px',
        fontFamily: 'SF Pro Display',
        fontWeight: 700,
        boxShadow: '0 10px 24px 0 rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        isAlternateText: false
      },
      lockedIconConfig: {
        position: 'center',
        width: '55px',
        loadingWidth: '90px'
      },
      btnConfig: {
        background: '#009eff',
        color: '#fff',
        outlineColor: '#2A333D',
        fontSize: '0.75rem',
        fontWeight: 600
      },
      bodyPadding: '1.5rem 1rem 0',
      widgetTitleSpacing: '0px 0px 1.25rem',
      productTile: {
        fontFamily: 'avenirLT, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        spacing: '1rem 0 0 2rem'
      },
      uploadImageFrame: {
        width: '90%',
        spacing: '1.5rem auto 0',
        background: 'rgba(255, 255, 255, .6)'
      },
      fontColor: '#000000',
      fontFamily: 'avenirLT, sans-serif',
      imageUploadHintText: {
        fontWeight: 500
      },
      animationOptionGap: '1rem',
      cameraIconImage: 'images/add-a-photo.png',
      showAllAppsAIStoreTab: true
    },
    colors: {
      primary: '#ff7043',
      secondary: '#ff7043'
    },
    fontSize: {
      widgetTitle: '1.625rem'
    },
    fonts: {
      primary: 'Rubik, sans-serif',
      secondary: 'SF Pro Display',
      widgetTitle: 'Rubik Mono One,sans-serif',
      horoscopePrimary: 'Plus Jakarta Sans'
    },
    funGames: {
      widget: {
        beatTheClockSlideHeight: '433px',
        titleFontSize: '1.5rem',
        beatTheClockFontSize: '2.25rem',
        showArrow: true,
        beatTheClockImgWidth: '12.5rem',
        centreSlideHeight: '377px',
        reactionTimeCentreHeight: '440px',
        reactionTimeContainerMarginBottom: '-.5rem',
        countToTenResultBottom: '2rem'
      }
    },
    appDrawer: {
      navigationScollBtnVisible: true
    },
    games: {
      paddingSlides: '0rem',
      addCenterPadding: true,
      slidesToShowInit: 2.5
    },
    aiChatBox: {
      welcomeIconBackground: '#333',
      defaultPromptBackground: '#F4F4F5',
      highlightCardBackground: '#FFFFFF',
      fontFamily: 'Gilroy, sans-serif',
      showFeedbackLink: true,
      showPrivacyText: true,
      showShareResponseButton: true,
      showPersonalInfoWarning: false,
      feedbackLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSenWNlwbKeRkJLnFktCkdm6n7LzQsJseJ5xS2BlcBqY3ZGLqQ/viewform',
      backButtonColor: '#000',
      viewAllBtnCTA: {
        background: '#F4F4F5',
        border: '1px solid #ccc',
        textDecoration: 'none'
      },
      persistSearchGlobeSessionEnabled: false
    },
    horoscope: {
      ctaWidth: '',
      dayDisplayFormatDDMM: true,
      secondaryBgColor: '#1d1c30',
      tertiaryBgColor: '#000',
      titleFontWeight: 400,
      colorWidth: '3.5rem',
      exploreSublayout: {
        background: '#77B341',
        borderRadius: '.5rem',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
        descWidth: '90%'
      },
      allowLowerCaseConversion: true
    },
    widget: {
      showWidgetTitle: false,
      showNavigationComponents: false,
      showNavigationIconBG: true
    },
    banner: {
      initialSlide: 0.87,
      showBGGradient: false
    }
  },
  default: {
    name: 'Default tenant',
    funWithSelfies: {
      apps: [
        {
          widgetComponentId: 'avatarMe',
          key: 'avatarMe',
          analyticsKey: 'avatar',
          title: translatedJsonData.explore.avatarMe,
          iconImage: '/images/fun_with_selfies/avatar-me.jpg',
          cardImage: `/images/fun_with_selfies/avatar-me-card.png`,
          url: '/photo-avatar'
        },
        {
          widgetComponentId: 'animateMe',
          key: 'animateMe',
          analyticsKey: 'animate',
          title: translatedJsonData.explore.animateMe,
          iconImage: '/images/fun_with_selfies/animate-me.gif',
          cardImage: `/images/fun_with_selfies/animate-me-card.gif`,
          url: '/photo-animator'
        },
        {
          widgetComponentId: 'stickerPicker',
          key: 'stickerPicker',
          analyticsKey: 'sticke_picker',
          title: translatedJsonData.explore.stickerPicker,
          iconImage: '/images/fun_with_selfies/sticker-picker.png',
          cardImage: `/images/fun_with_selfies/sticker-picker-card.png`,
          url: '/sticker-picker'
        },
        {
          widgetComponentId: 'glowMeUp',
          key: 'glowMeUp',
          analyticsKey: 'glow_me_up',
          title: translatedJsonData.explore.glowMeUp,
          iconImage: '/images/fun_with_selfies/glow-me-up.jpg',
          cardImage: `/images/fun_with_selfies/glow-me-up-card.png`,
          url: '/glow-me-up'
        }
      ],
      mainPageBackground: null,
      headerBackgroundColor: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 40.11%, #FFF 93.34%) url('../public/images/background-image.png') lightgray 0px -25.401px / 100% 111.842% no-repeat`,
      activeTabBackground: '#ff9166',
      activeTabColor: '#333333',
      tabBottomSpacing: '2rem',
      boxShadow: '5px 5px 4px 0px rgba(0, 0, 0, 0.25)',
      restrictShare: [],
      restrictDownload: [],
      restrictShareToCommunity: [],
      widgetPadding: '3.5rem 1rem 0',
      backBtnConfig: {
        spacing: '1.3rem 0 0',
        isBackText: true,
        isAlternateIcon: false,
        iconColor: '#000000',
        showTenantWiseBackBtn: false
      },
      callToAction: {
        fontSize: '1rem',
        background: '#ff7043',
        borderRadius: '8px',
        fontFamily: 'SF Pro Display',
        fontWeight: 700,
        boxShadow: '0 10px 24px 0 rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        isAlternateText: false
      },
      lockedIconConfig: {
        position: 'center',
        width: '55px',
        loadingWidth: '90px'
      },
      btnConfig: {
        background: '#009eff',
        color: '#fff',
        outlineColor: '#2A333D',
        fontSize: '0.75rem',
        fontWeight: 600
      },
      bodyPadding: '1.5rem 1rem 0',
      widgetTitleSpacing: '0px 0px 1.25rem',
      productTile: {
        fontFamily: 'avenirLT, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        spacing: '1rem 0 0 2rem'
      },
      uploadImageFrame: {
        width: '90%',
        spacing: '1.5rem auto 0',
        background: 'rgba(255, 255, 255, .6)'
      },
      fontColor: '#000000',
      fontFamily: 'avenirLT, sans-serif',
      imageUploadHintText: {
        fontWeight: 500,
        suggestTextSpacing: '0 1rem'
      },
      animationOptionGap: '1rem',
      cameraIconImage: 'images/add-a-photo.png',
      showAllAppsAIStoreTab: true
    },
    colors: {
      primary: '#ff7043',
      secondary: '#ff7043'
    },
    fontSize: {
      widgetTitle: '1.625rem'
    },
    fonts: {
      primary: 'Rubik, sans-serif',
      secondary: 'SF Pro Display',
      widgetTitle: 'Rubik Mono One,sans-serif',
      horoscopePrimary: 'Plus Jakarta Sans'
    },
    trivia: {
      dailyQuiz: {
        primaryColor: '#9DFF9B',
        secondaryColor: '#004C23',
        headerCounterColor: '#00813B',
        tertiaryColor: '#0BB559',
        centreIconColor: '#FFF',
        generalBgColor: '#FFF',
        generalTextColor: '#FFF',
        ctaBgColor: '#004C23',
        indicatingTextColor: '#000',
        secondaryTextColor: '#004C23',
        primaryColorGrad: '#9DFF9B',
        tertiaryColorGrad: '#0BB559',
        progressSecondaryColor: '#004C23',
        progressBgColor: '#00813B',
        ctaSecondaryColor: '#004C23',
        nextCTAColor: '#9DFF9B'
      },
      correctIcon: 'images/ai_store_trivia/trivia_correct_Image.png',
      inCorrectIcon: 'images/ai_store_trivia/trivia_incorrect_Image.png',
      dailyQuizImage: 'images/ai_store_trivia/dailyChallengeTrivia.png',
      dailyQuizIcon: 'images/ai_store_trivia/dailyChallengeTriviaCardImage.png'
    },
    funGames: {
      widget: {
        generalFontFamily: 'Gilroy',
        beatTheClockSlideHeight: '433px',
        titleFontSize: '1.5rem',
        beatTheClockFontSize: '2.25rem',
        showArrow: true,
        beatTheClockImgWidth: '12.5rem',
        centreSlideHeight: '400px',
        reactionTimeCentreHeight: '440px',
        reactionTimeContainerMarginBottom: '-.5rem',
        countToTenResultBottom: '2rem'
      }
    },
    appDrawer: {
      navigationScollBtnVisible: true
    },
    games: {
      paddingSlides: '0rem',
      addCenterPadding: true,
      slidesToShowInit: 2.5
    },
    aiChatBox: {
      welcomeIconBackground: '#333',
      defaultPromptBackground: '#F4F4F5',
      highlightCardBackground: '#FFFFFF',
      fontFamily: 'Gilroy, sans-serif',
      showFeedbackLink: true,
      showPrivacyText: true,
      showShareResponseButton: true,
      showPersonalInfoWarning: false,
      feedbackLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSenWNlwbKeRkJLnFktCkdm6n7LzQsJseJ5xS2BlcBqY3ZGLqQ/viewform',
      coachmarkEnabled: false,
      viewAllBtnCTA: {
        background: '#F4F4F5',
        border: '1px solid #ccc',
        textDecoration: 'none'
      },
      persistSearchGlobeSessionEnabled: false
    },
    horoscope: {
      ctaWidth: '',
      dayDisplayFormatDDMM: true,
      titleFontWeight: 400,
      colorWidth: '3.5rem',
      exploreSublayout: {
        background: '#77B341',
        borderRadius: '.5rem',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
        descWidth: '90%'
      },
      bgColor: '',
      secondaryBgColor: '#1d1c30',
      tertiaryBgColor: '#000',
      showBgImageOnLuckyCharm: true,
      textColor: '#e14f4f',
      ctaBgColor: '#151424',
      iconImageThumbsUp: '/images/horoscope/thumbs_up.svg',
      iconImageThumbsDown: '/images/horoscope/thumbs_down.svg',
      iconImageLove: '/images/horoscope/love_icon.svg',
      iconImageFinance: '/images/horoscope/finance_icon.svg',
      iconImageCareer: '/images/horoscope/profession_icon.svg',
      iconImagePersonal: '/images/horoscope/personal_icon.svg',
      iconImageHealth: '/images/horoscope/health_icon.svg',
      iconImageEmotion: '/images/horoscope/emotions_icon.svg',
      textColorPrimary: '#e4dccc',
      textColorSecondary: '',
      contentBgColor: '#e2d9ca',
      allowLowerCaseConversion: true
    },
    widget: {
      showWidgetTitle: false,
      showNavigationComponents: false,
      showNavigationIconBG: true
    },
    banner: {
      initialSlide: 0.87,
      showBGGradient: false
    }
  }
}

export const useTenantConfig = (tenantName) => {
  return tenantConfig[tenantName] || tenantConfig['default']
}
