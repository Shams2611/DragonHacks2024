// var checkboxes = [1, 1, 1, 1, 1, 1];
markers = [[], [], [], [], [], []];
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
    checkedInds = []
    // console.log(checked)
    for (let i = 0; i < checked.length; i++) {
      // console.log(checked[i].value.toString()[10]);
      checkedInds.push(Number(checked[i].value.toString()[10]))
    }
    // const allInds = [0, 1, 2, 3, 4, 5, 6];
    // console.log(allInds);
    for (let i = 0; i < 6; i++) {
      if (checkedInds.indexOf(i) !== -1) {
        console.log("!" + i)
        showMarkers(i)
      }
      else {
        hideMarkers(i)
      }
    }

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

let map = L.map(container).setView(startCoords, 10);
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

// console.log("!!!"+randomPoints)
// randomPoints.forEach((element)=>{
//   console.log(element)
// })

// const point = turf.point([-122.9631042, 37.9895338]);
// console.log("!!!"+point)

// var point = turf.point([-75.343, 39.984]);
// pointsSet.push(point)
//

// randomPoints2 = turf.randomPoint(numberOfPoints / 3, { bbox });
// pointsSet.push(randomPoints2)

//!!!clusters code

var colors = {
  red: {
    image: "marker_red.png",
    color: "#e74c3c"
  },
  orange: {
    image: "marker_orange.png",
    color: "#e74c3c"
  },
  yellow: {
    image: "marker_yellow.png",
    color: "#e74c3c"
  },
  green: {
    image: "marker_green.png",
    color: "#e74c3c"
  },
  blue: {
    image: "marker_blue.png",
    color: "#e74c3c"
  },
  purple: {
    image: "marker_purple.png",
    color: "#e74c3c"
  }
}

var iconsList = []

var markerIcons = ["marker_red.png", "marker_orange.png", "marker_yellow.png", "marker_green.png", "marker_blue.png", "marker_purple.png"]
markerIcons.forEach(item => {
  var myIcon = L.icon({
    iconUrl: item,
    iconSize: [15, 15],
    shadowSize: [0, 0]
  });
  iconsList.push(myIcon)
})

function degrees_to_radians(degrees) {
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi / 180);
}

function calculateDistance(coord1, coord2) {
  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Convert coordinates to radians
  const lat1 = degrees_to_radians(coord1[0]);
  const lon1 = degrees_to_radians(coord1[1]);
  const lat2 = degrees_to_radians(coord2[0]);
  const lon2 = degrees_to_radians(coord2[1]);

  // Calculate the difference in latitude and longitude
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;

  // Apply the Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  return earthRadius * c;
}

let nameLabel = document.getElementById("nameLabel");
let sciNameLabel = document.getElementById("sciNameLabel");
let locationNameLabel = document.getElementById("locationNameLabel");
let locationCoordsLabel = document.getElementById("locationCoordsLabel");
let timeLabel = document.getElementById("timeLabel")
let descriptionLabel = document.getElementById("descriptionLabel");
let birdImage = document.getElementById("birdImage")

// var j = true

function addRandomOffset(coordinates) {
  return coordinates.map(([x, y]) => [
    x + Math.floor(Math.random() * 11) - 5,
    y + Math.floor(Math.random() * 11) - 5
  ]);
}

function reformatDate(dateString) {
  const [year, month, day, time] = dateString.split(/[-\s]/);
  return `${time} ${month}/${day}/${year}`;
}

coordsList = [];

var amt = 0

//firebase stuff

function getData() {
  const xhttp = new XMLHttpRequest();
  xhttp.responseType = "json";
  xhttp.onload = function () {
    if (xhttp.status === 200) {
      stuff = [...xhttp.response];
      // stuff = xhttp.response;
      // console.log(stuff)

      stuff.forEach((thing) => {
        amt += 1;
        console.log("amount incremented")
        // console.log(thing)
        // console.log([thing.lng,thing.lat])

        // pointsSet.push([Number(thing.lng) + (Math.floor(Math.random() * 11) - 5)*0.01, Number(thing.lat) + (Math.floor(Math.random() * 11) - 5)*0.01])

        // console.log(typeof turf.point([thing.lng,thing.lat]))
        // pointsSet.push(turf.point([thing.lng,thing.lat]))
        // var coords = item.geometry.coordinates.reverse()
        var coords = [thing.lat + (Math.floor(Math.random() * 11) - 5) * 0.0001, thing.lng + (Math.floor(Math.random() * 11) - 5) * 0.0001]
        coordsList.push(coords)
        // coordsList.push("hji")
        var dist = calculateDistance(startCoords, coords)
        // var dist = Math.sqrt(Math.abs(Math.pow(startCoords[0]-coords[0],2) + Math.pow(startCoords[1]-coords[1])))
        // console.log(dist)
        var ind = Math.min(Math.floor(dist / 2.5), 5);
        // var ind = 0;
        // console.log(ind)
        var newMarker = new L.marker(coords, { icon: iconsList[ind] })
        markers[ind].push(newMarker)
        newMarker.addTo(map).on("click", function (e) {
          // console.log(newMarker)
          nameLabel.innerText = thing.comName
          sciNameLabel.innerText = thing.sciName
          locationNameLabel.innerText = thing.locName
          locationCoordsLabel.innerText = "(" + thing.lat + ", " + thing.lng + ")";
          // locationCoordsLabel.innerText="asdfasdf"
          timeLabel.innerText = reformatDate(thing.obsDt)
          // descriptionLabel.innerText = ""
          birdImage.src = thing.image
        })
      })

    }
  }

  //xhttp.open('GET', 'https://minor-abortion-default-rtdb.firebaseio.com/mapItems.json');
  xhttp.open('GET', 'https://birdwatch-6f587-default-rtdb.firebaseio.com/.json');
  xhttp.send();
}

