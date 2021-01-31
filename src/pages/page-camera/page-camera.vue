<script src="./page-camera.js"></script>
<style lang="sass" src="./page-camera.sass"></style>

<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        v-show="!imageCaptured"
        ref="video"
        class="full-width"
        autoplay
        playsinline
      />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      ></canvas>
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        color="grey-10"
        icon="eva-camera"
        size="lg"
        round
        @click="captureImage"
      />
      <q-file
        v-else
        outlined
        @input="captureImageFallback"
        v-model="imageUpload"
        accept="image/*"
        label="Choose an image"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.caption"
          class="col col-sm-6"
          label="Caption *"
          dense
        />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          :loading="locationLoading"
          v-model="post.location"
          class="col col-sm-6"
          label="Location"
          dense
        >
          <template v-slot:append>
            <q-btn
              v-if="!locationLoading && locationSupported"
              icon="eva-navigation-2-outline"
              @click="getLocation"
              round
              dense
              flat
            />
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn
          class="q-mb-lg"
          color="primary"
          label="Post Image"
          @click="addPost"
          :disable="!post.caption || !post.photo"
          unelevated
          rounded
        />
      </div>
    </div>
  </q-page>
</template>
