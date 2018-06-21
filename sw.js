var appFiles = [
  '/',
  '/manifest.webmanifest',
  '/static/leaflet-0.7.5.css',
  '/static/font-awesome-4.7.0.min.css',
  '/static/L.Control.Locate-0.62.0.min.css',
  '/static/leaflet-0.7.5.min.js',
  '/static/L.Control.Locate-0.62.0.min.js',
  '/fonts/fontawesome-webfont.woff2?v=4.7.0',
  '/static/leaflet.fullscreen-1.0.1.css',
  '/static/Leaflet.fullscreen-1.0.1.min.js',
  '/static/leaflet.offline-1.0.0.css',
  '/static/images/layers-2x.png',
  '/static/images/offline@2x.png',
  '/static/images/fullscreen@2x.png',
  '/bundle.js'
]

self.addEventListener('install', function (event) {
  self.skipWaiting()
})

self.addEventListener('fetch', function(event) {
  var parsed = require('url').parse(event.request.url)
  if (/tiles.maxogden.com/.test(event.request.url)) {
    CACHE = 'usfs-tile'
  } else if (appFiles.indexOf(parsed.pathname) > -1) {
    CACHE = 'topo-app'
  } else {
    console.log('do not proxy', event.request.url)
    event.respondWith(fetch(event.request))
    return
  }
  event.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        if (response) console.log('loading from cache', event.request.url)
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone())
          return response
        }, function(error) {
          console.log('fetch err', error)
        })
      }, function (err) {
        console.error('cache match failed', err)
      })
    })
  )
})

