export const subscriptionOfferData = {
  bold: {
    header: {
      mainText: 'tselHaloSubscription.upgradeTo',
      planSubText: 'tselHaloSubscription.halo',
      planType: 'tselHaloSubscription.bold',
      subText: ''
    },
    planInfo: {
      internet: 50,
      voice: 80,
      sms: 80
    },
    offers: [
      {
        id: '1',
        widgetComponentId: 'freeSubscription',
        offerImageUrl:
          '/images/tselHalo/subscription/free_subscription_banner.png',
        size: 'full'
      },
      {
        id: '2',
        widgetComponentId: 'maxStream',
        offerImageUrl: '/images/tselHalo/subscription/maxstream.png',
        size: 'full'
      },
      {
        id: '3',
        widgetComponentId: 'summarizeContent',
        offerImageUrl: '/images/tselHalo/subscription/summarize_content.png',
        size: 'half'
      },
      {
        id: '4',
        widgetComponentId: 'pickupLine',
        offerImageUrl: '/images/tselHalo/subscription/pickup_line.png',
        size: 'half'
      }
    ],
    planAmount: '100.000',
    subscriptionUrl:
      'https://my.telkomsel.com/app/flexible-iframe/migratetohalo'
  },
  supreme: {
    header: {
      mainText: 'tselHaloSubscription.upgradeTo',
      planSubText: 'tselHaloSubscription.halo',
      planType: 'tselHaloSubscription.supreme',
      subText: 'tselHaloSubscription.headerDescription'
    },
    planInfo: {
      internet: 150,
      voice: 400,
      sms: 400
    },
    offers: [
      {
        id: '1',
        widgetComponentId: 'prime',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'quarter'
      },
      {
        id: '2',
        widgetComponentId: 'lifestyleBenefits',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'quarter'
      },
      {
        id: '3',
        widgetComponentId: 'maxStream',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'quarter'
      },
      {
        id: '4',
        widgetComponentId: 'aiApps',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'quarter'
      },
      {
        id: '4',
        widgetComponentId: 'aiApps',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'full'
      },
      {
        id: '4',
        widgetComponentId: 'aiApps',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'full'
      },
      {
        id: '4',
        widgetComponentId: 'aiApps',
        offerImageUrl: '/images/tselHalo/subscription/free_subscription.png',
        size: 'full'
      }
    ],
    planAmount: '250.000',
    subscriptionUrl: ''
  }
}
