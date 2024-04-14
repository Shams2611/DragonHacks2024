//collapse -- dropdown
(function ($) {
  var CheckboxDropdown = function (el) {
    var _this = this;
    this.isOpen = false;
    this.areAllChecked = false;
    this.$el = $(el);
    this.$label = this.$el.find('.dropdown-label');
    this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
    this.$inputs = this.$el.find('[type="checkbox"]');

    this.onCheckBox();

    this.$label.on('click', function (e) {
      e.preventDefault();
      _this.toggleOpen();
    });

    this.$checkAll.on('click', function (e) {
      e.preventDefault();
      _this.onCheckAll();
    });

    this.$inputs.on('change', function (e) {
      _this.onCheckBox();
    });
  };

  CheckboxDropdown.prototype.onCheckBox = function () {
    this.updateStatus();
  };

  CheckboxDropdown.prototype.updateStatus = function () {
    var checked = this.$el.find(':checked');

    this.areAllChecked = false;
    this.$checkAll.html('Check All');

    if (checked.length <= 0) {
      this.$label.html('Select Options');
    }
    else if (checked.length === 1) {
      this.$label.html(checked.parent('label').text());
    }
    else if (checked.length === this.$inputs.length) {
      this.$label.html('All Selected');
      this.areAllChecked = true;
      this.$checkAll.html('Uncheck All');
    }
    else {
      this.$label.html(checked.length + ' Selected');
    }
  };

  CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
    if (!this.areAllChecked || checkAll) {
      this.areAllChecked = true;
      this.$checkAll.html('Uncheck All');
      this.$inputs.prop('checked', true);
    }
    else {
      this.areAllChecked = false;
      this.$checkAll.html('Check All');
      this.$inputs.prop('checked', false);
    }

    this.updateStatus();
  };

  CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
    var _this = this;

    if (!this.isOpen || forceOpen) {
      this.isOpen = true;
      this.$el.addClass('on');
      $(document).on('click', function (e) {
        if (!$(e.target).closest('[data-control]').length) {
          _this.toggleOpen();
        }
      });
    }
    else {
      this.isOpen = false;
      this.$el.removeClass('on');
      $(document).off('click');
    }
  };

  var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
  for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
    new CheckboxDropdown(checkboxesDropdowns[i]);
  }
})(jQuery);

numberOfPoints = 200
numberOfClusters = 20

let container = document.getElementById("mapContainer")

var startCoords = [39.9596, -75.1904]

let map = L.map(container).setView(startCoords, 15);
let osmLayer = L.tileLayer('https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=itORzsoRJTMoPJkSZRLH', {
    attribution: '<a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// var osmLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
//   minZoom: 0,
//   maxZoom: 20,
//   attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   ext: 'png'
// }).addTo(map);

bbox = [startCoords[1] - .01, startCoords[0] - .01, startCoords[1] + .01, startCoords[0] + .01];

pointsSet = []

randomPoints = turf.randomPoint(numberOfPoints, { bbox });
pointsSet.push(randomPoints)

for (let i = 0; i < 3; i++) {
  randomPoints2 = turf.randomPoint(numberOfPoints / 2, { bbox });
  pointsSet.push(randomPoints2)
}

clusters = turf.clustersKmeans(randomPoints, { numberOfClusters });

var clusterGeometries = makeclusterGeometries()

function makeclusterGeometries() {
  const clusterArray = new Array(numberOfClusters).fill(null).map((item) => (new Array()));

  const reducedClusters = clusters.features.reduce((product, cluster) => {
    const clusterIndex = cluster.properties.cluster;
    product[clusterIndex].push(cluster);
    return product;
  }, clusterArray);

  const polygons = reducedClusters.map((cluster) => {
    return turf.concave(turf.featureCollection(cluster));
  });

  return polygons;
}

L.geoJson(clusterGeometries, {
  weight: 1,
  color: '#f1a5c1',
  onEachFeature: function (feature, layer) {
    const area = turf.area(feature);
    layer.bindPopup(`Cluster area: <b>${Math.floor(area)} m<sup>2</sup></b>`);
  },
}).addTo(map);

var iconsList = []

var markerIcons = ["marker.png", "marker2.png"]
markerIcons.forEach(item => {
  var myIcon = L.icon({
    iconUrl: item,
    iconSize: [20, 20],
    shadowSize: [0, 0]
  });
  iconsList.push(myIcon)
})

var j = true
pointsSet.forEach(points => {
  points.features.forEach(item => {
    var coords = item.geometry.coordinates.reverse()
    new L.marker(coords, { icon: iconsList[j ? 0 : 1] }).addTo(map)
  })
  j = false
});

var customControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    var div = L.DomUtil.create('div', 'l-overlay');
    div.innerHTML = '<button id="resetBtn">\
    <i class="fa-solid fa-crosshairs"></i>\
    </button>'
    // <button id="myButton">Click me</button>\
    // <button id="myButton">Click me</button>';
    var button = div.querySelector('#resetBtn');
    button.addEventListener('click', function () {
      map.setView(startCoords)
    });
    return div;
  }
});

map.addControl(new customControl());
