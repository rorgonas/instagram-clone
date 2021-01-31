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

// Disable Workbox message in PROD
self.__WB_DISABLE_DEV_LOGS = process.env.NODE_ENV === 'production';


/*
* Check if Background sync is natively supported
* */

let isBackgroundSyncSupported = 'sync' in self.registration

/*
* Queue cretePost
* */

let createPostQueue = null;
if (isBackgroundSyncSupported) {
  createPostQueue = new Queue('createPostQueue', {
    onSync: async ({ queue }) => {
      let entry;
      while (entry = await queue.shiftRequest()) {
        try {
          await fetch(entry.request);
          console.log('Replay successful for request', entry.request);
          const channel = new BroadcastChannel('sw-messages');
          channel.postMessage({ msg: 'offline-post-uploaded'});
        } catch (error) {
          console.error('Replay failed for request', entry.request, error);

          // Put the entry back in the queue and re-throw the error:
          await queue.unshiftRequest(entry);
          throw error;
        }
      }
      console.log('Replay complete!');
    }
  });
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
      if (event.request.url.endsWith('/createPost') && !self.navigator.onLine) {
        const promiseChain = fetch(event.request.clone()).catch((err) => {
          return createPostQueue.pushRequest({request: event.request});
        });

        event.waitUntil(promiseChain);
      }
    });
  }

/*
* Events - push
* */

self.addEventListener('push', event => {
  console.log('Push message received:', event)
  if (event.data) {
    // store push message content in data
    let data = JSON.parse(event.data.text())
    event.waitUntil(
      self.registration.showNotification(
        data.title,
        {
          body: data.body,
          icon: 'icons/icon-128x128.png',
          image: data.imageUrl,
          data: {
            openUrl: data.openUrl
          }
        }
      )
    )
  }
})

/*
* Events - notifications
* */

// Good to maximize User retention rate & make User open app again
self.addEventListener('notificationclick', (event) => {
  let notification = event.notification
  let action = event.action
  let openUrl = notification.data.openUrl

  if (action === 'hello') {
    console.log('Hello button was clicked')
  } else if (action === 'goodbye') {
    console.log('Goodbye button was clicked')
  } else {
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        let clientUsingApp = clientList.find(client => {
          return client.visibilityState === 'visible'
        })

        if (clientUsingApp) {
          clientUsingApp.navigate(openUrl)
          clientUsingApp.focus()
        } else {
          clients.openWindow(openUrl)
        }
      })
    )
  }
  notification.close()
});

// Good for notification feedback: How many times was closed?  What to do to improve UX to avoid close?
self.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed', event)
});
