import { uid } from 'quasar'
import { Dialog } from 'quasar'
require('md-gum-polyfill')

export default {
  name: 'PageCamera',
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now()
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false
    }
  },
  computed: {
    locationSupported() {
      return 'geolocation' in navigator
    }
  },
  methods: {
    async initCamera() {
      let stream = null;
      const constraints = {
        video: { width: 1280, height: 720 }
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.video.srcObject = stream
      } catch(err) {
        this.hasCameraSupport = false
      }
    },
    captureImage() {
      if (this.imageCaptured) {
        this.enableCamera()
        return
      }
      let video = this.$refs.video
      let canvas = this.$refs.canvas
      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height
      let context = canvas.getContext('2d')
      context.drawImage(video, 0,0, canvas.width, canvas.height)
      this.imageCaptured = true
      this.post.photo = this.dataURItoBlob(canvas.toDataURL())
      this.disableCamera()
    },
    captureImageFallback(file) {
      this.post.photo = file
      const reader = new FileReader();
      let canvas = this.$refs.canvas
      const context = canvas.getContext('2d');

      // Upload image to canvas
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img,0,0)
          this.imageCaptured = true
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    },
    // Transform data URL to Blob image
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      const ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      return new Blob([ab], {type: mimeString});
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
    },
    enableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        this.initCamera()
        this.imageCaptured = false
      })
    },
    getLocation() {
      this.locationLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        this.getCityAndCountry(position)
      }, err => {
        this.locationError(err)
      }, { timeout: 7000 })
    },
    getCityAndCountry(position){
      const { latitude, longitude } = position.coords
      const apiUrl = `https://geocode.xyz/${ latitude },${ longitude }?json=1`
      this.$axios.get(apiUrl).then(result => {
        this.locationSuccess(result)
      }).catch(err => {
        this.locationError(err)
      })
    },
    locationSuccess(result) {
      this.post.location = result.data.city
      if (result.data.country) {
        this.post.location += `, ${ result.data.country }`
      }
      this.locationLoading = false
    },
    locationError(err) {
      this.$q.dialog({
        title: 'Error',
        message: 'Could not find your location'
      })
      this.locationLoading = false
    }
  },
  mounted() {
    this.initCamera()
  },
  beforeDestroy() {
    if(this.hasCameraSupport) {
      this.disableCamera()
    }
  }
}
