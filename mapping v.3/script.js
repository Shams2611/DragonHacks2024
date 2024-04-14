var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=itORzsoRJTMoPJkSZRLH', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
}).addTo(map);

map.setView([39.9596, -75.1904], 18);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var myIcon = L.icon({
    iconUrl: 'marker.png',
    iconSize: [20, 20],
    shadowSize: [0, 0]
});

var markers = []
for (let i = 0; i < 100; i++) {
    markers.push(new L.marker([39.9596 + getRandomArbitrary(i * -.0001, i * .0001), -75.1904 + getRandomArbitrary(i * -.0001, i * .0001)],
    { icon: myIcon }))
}
markers.forEach(item => {
    item.addTo(map)
});

//

numberOfPoints = 200
numberOfClusters = 20

