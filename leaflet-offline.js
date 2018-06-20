module.exports = function (L) {
  L.Control.Offline = L.Control.extend({
    options: {
      position: 'topleft'
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-offline leaflet-bar leaflet-control');

      this.link = L.DomUtil.create('a', 'leaflet-control-offline-button leaflet-bar-part', container);
      this.link.href = '#';

      this._map = map;
      // this._map.on('fullscreenchange', this._toggleTitle, this);
      // this._toggleTitle();

      L.DomEvent.on(this.link, 'click', this._click, this);

      return container;
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      syncTiles()
    }// ,
//
//     _toggleTitle: function() {
//       this.link.title = this.options.title[this._map.isFullscreen()];
//     }
  });

  L.Map.mergeOptions({
    offlineControl: false
  });

  L.Map.addInitHook(function () {
    if (this.options.offlineControl) {
      this.offlineControl = new L.Control.Offline(this.options.offlineControl);
      this.addControl(this.offlineControl);
    }
  });

  L.control.offline = function (options) {
    return new L.Control.Offline(options);
  };
}