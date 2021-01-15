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
          console.log('failedRequests ', failedRequests)
          failedRequests.forEach(failedRequest => {
            console.log('each request ', failedRequest)
            if (failedRequest.queueName === 'createPostQueue') {
              console.log('found createPostQueue')
              let request = new Request(failedRequest.requestData.url, failedRequest.requestData)
              request.formData().then(formData => {
                console.log('formData ', formData)
                let offlinePost = {}
                offlinePost.id = formData.get('id')
                offlinePost.caption = formData.get('caption')
                offlinePost.location = formData.get('location')
                offlinePost.date = failedRequest.timestamp
                console.log('timestamp ', date)
                offlinePost.offline = true

                let reader = new FileReader()
                let file = formData.get('file')

                reader.readAsDataURL(file)
                reader.onloadend = () => {
                  console.log('onloadend ', reader.result)
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
