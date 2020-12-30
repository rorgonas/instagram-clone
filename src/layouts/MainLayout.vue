<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      bordered
      class="bg-white text-grey-10"
    >
      <q-toolbar class="constrain">
        <q-btn
          flat
          round
          dense
          class="large-screen-only q-mr-sm"
          icon="eva-camera-outline"
          size="md"
          to="camera"
        />
        <q-separator
          vertical
          spaced
          inset
          class="large-screen-only"
        />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasagram
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          class="large-screen-only"
          icon="eva-home-outline"
          size="md"
          to="/"
        />
      </q-toolbar>
    </q-header>
    <q-footer
      bordered
      class="bg-white small-screen-only"
    >
        <q-tabs
          class="text-grey-10"
          active-color="primary"
          indicator-color="transparent"
        >
          <q-route-tab
            icon="eva-home-outline"
            to="/"
          />
          <q-route-tab
            icon="eva-camera-outline"
            to="camera"
          />
        </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {

    }
  }
}
</script>

<style lang="sass">
  .q-toolbar
    @media (min-width: $breakpoint-sm-min)
      line-height: 77px
  .q-toolbar__title
    font-size: 30px
    text-align: center
    @media (min-width: $breakpoint-sm-min)
      text-align: left
  .q-footer
    .q-tab__icon
      font-size: 30px
</style>
