<script src="./MainLayout.js"></script>
<style src="./MainLayout.sass" lang="sass"></style>

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
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="showAppInstall" class="banner-container bg-primary">
          <div class="constrain">
            <q-banner
              inline-actions
              dense
              class="bg-primary text-white"
            >
              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  text-color="grey-10"
                  icon="eva-camera-outline"
                  font-size="22px"
                />
              </template>

              <b>Install App?</b>

              <template v-slot:action>
                <q-btn
                  @click="installApp"
                  flat
                  dense
                  label="Yes"
                  class="q-px-sm"
                />
                <q-btn
                  @click="showAppInstall = false"
                  flat
                  dense
                  label="Later"
                  class="q-px-sm"
                />
                <q-btn
                  @click="neverShowAppInstallBanner"
                  flat
                  dense
                  label="Never"
                  class="q-px-sm"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>

      <q-tabs
          class="text-grey-10" small-screen-only
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
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>
