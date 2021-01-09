import { date } from 'quasar'
import { Dialog } from 'quasar'

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
      this.$axios.get('http://localhost:3000/posts')
        .then(response => {
          this.posts = response.data
          this.loadingPosts = false
        })
        .catch(err => {
          this.$q.dialog({
            title: 'Error',
            message: 'Could not download posts'
          })
          this.loadingPosts = false
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
