import { date } from 'quasar'
import { openDB } from 'idb'

export default {
  name: 'PageHome',
  data() {
    return {
      posts: [],
      loadingPosts: false,
    }
  },
  computed: {
    serviceWorkerSupported() {
      return 'serviceWorker' in navigator
    }
  },
  methods: {
    getPosts() {
      this.loadingPosts = true
      this.$axios.get(`${process.env.API}/posts`)
        .then(response => {
          this.posts = response.data
          this.loadingPosts = false
          if (!navigator.onLine) {
            this.getOnlinePosts();
          }
        })
        .catch(err => {
          this.$q.dialog({
            title: 'Error',
            message: 'Could not download posts'
          })
          this.loadingPosts = false
        })
    },
    getOnlinePosts() {
      let db = openDB('workbox-background-sync').then(db => {
        db.getAll('requests').then(failedRequests => {
          failedRequests.forEach(failedRequest => {
            if (failedRequest.queueName === 'createPostQueue') {
              let request = new Request(failedRequest.requestData.url, failedRequest.requestData)
              request.formData().then(formData => {
                let offlinePost = {}

                offlinePost.id = formData.get('id')
                offlinePost.caption = formData.get('caption')
                offlinePost.location = formData.get('location')
                offlinePost.date = parseInt(formData.get('date'), 10)
                offlinePost.offline = true

                let reader = new FileReader()
                let file = formData.get('file')

                reader.readAsDataURL(file)
                reader.onloadend = () => {
                  offlinePost.imageUrl = reader.result
                  this.posts.unshift(offlinePost)
                }
              })
            }
          })
        }).catch(err => {
          console.log('Error accessing IndexedDB ', err)
        })
      })
    },
    listenForOfflinePostUploaded() {
      const channel = new BroadcastChannel('sw-messages');
      channel.addEventListener('message', event => {
        console.log('Received', event.data);
      });
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  created() {
    this.getPosts()
    if (this.serviceWorkerSupported) {
      this.listenForOfflinePostUploaded()
    }
  }
}
