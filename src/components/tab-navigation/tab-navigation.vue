<script src="./tab-navigation.js"></script>
<style src="./tab-navigation.sass" lang="sass"></style>

<template>
  <q-tabs
    class="text-grey-10 small-screen-only"
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
</template>