getData()

// async function 

const secondFunction = async () => {
  const result = await getData()
  console.log("data gotten")
  console.log(coordsList)
  console.log("asfdasdf"+amt)
}

secondFunction()

// let turfPoints = []
// coordsList.forEach((element)=>{
//   turfPoints.push(turf.point(element))
//   console.log(turf.point(element))
// })

console.log(coordsList)

console.log(coordsList.length)

// testList = [...coordsList]
// console.log(testList)
// console.log(testList.length)

// console.log(coordsList[0])

// console.log("==="+Array.from(coordsList))
// console.log(coordsList.length)

// randomPoints = turf.randomPoint(coordsList.length, { bbox });
// // pointsSet.push(randomPoints)

// const coordinates = [
//   [42.6629, -73.7963],
//   [42.6617, -73.7971],
//   [42.6604, -73.7980],
//   [42.6591, -73.7988],
//   [42.6578, -73.7996]
// ];

// const turfPoints = turf.featureCollection(
//   coordinates.map(coord => turf.point(coord))
// );
// console.log(turfPoints.features)

// clusters = turf.clustersKmeans(randomPoints, { numberOfClusters: numberOfClusters });
// console.log(clusters)

// var clusterGeometries = makeclusterGeometries()

// function makeclusterGeometries() {
//   const clusterArray = new Array(numberOfClusters).fill(null).map((item) => (new Array()));

//   const reducedClusters = clusters.features.reduce((product, cluster) => {
//     const clusterIndex = cluster.properties.cluster;
//     product[clusterIndex].push(cluster);
//     return product;
//   }, clusterArray);

//   const polygons = reducedClusters.map((cluster) => {
//     return turf.concave(turf.featureCollection(cluster));
//   });

//   return polygons;
// }

// console.log("!!!" + clusterGeometries)

// L.geoJson(clusterGeometries, {
//   weight: 1,
//   color: '#e74c3c',
//   onEachFeature: function (feature, layer) {
//     const area = turf.area(feature);
//     layer.bindPopup(`Cluster area: <b>${Math.floor(area)} m<sup>2</sup></b>`);
//   },
// }).addTo(map)

// var i = 0
// pointsSet.forEach(points => {
//   // console.log(points)
//   points.features.forEach(item => {
//     var coords = item.geometry.coordinates.reverse()
//     // console.log(coords)
//     var dist = calculateDistance(startCoords, coords)
//     // var dist = Math.sqrt(Math.abs(Math.pow(startCoords[0]-coords[0],2) + Math.pow(startCoords[1]-coords[1])))
//     // console.log(dist)
//     var ind = Math.floor(4 * dist);
//     // console.log(ind)
//     var newMarker = new L.marker(coords, { icon: iconsList[ind] })
//     markers[ind].push(newMarker)
//     newMarker.addTo(map).on("click", function (e) {
//       console.log(newMarker)
//       nameLabel.innerText = ""
//       sciNameLabel.innerText = ""
//       locationNameLabel.innerText = ""
//       locationCoordsLabel.innerText = ""
//       timeLabel.innerText = ""
//       descriptionLabel.innerText = ""
//     })
//   })
//   i++;
//   // j = false
// });

function hideMarkers(ind) {
  console.log(markers[ind])
  markers[ind].forEach((element) => {
    map.removeLayer(element)
  })
}

function showMarkers(ind) {
  console.log(markers[ind])
  markers[ind].forEach((element) => {
    map.addLayer(element)
  })
}

// markers.forEach(element => {
//   console.log(element)
// })

var customControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    var div = L.DomUtil.create('div', 'l-overlay');
    div.innerHTML = '<button id="resetBtn">\
    <i class="fa-solid fa-crosshairs"></i>\
    </button>\
    <button id="myButton">\
    <i class="fa-solid fa-arrows-rotate"></i>\
    </button>'
    // <button id="myButton">Click me</button>';
    var button = div.querySelector('#resetBtn');
    button.addEventListener('click', function () {
      map.setView(startCoords)
    });
    return div;
  }
});

map.addControl(new customControl());
