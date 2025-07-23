import i18next from 'i18next'
import { getConfigForHostname } from './helpers/tenantHelper'
import common_en from './translation/en/common.json' // english
import common_es from './translation/es/common.json' // spanish
import common_id from './translation/id/common.json' // indonesian
import common_mn from './translation/mn/common.json' // mongolian
import common_idBy from './translation/id/commonBy.json' // indonesian byu
import common_jp from './translation/ja/common.json' // japanese

const { appLanguage } = getConfigForHostname() // Set the locale based on the config

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: appLanguage, // Language to use
  resources: {
    enSg: {
      common: common_en
    },
    enPk: {
      common: common_en
    },
    enMx: {
      common: common_en
    },
    esMx: {
      common: common_es
    },
    enId: {
      common: common_en
    },
    idId: {
      common: common_id
    },
    mnMn: {
      common: common_mn
    },
    idBy: {
      common: common_idBy
    },
    jpPv: {
      common: common_jp
    }
  }
})

// static condition for correct translation for constant files to use
const getTranslatedData = () => {
  switch (appLanguage) {
    case 'enSg':
    case 'enPk':
    case 'enMx':
    case 'enId':
      return common_en
    case 'esMx':
      return common_es
    case 'idId':
      return common_id
    case 'idBy':
      return common_idBy
    case 'mnMn':
      return common_mn
    case 'jpPv':
      return common_jp
    default:
      return common_en
  }
}
export const translatedJsonData = getTranslatedData()

export default i18next
