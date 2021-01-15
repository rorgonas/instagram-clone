/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
 * Dependencies
 *  */

  import { precacheAndRoute } from 'workbox-precaching';
  import { registerRoute } from 'workbox-routing';
  import { StaleWhileRevalidate } from 'workbox-strategies';
  import { CacheFirst } from 'workbox-strategies';
  import { ExpirationPlugin } from 'workbox-expiration';
  import { CacheableResponsePlugin } from 'workbox-cacheable-response';
  import { NetworkFirst } from 'workbox-strategies';
  import { Queue } from 'workbox-background-sync';

/*
* Config
* */

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

// Disable Workbox message
self.__WB_DISABLE_DEV_LOGS = true;


/*
* Check if Background sync is natively supported
* */

let isBackgroundSyncSupported = 'sync' in self.registration

/*
* Queue cretePost
* */

let createPostQueue = null;
if (isBackgroundSyncSupported) {
  createPostQueue = new Queue('createPostQueue');
}


/*
* Caching strategies
* */

registerRoute(
  ({ url }) => url.host.startsWith('fonts.g'),
  //Google fonts not rendering when fully offline (see solution: https://github.com/GoogleChrome/workbox/issues/1563)
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/posts'),
  new NetworkFirst()
);

registerRoute(
  ({ url }) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
);


  /*
  * Events - fetch
  * */

  if (isBackgroundSyncSupported) {
    self.addEventListener('fetch', (event) => {
      if (event.request.url.endsWith('/createPost')) {
        const promiseChain = fetch(event.request.clone()).catch((err) => {
          return createPostQueue.pushRequest({request: event.request});
        });

        event.waitUntil(promiseChain);
      }
    });
  }
