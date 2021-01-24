<script src="./main-layout.js"></script>
<style src="./main-layout.sass" lang="sass"></style>

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
      class="bg-white"
    >
      <install-banner/>
      <tab-navigation/>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>
