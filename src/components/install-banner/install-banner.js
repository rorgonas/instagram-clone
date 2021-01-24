let deferredPrompt;

export default {
  name: 'InstallBanner',
  data () {
    return {
      showAppInstall: false
    }
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      if (deferredPrompt) {
        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
          .then((choiceResult) => {
            if(choiceResult.outcome === 'dismissed') {
              console.log('User cancelled home screen install');
            } else {
              console.log('User added to home screen');
              this.neverShowAppInstallBanner();
            }
            // We no longer need the prompt.  Clear it up.
            deferredPrompt = null;
        });
      }
    },
    showAppInstallBanner() {
      setTimeout(() => {
        this.showAppInstall = true
      }, 3000)
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
        // Prevent showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.showAppInstallBanner();
      });
    }
  }
}
