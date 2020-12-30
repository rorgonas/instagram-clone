import { date } from 'quasar'

export default {
  name: 'PageHome',
  data() {
    return {
      posts: [
        {
          id: 1,
          caption: 'Our Changing Planet',
          date: Date.now(),
          location: 'Montreal, Canada',
          imageUrl: 'https://cdn.quasar.dev/img/mountains.jpg'
        },
        {
          id: 2,
          caption: 'Parallax Image 2',
          date: Date.now(),
          location: 'San Francisco, USA',
          imageUrl: 'https://cdn.quasar.dev/img/parallax2.jpg'
        },
        {
          id: 3,
          caption: 'Parallax Image 1',
          date: Date.now(),
          location: 'San Francisco, USA',
          imageUrl: 'https://cdn.quasar.dev/img/parallax1.jpg'
        },
        {
          id: 4,
          caption: 'Rocky Mountains',
          date: Date.now(),
          location: 'Alberta, Canada',
          imageUrl: 'https://cdn.quasar.dev/img/mountains.jpg'
        }
      ]
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mmA')
    }
  }
}
