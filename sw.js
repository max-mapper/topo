self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open('usfs-tiles').then(function(cache) {
      return cache.addAll([
        '/',
        '/manifest.json',
        'static/leaflet-0.7.5.css',
        'static/font-awesome-4.7.0.min.css',
        'static/L.Control.Locate-0.62.0.min.css',
        'static/leaflet-0.7.5.min.js',
        'static/L.Control.Locate-0.62.0.min.js',
        'static/fontawesome-webfont.woff2?v=4.7.0',
        'static/leaflet.fullscreen-1.0.1.css',
        'static/Leaflet.fullscreen-1.0.1.min.js'
        // 'bundle.js'
      ])
    })
  )
})

self.addEventListener('fetch', function(event) {
  var url = event.request.url
  if (!(/publicbits/.test(url))) {
    console.log('do not proxy', url)
    event.respondWith(fetch(event.request))
    return
  }
  event.respondWith(
    caches.open('usfs-tiles').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        if (response) console.log('cache match')
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone())
          return response
        }, function(error) {
          console.log('fetch err', error)
        })
      })
    })
  )
})