let deferredPrompt;

export default {
  name: 'NotificationBanner',
  data () {
    return {
      showBanner: false
    }
  },
  computed: {
    pushNotificationSupported() {
      return 'PushManager' in window
    },
    serviceWorkerSupported() {
      return 'serviceWorker' in navigator
    }
  },
  methods: {
    initBanner() {
      let neverShowNotificationsBanner = this.$q.localStorage.getItem('neverShowNotificationsBanner')

      if (!neverShowNotificationsBanner) {
       this.showNotificationsBanner()
      }
    },
    enableNotifications() {
      if (this.pushNotificationSupported) {
        Notification.requestPermission(result => {
          this.neverShowNotificationsBanner()
          if (result === 'granted') {
            // this.displayGrantedNotification()

            // Check if User has PushSubscription
            this.checkForExistingPushSubscription()
          }
        })
      }
    },
    checkForExistingPushSubscription() {
      if (this.serviceWorkerSupported && this.pushNotificationSupported) {
        let registration = null
        navigator.serviceWorker.ready
          .then(swreg => {
            registration = swreg
            return swreg.pushManager.getSubscription()
          })
          .then(sub => {
            if(!sub) {
              // console.log('Create a new Push Subscription')
              this.createPushSubscription(registration)
            }
          })
      }
    },
    createPushSubscription(registration) {
      // Need to secure push subscription by combining a user private & public key
      const vapidPublicKey  = 'BCAthoxIluJm5zIIesn5uyT2m9q_hs9Mb_AGiaC6eQENHfSVYBKQunDwztFggdUPpscWW3HzCZBuWUn2JOmngMI'
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(newSub => {
        console.log('newSub ', newSub)
      })
    },
    displayGrantedNotification() {
      let notification = {
        msg: 'You are subscribed to notification!',
        options: {
          body: 'Thanks for subscribing',
          icon: 'icons/icon-128x128.png',
          image: 'icons/icon-128x128.png',
          badge: 'icons/icon-128x128.png',
          dir: 'ltr',
          lang: 'en-US',
          vibrate: '[100, 50, 200]',
          tag: 'confirm-notification',
          renotify: true
        }
      }

      // Disable notification display from the browser. It remains just an alternative.
      // new Notification(notification.msg, notification.options)

      // Enable notification display from the service worker
      if (this.serviceWorkerSupported && this.pushNotificationSupported) {
        // create bridge between UI and SW
        navigator.serviceWorker.ready
          .then(swreg => {
            // Extend options with custom actions
            const actions = [
              {
                action: 'hello',
                title: 'Hello',
                icon: 'icons/icon-128x128.png'
              },
              {
                action: 'goodbye',
                title: 'Goodbye',
                icon: 'icons/icon-128x128.png'
              }
            ]
            swreg.showNotification(notification.msg, { ...notification.options, actions })
          })
      }
    },
    showNotificationsBanner() {
      setTimeout(() => {
        this.showBanner = true
      }, 3000)
    },
    neverShowNotificationsBanner() {
      this.showBanner = false;
      this.$q.localStorage.set('neverShowNotificationsBanner', true)
    },
    // Convert the URL safe base64 string to a Uint8Array to pass into the subscribe call
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  },
  mounted() {
    this.initBanner();
  }
}
