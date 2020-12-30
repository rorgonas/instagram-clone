<template>
  <q-page class="constrain q-pa-md">
    <q-card
      v-for="post in posts"
      :key="post.id"
      class="card-post q-mb-md"
      flat
      bordered
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">rolland_orgonas</q-item-label>
          <q-item-label caption>
            {{ post.location }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-img :src="post.imageUrl" />
      <q-card-section>
        <div>{{ post.caption }}</div>
        <div class="text-caption text-grey">{{ post.date | niceDate }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
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
      return date.formatDate(value, 'MMMM D h:mm A')
    }
  }
}
</script>

<style lang="sass">
  .card-post
    .q-img
      min-height: 200px
</style>
