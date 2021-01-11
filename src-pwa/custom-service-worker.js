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

/*
* Config
* */

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);


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
  ({ url }) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
);