// require('url')
require=function t(e,r,n){function s(h,a){if(!r[h]){if(!e[h]){var i="function"==typeof require&&require
if(!a&&i)return i(h,!0)
if(o)return o(h,!0)
var u=Error("Cannot find module '"+h+"'")
throw u.code="MODULE_NOT_FOUND",u}var c=r[h]={exports:{}}
e[h][0].call(c.exports,function(t){var r=e[h][1][t]
return s(r?r:t)},c,c.exports,t,e,r,n)}return r[h].exports}for(var o="function"==typeof require&&require,h=0;h<n.length;h++)s(n[h])
return s}({1:[function(t,e,r){(function(t){!function(n){function s(t){throw new RangeError(k[t])}function o(t,e){for(var r=t.length,n=[];r--;)n[r]=e(t[r])
return n}function h(t,e){var r=t.split("@"),n=""
r.length>1&&(n=r[0]+"@",t=r[1]),t=t.replace(E,".")
var s=t.split("."),h=o(s,e).join(".")
return n+h}function a(t){for(var e,r,n=[],s=0,o=t.length;o>s;)e=t.charCodeAt(s++),e>=55296&&56319>=e&&o>s?(r=t.charCodeAt(s++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),s--)):n.push(e)
return n}function i(t){return o(t,function(t){var e=""
return t>65535&&(t-=65536,e+=P(t>>>10&1023|55296),t=56320|1023&t),e+=P(t)}).join("")}function u(t){return 10>t-48?t-22:26>t-65?t-65:26>t-97?t-97:x}function c(t,e){return t+22+75*(26>t)-((0!=e)<<5)}function f(t,e,r){var n=0
for(t=r?L(t/A):t>>1,t+=L(t/e);t>F*q>>1;n+=x)t=L(t/F)
return L(n+(F+1)*t/(t+C))}function l(t){var e,r,n,o,h,a,c,l,p,m,v=[],d=t.length,y=0,g=U,b=I
for(r=t.lastIndexOf(R),0>r&&(r=0),n=0;r>n;++n)t.charCodeAt(n)>=128&&s("not-basic"),v.push(t.charCodeAt(n))
for(o=r>0?r+1:0;d>o;){for(h=y,a=1,c=x;o>=d&&s("invalid-input"),l=u(t.charCodeAt(o++)),(l>=x||l>L((O-y)/a))&&s("overflow"),y+=l*a,p=b>=c?w:c>=b+q?q:c-b,!(p>l);c+=x)m=x-p,a>L(O/m)&&s("overflow"),a*=m
e=v.length+1,b=f(y-h,e,0==h),L(y/e)>O-g&&s("overflow"),g+=L(y/e),y%=e,v.splice(y++,0,g)}return i(v)}function p(t){var e,r,n,o,h,i,u,l,p,m,v,d,y,g,b,j=[]
for(t=a(t),d=t.length,e=U,r=0,h=I,i=0;d>i;++i)v=t[i],128>v&&j.push(P(v))
for(n=o=j.length,o&&j.push(R);d>n;){for(u=O,i=0;d>i;++i)v=t[i],v>=e&&u>v&&(u=v)
for(y=n+1,u-e>L((O-r)/y)&&s("overflow"),r+=(u-e)*y,e=u,i=0;d>i;++i)if(v=t[i],e>v&&++r>O&&s("overflow"),v==e){for(l=r,p=x;m=h>=p?w:p>=h+q?q:p-h,!(m>l);p+=x)b=l-m,g=x-m,j.push(P(c(m+b%g,0))),l=L(b/g)
j.push(P(c(l,0))),h=f(r,y,n==o),r=0,++n}++r,++e}return j.join("")}function m(t){return h(t,function(t){return N.test(t)?l(t.slice(4).toLowerCase()):t})}function v(t){return h(t,function(t){return S.test(t)?"xn--"+p(t):t})}var d="object"==typeof r&&r&&!r.nodeType&&r,y="object"==typeof e&&e&&!e.nodeType&&e,g="object"==typeof t&&t;(g.global===g||g.window===g||g.self===g)&&(n=g)
var b,j,O=2147483647,x=36,w=1,q=26,C=38,A=700,I=72,U=128,R="-",N=/^xn--/,S=/[^\x20-\x7E]/,E=/[\x2E\u3002\uFF0E\uFF61]/g,k={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},F=x-w,L=Math.floor,P=String.fromCharCode
if(b={version:"1.4.1",ucs2:{decode:a,encode:i},decode:l,encode:p,toASCII:v,toUnicode:m},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return b})
else if(d&&y)if(e.exports==d)y.exports=b
else for(j in b)b.hasOwnProperty(j)&&(d[j]=b[j])
else n.punycode=b}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(t,e,r){"use strict"
function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}e.exports=function(t,e,r,o){e=e||"&",r=r||"="
var h={}
if("string"!=typeof t||0===t.length)return h
var a=/\+/g
t=t.split(e)
var i=1e3
o&&"number"==typeof o.maxKeys&&(i=o.maxKeys)
var u=t.length
i>0&&u>i&&(u=i)
for(var c=0;u>c;++c){var f,l,p,m,v=t[c].replace(a,"%20"),d=v.indexOf(r)
d>=0?(f=v.substr(0,d),l=v.substr(d+1)):(f=v,l=""),p=decodeURIComponent(f),m=decodeURIComponent(l),n(h,p)?s(h[p])?h[p].push(m):h[p]=[h[p],m]:h[p]=m}return h}
var s=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},{}],3:[function(t,e,r){"use strict"
function n(t,e){if(t.map)return t.map(e)
for(var r=[],n=0;n<t.length;n++)r.push(e(t[n],n))
return r}var s=function(t){switch(typeof t){case"string":return t
case"boolean":return t?"true":"false"
case"number":return isFinite(t)?t:""
default:return""}}
e.exports=function(t,e,r,a){return e=e||"&",r=r||"=",null===t&&(t=void 0),"object"==typeof t?n(h(t),function(h){var a=encodeURIComponent(s(h))+r
return o(t[h])?n(t[h],function(t){return a+encodeURIComponent(s(t))}).join(e):a+encodeURIComponent(s(t[h]))}).join(e):a?encodeURIComponent(s(a))+r+encodeURIComponent(s(t)):""}
var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},h=Object.keys||function(t){var e=[]
for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r)
return e}},{}],4:[function(t,e,r){"use strict"
r.decode=r.parse=t("./decode"),r.encode=r.stringify=t("./encode")},{"./decode":2,"./encode":3}],5:[function(t,e,r){"use strict"
e.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},{}],url:[function(t,e,r){"use strict"
function n(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function s(t,e,r){if(t&&u.isObject(t)&&t instanceof n)return t
var s=new n
return s.parse(t,e,r),s}function o(t){return u.isString(t)&&(t=s(t)),t instanceof n?t.format():n.prototype.format.call(t)}function h(t,e){return s(t,!1,!0).resolve(e)}function a(t,e){return t?s(t,!1,!0).resolveObject(e):e}var i=t("punycode"),u=t("./util")
r.parse=s,r.resolve=h,r.resolveObject=a,r.format=o,r.Url=n
var c=/^([a-z0-9.+-]+:)/i,f=/:[0-9]*$/,l=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,p=["<",">",'"',"`"," ","\r","\n","	"],m=["{","}","|","\\","^","`"].concat(p),v=["'"].concat(m),d=["%","/","?",";","#"].concat(v),y=["/","?","#"],g=255,b=/^[+a-z0-9A-Z_-]{0,63}$/,j=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,O={javascript:!0,"javascript:":!0},x={javascript:!0,"javascript:":!0},w={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},q=t("querystring")
n.prototype.parse=function(t,e,r){if(!u.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t)
var n=t.indexOf("?"),s=-1!==n&&n<t.indexOf("#")?"?":"#",o=t.split(s),h=/\\/g
o[0]=o[0].replace(h,"/"),t=o.join(s)
var a=t
if(a=a.trim(),!r&&1===t.split("#").length){var f=l.exec(a)
if(f)return this.path=a,this.href=a,this.pathname=f[1],f[2]?(this.search=f[2],e?this.query=q.parse(this.search.substr(1)):this.query=this.search.substr(1)):e&&(this.search="",this.query={}),this}var p=c.exec(a)
if(p){p=p[0]
var m=p.toLowerCase()
this.protocol=m,a=a.substr(p.length)}if(r||p||a.match(/^\/\/[^@\/]+@[^@\/]+/)){var C="//"===a.substr(0,2)
!C||p&&x[p]||(a=a.substr(2),this.slashes=!0)}if(!x[p]&&(C||p&&!w[p])){for(var A=-1,I=0;I<y.length;I++){var U=a.indexOf(y[I]);-1!==U&&(-1===A||A>U)&&(A=U)}var R,N
N=-1===A?a.lastIndexOf("@"):a.lastIndexOf("@",A),-1!==N&&(R=a.slice(0,N),a=a.slice(N+1),this.auth=decodeURIComponent(R)),A=-1
for(var I=0;I<d.length;I++){var U=a.indexOf(d[I]);-1!==U&&(-1===A||A>U)&&(A=U)}-1===A&&(A=a.length),this.host=a.slice(0,A),a=a.slice(A),this.parseHost(),this.hostname=this.hostname||""
var S="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1]
if(!S)for(var E=this.hostname.split(/\./),I=0,k=E.length;k>I;I++){var F=E[I]
if(F&&!F.match(b)){for(var L="",P=0,T=F.length;T>P;P++)L+=F.charCodeAt(P)>127?"x":F[P]
if(!L.match(b)){var $=E.slice(0,I),_=E.slice(I+1),z=F.match(j)
z&&($.push(z[1]),_.unshift(z[2])),_.length&&(a="/"+_.join(".")+a),this.hostname=$.join(".")
break}}}this.hostname.length>g?this.hostname="":this.hostname=this.hostname.toLowerCase(),S||(this.hostname=i.toASCII(this.hostname))
var D=this.port?":"+this.port:"",H=this.hostname||""
this.host=H+D,this.href+=this.host,S&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==a[0]&&(a="/"+a))}if(!O[m])for(var I=0,k=v.length;k>I;I++){var K=v[I]
if(-1!==a.indexOf(K)){var M=encodeURIComponent(K)
M===K&&(M=escape(K)),a=a.split(K).join(M)}}var Z=a.indexOf("#");-1!==Z&&(this.hash=a.substr(Z),a=a.slice(0,Z))
var B=a.indexOf("?")
if(-1!==B?(this.search=a.substr(B),this.query=a.substr(B+1),e&&(this.query=q.parse(this.query)),a=a.slice(0,B)):e&&(this.search="",this.query={}),a&&(this.pathname=a),w[m]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var D=this.pathname||"",G=this.search||""
this.path=D+G}return this.href=this.format(),this},n.prototype.format=function(){var t=this.auth||""
t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@")
var e=this.protocol||"",r=this.pathname||"",n=this.hash||"",s=!1,o=""
this.host?s=t+this.host:this.hostname&&(s=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(s+=":"+this.port)),this.query&&u.isObject(this.query)&&Object.keys(this.query).length&&(o=q.stringify(this.query))
var h=this.search||o&&"?"+o||""
return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||w[e])&&s!==!1?(s="//"+(s||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):s||(s=""),n&&"#"!==n.charAt(0)&&(n="#"+n),h&&"?"!==h.charAt(0)&&(h="?"+h),r=r.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),h=h.replace("#","%23"),e+s+r+h+n},n.prototype.resolve=function(t){return this.resolveObject(s(t,!1,!0)).format()},n.prototype.resolveObject=function(t){if(u.isString(t)){var e=new n
e.parse(t,!1,!0),t=e}for(var r=new n,s=Object.keys(this),o=0;o<s.length;o++){var h=s[o]
r[h]=this[h]}if(r.hash=t.hash,""===t.href)return r.href=r.format(),r
if(t.slashes&&!t.protocol){for(var a=Object.keys(t),i=0;i<a.length;i++){var c=a[i]
"protocol"!==c&&(r[c]=t[c])}return w[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(t.protocol&&t.protocol!==r.protocol){if(!w[t.protocol]){for(var f=Object.keys(t),l=0;l<f.length;l++){var p=f[l]
r[p]=t[p]}return r.href=r.format(),r}if(r.protocol=t.protocol,t.host||x[t.protocol])r.pathname=t.pathname
else{for(var m=(t.pathname||"").split("/");m.length&&!(t.host=m.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==m[0]&&m.unshift(""),m.length<2&&m.unshift(""),r.pathname=m.join("/")}if(r.search=t.search,r.query=t.query,r.host=t.host||"",r.auth=t.auth,r.hostname=t.hostname||t.host,r.port=t.port,r.pathname||r.search){var v=r.pathname||"",d=r.search||""
r.path=v+d}return r.slashes=r.slashes||t.slashes,r.href=r.format(),r}var y=r.pathname&&"/"===r.pathname.charAt(0),g=t.host||t.pathname&&"/"===t.pathname.charAt(0),b=g||y||r.host&&t.pathname,j=b,O=r.pathname&&r.pathname.split("/")||[],m=t.pathname&&t.pathname.split("/")||[],q=r.protocol&&!w[r.protocol]
if(q&&(r.hostname="",r.port=null,r.host&&(""===O[0]?O[0]=r.host:O.unshift(r.host)),r.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===m[0]?m[0]=t.host:m.unshift(t.host)),t.host=null),b=b&&(""===m[0]||""===O[0])),g)r.host=t.host||""===t.host?t.host:r.host,r.hostname=t.hostname||""===t.hostname?t.hostname:r.hostname,r.search=t.search,r.query=t.query,O=m
else if(m.length)O||(O=[]),O.pop(),O=O.concat(m),r.search=t.search,r.query=t.query
else if(!u.isNullOrUndefined(t.search)){if(q){r.hostname=r.host=O.shift()
var C=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1
C&&(r.auth=C.shift(),r.host=r.hostname=C.shift())}return r.search=t.search,r.query=t.query,u.isNull(r.pathname)&&u.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r}if(!O.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r
for(var A=O.slice(-1)[0],I=(r.host||t.host||O.length>1)&&("."===A||".."===A)||""===A,U=0,R=O.length;R>=0;R--)A=O[R],"."===A?O.splice(R,1):".."===A?(O.splice(R,1),U++):U&&(O.splice(R,1),U--)
if(!b&&!j)for(;U--;U)O.unshift("..")
!b||""===O[0]||O[0]&&"/"===O[0].charAt(0)||O.unshift(""),I&&"/"!==O.join("/").substr(-1)&&O.push("")
var N=""===O[0]||O[0]&&"/"===O[0].charAt(0)
if(q){r.hostname=r.host=N?"":O.length?O.shift():""
var C=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1
C&&(r.auth=C.shift(),r.host=r.hostname=C.shift())}return b=b||r.host&&O.length,b&&!N&&O.unshift(""),O.length?r.pathname=O.join("/"):(r.pathname=null,r.path=null),u.isNull(r.pathname)&&u.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=t.auth||r.auth,r.slashes=r.slashes||t.slashes,r.href=r.format(),r},n.prototype.parseHost=function(){var t=this.host,e=f.exec(t)
e&&(e=e[0],":"!==e&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},{"./util":5,punycode:1,querystring:4}]},{},[])
