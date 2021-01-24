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
            this.displayGrantedNotification()
          }
        })
      }
    },
    displayGrantedNotification() {
      new Notification('You are subscribed to notification!', {
        body: 'Thanks for subscribing',
        icon: 'icons/icon-128x128.png',
        image: 'icons/icon-128x128.png',
        badge: 'icons/icon-128x128.png',
        dir: 'ltr',
        lang: 'en-US',
        vibrate: '[100, 50, 200]',
        tag: 'confirm-notification',
        renotify: true
      })
    },
    showNotificationsBanner() {
      setTimeout(() => {
        this.showBanner = true
      }, 3000)
    },
    neverShowNotificationsBanner() {
      this.showBanner = false;
      this.$q.localStorage.set('neverShowNotificationsBanner', true)
    }
  },
  mounted() {
    this.initBanner();
  }
}
