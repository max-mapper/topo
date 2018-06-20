// tar.gz browser storage import test
//
// RESULTS:
// test 1: 233mb zipped, 22 files, 10MB per file, jpg
// sw cache: 6s
// idb: did not finish (froze browser)
//
// test 2: 55mb zipped, 600 files, ~100kb per file, map tiles
// sw cache: 5s
// idb: 49s

var IDB = false

var gunzip = require('gunzip-maybe')
var path = require('path')
var drop = require('drag-and-drop-files')
var reader = require('filereader-stream')
var concat = require('concat-stream')
var tar = require('tar-stream')
var random = require('random-access-idb')('testdb')

drop(document.body, function (dropped) {
  console.log('importing...')

  window.caches.open('testcache')
    .then(cache => handleDrop(cache))
  
  function handleDrop (cache) {
    var start = new Date()
    reader(dropped[0])
      .pipe(gunzip())
      .pipe(tar.extract())
      .on('entry', function (entry, stream, next) {
        var name = path.join('/', entry.name)

        if (entry.type === 'directory') {
          stream.resume()
          next()
          return
        }

        stream.pipe(concat(function (data) {
          var href = location.href
          href = href.split(href.lastIndexOf('/'))[0]
          loc = href + entry.name
          
          var response = new Response(data, {
            headers: {
              'Content-Type': 'image/jpeg',
              'Content-Length': data.length
            }
          })
          
          if (IDB) {
            return random(entry.name).write(0, data, next)
          }
          
          cache.put(loc, response).then(function() {
            // console.log('put', loc, response, new Date() - start)
            next()            
          })
        }))
      })
      .on('finish', function () {
        console.log('done importing', new Date() - start)
      })
  }
})