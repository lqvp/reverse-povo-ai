// Image Map for multiple tenants
const cardLayoutMap = {
  default: {
    aries: {
      starSign: 'ariesSign.png',
      top: 60,
      left: -36,
      height: 136,
      width: 202
    },
    sagittarius: {
      starSign: 'sagittariusSign.png',
      top: 50,
      left: 0,
      height: 162,
      width: 154
    },
    cancer: {
      starSign: 'cancerSign.png',
      top: 37,
      left: -15,
      height: 168,
      width: 175
    },
    taurus: {
      starSign: 'taurusSign.png',
      top: 17,
      left: -14,
      height: 198,
      width: 162
    },
    leo: {
      starSign: 'leoSign.png',
      top: 30,
      left: -9,
      height: 183,
      width: 168
    },
    virgo: {
      starSign: 'virgoSign.png',
      top: 37,
      left: 0,
      height: 187,
      width: 141
    },
    gemini: {
      starSign: 'geminiSign.png',
      top: 28,
      left: -24,
      height: 178,
      width: 186
    },
    libra: {
      starSign: 'libraSign.png',
      top: 37,
      left: -19,
      height: 164,
      width: 181
    },
    scorpio: {
      starSign: 'scorpioSign.png',
      top: 31,
      left: 9,
      height: 177,
      width: 131
    },
    capricorn: {
      starSign: 'capricornSign.png',
      top: 18,
      left: 7,
      height: 189,
      width: 140
    },
    aquarius: {
      starSign: 'aquariusSign.png',
      top: 25,
      left: -15,
      height: 192,
      width: 179
    },
    pisces: {
      starSign: 'piscesSign.png',
      top: 56,
      left: 4,
      height: 143,
      width: 155
    },
    default: {
      starSign: 'defaultSign.png',
      top: -27,
      left: -125,
      height: 266,
      width: 266
    }
  },
  byu: {
    aries: {
      starSign: 'ariesSign.png',
      top: 60,
      left: -58,
      height: 136,
      width: 202
    },
    sagittarius: {
      starSign: 'sagittariusSign.png',
      top: 50,
      left: -58,
      height: 162,
      width: 154
    },
    cancer: {
      starSign: 'cancerSign.png',
      top: 37,
      left: -58,
      height: 168,
      width: 175
    },
    taurus: {
      starSign: 'taurusSign.png',
      top: 17,
      left: -58,
      height: 198,
      width: 162
    },
    leo: {
      starSign: 'leoSign.png',
      top: 30,
      left: -58,
      height: 183,
      width: 168
    },
    virgo: {
      starSign: 'virgoSign.png',
      top: 37,
      left: -58,
      height: 187,
      width: 141
    },
    gemini: {
      starSign: 'geminiSign.png',
      top: 28,
      left: -58,
      height: 178,
      width: 186
    },
    libra: {
      starSign: 'libraSign.png',
      top: 37,
      left: -58,
      height: 164,
      width: 181
    },
    scorpio: {
      starSign: 'scorpioSign.png',
      top: 31,
      left: -58,
      height: 177,
      width: 131
    },
    capricorn: {
      starSign: 'capricornSign.png',
      top: 18,
      left: -58,
      height: 189,
      width: 140
    },
    aquarius: {
      starSign: 'aquariusSign.png',
      top: 25,
      left: -58,
      height: 192,
      width: 179
    },
    pisces: {
      starSign: 'piscesSign.png',
      top: 56,
      left: -58,
      height: 143,
      width: 155
    },
    default: {
      starSign: 'defaultSign.png',
      top: -27,
      left: -58,
      height: 266,
      width: 266
    }
  },
  mobicom: {
    Хонь: {
      starSign: 'ariesSign.png',
      top: 60,
      left: -36,
      height: 136,
      width: 202
    },
    Нум: {
      starSign: 'sagittariusSign.png',
      top: 50,
      left: 0,
      height: 162,
      width: 154
    },
    Мэлхий: {
      starSign: 'cancerSign.png',
      top: 37,
      left: -15,
      height: 168,
      width: 175
    },
    Үхэр: {
      starSign: 'taurusSign.png',
      top: 17,
      left: -14,
      height: 198,
      width: 162
    },
    Арслан: {
      starSign: 'leoSign.png',
      top: 30,
      left: -9,
      height: 183,
      width: 168
    },
    Охин: {
      starSign: 'virgoSign.png',
      top: 37,
      left: 0,
      height: 187,
      width: 141
    },
    Ихэр: {
      starSign: 'geminiSign.png',
      top: 28,
      left: -24,
      height: 178,
      width: 186
    },
    Жинлүүр: {
      starSign: 'libraSign.png',
      top: 37,
      left: -19,
      height: 164,
      width: 181
    },
    Хилэнц: {
      starSign: 'scorpioSign.png',
      top: 31,
      left: 9,
      height: 177,
      width: 131
    },
    Матар: {
      starSign: 'capricornSign.png',
      top: 18,
      left: 7,
      height: 189,
      width: 140
    },
    Хумх: {
      starSign: 'aquariusSign.png',
      top: 25,
      left: -15,
      height: 192,
      width: 179
    },
    Загас: {
      starSign: 'piscesSign.png',
      top: 56,
      left: 4,
      height: 143,
      width: 155
    },
    default: {
      starSign: 'defaultSign.png',
      top: -27,
      left: -125,
      height: 266,
      width: 266
    }
  }
}
// To return the sign based layout for a given tenant
export const horoscopeImagePicker = (sign, tenant = 'default') => {
  const tenantMap = cardLayoutMap[tenant] || cardLayoutMap['default']
  return tenantMap[sign] || cardLayoutMap['default'][sign]
}
