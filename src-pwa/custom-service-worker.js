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

/*
* Config
* */

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);


/*
* Caching strategies
* */

registerRoute(
  ({url}) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
);
