import { date } from 'quasar'
import { openDB } from 'idb'
import { NotificationBanner } from './../../components';

export default {
  name: 'PageHome',
  components: {
    NotificationBanner
  },
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

      // add a unique timestamp to the request url for IE so requests dont get cached
      let timestamp = ''
      if (this.$q.platform.is.ie) {
        timestamp = '?timestamp=' + Date.now()
      }
      this.$axios.get(`${process.env.API}/posts${timestamp}`)
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
        if (event.data.msg === 'offline-post-uploaded') {
          let offlinePostCount = this.posts.filter(post => post.offline).length
          this.posts[offlinePostCount - 1].offline = false
        }
      });
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  // Called after our kept-alive component is activated.
  activated() {
    this.getPosts()
  },
  created() {
    if (this.serviceWorkerSupported) {
      this.listenForOfflinePostUploaded()
    }
  }
}
