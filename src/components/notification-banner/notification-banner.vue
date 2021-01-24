<script src="./notification-banner.js"></script>
<style src="./notification-banner.sass" lang="sass"></style>

<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-if="showBanner && pushNotificationSupported" class="banner-container bg-primary">
    <div class="constrain">
      <q-banner class="bg-purple-8 text-white q-mb-md">
        <template v-slot:avatar>
          <q-icon name="eva-bell-outline" />
        </template>

        <b>Would you like to enable notifications?</b>

        <template v-slot:action>
          <q-btn
            @click="enableNotifications"
            flat
            dense
            label="Yes"
            class="q-px-sm"
          />
          <q-btn
            @click="showBanner = false"
            flat
            dense
            label="Later"
            class="q-px-sm"
          />
          <q-btn
            @click="neverShowNotificationsBanner"
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
</template>
