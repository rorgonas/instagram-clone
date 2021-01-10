let deferredPrompt;

export default {
  name: 'MainLayout',
  data () {
    return {
      showAppInstall: false
    }
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstall = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          this.neverShowAppInstallBanner();
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstall = false;
      this.$q.localStorage.set('neverShowAppInstallBanner', true)
    }
  },
  mounted() {
    let neverShowAppInstallBanner = this.$q.localStorage.getItem('neverShowAppInstallBanner')

    if (!neverShowAppInstallBanner) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstall = true
        }, 3000)
      });
    }
  }
}
