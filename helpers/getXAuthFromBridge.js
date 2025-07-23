import { WebbridgePlatformType } from './constant'
import { getWebbridgePlatform, parseAndroidAuthObj } from './webBridgeHelper'

export const fetchNewXAuth = async () => {
  const webbridgePlatform = getWebbridgePlatform()

  return new Promise((resolve, reject) => {
    const fallbackTimeout = setTimeout(() => {
      console.error('Timed out fetching x-auth', fetchNewXAuth.name)
      reject('Error fetching x-auth')
    }, 3000)

    // eslint-disable-next-line no-console
    console.log('fetching new x-auth', fetchNewXAuth.name)

    // call the respsective webbridge functions
    switch (webbridgePlatform) {
      case WebbridgePlatformType.ANDROID:
        window.setXAuthTokenAndroid = (authObject) => {
          // eslint-disable-next-line no-console
          console.log('received new x-auth', fetchNewXAuth.name)

          const parsedObj = parseAndroidAuthObj(authObject)

          // eslint-disable-next-line no-console
          console.log('new x-auth', fetchNewXAuth.name, {
            authObject: authObject,
            newXAuth: parsedObj['X-Auth']
          })
          clearTimeout(fallbackTimeout)
          const newAuthToken = parsedObj['X-Auth']
          if (newAuthToken) {
            resolve(newAuthToken)
          } else {
            reject('Error fetching x-auth')
          }
        }

        // Call the webbridge method for the tenant
        if (window.AndroidShareHandlerV1) {
          window.AndroidShareHandlerV1.refreshXAuthToken('setXAuthTokenAndroid')
        } else if (window.AndroidShareHandler) {
          window.AndroidShareHandler.refreshXAuthToken('setXAuthTokenAndroid')
        } else {
          console.error('No webbridge method found!')
        }
        break

      case WebbridgePlatformType.IOS:
        // declare the callback function which will be called by the native code with the x-auth
        window.setXAuthToken = (_, authObject) => {
          // eslint-disable-next-line no-console
          console.log('received new x-auth', fetchNewXAuth.name)
          // eslint-disable-next-line no-console
          console.log('new x-auth', fetchNewXAuth.name, {
            authObject: JSON.stringify(authObject),
            newXAuth: authObject['X-Auth']
          })
          clearTimeout(fallbackTimeout)
          const newAuthToken = authObject['X-Auth']
          if (newAuthToken) {
            resolve(newAuthToken)
          } else {
            reject('Error fetching x-auth')
          }
        }

        window.webkit.messageHandlers.refreshXAuthTokenHandler.postMessage({
          promiseId: 'fetchXAuth'
        })
        break

      case WebbridgePlatformType.DEV:
        // declare the callback function which will be called by the native code with the x-auth
        window.setXAuthTokenAndroid = (authObject) => {
          // eslint-disable-next-line no-console
          console.log('received new x-auth', fetchNewXAuth.name)

          const parsedObj = parseAndroidAuthObj(authObject)

          // eslint-disable-next-line no-console
          console.log('new x-auth', fetchNewXAuth.name, {
            authObject: authObject,
            newXAuth: parsedObj['X-Auth']
          }) //log to console
          clearTimeout(fallbackTimeout)
          const newAuthToken = parsedObj['X-Auth']
          if (newAuthToken) {
            resolve(newAuthToken)
          } else {
            reject('Error fetching x-auth')
          }
        }

        setTimeout(() => {
          window.setXAuthTokenAndroid(
            JSON.stringify({
              'X-Auth': 'mockAuthE2E'
            })
          )
        }, 500)
        break

      case WebbridgePlatformType.UNSUPPORTED:
      default:
        // eslint-disable-next-line no-console
        console.log('x-auth refetch not supported', fetchNewXAuth.name)
        clearTimeout(fallbackTimeout)
        console.error('x-auth refetch not supported', fetchNewXAuth.name)
        reject('Error fetching x-auth')
        break
    }
  })
}
