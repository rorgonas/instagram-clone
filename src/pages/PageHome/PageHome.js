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
                offlinePost.date = failedRequest.timestamp
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
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  created() {
    this.getPosts()
  }
}
