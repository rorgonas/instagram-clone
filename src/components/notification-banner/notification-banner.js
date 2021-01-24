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
          console.log('result ', result);
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
    }
  },
  mounted() {
    this.initBanner();
  }
}
