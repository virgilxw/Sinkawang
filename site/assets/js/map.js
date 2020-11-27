function popup(feature, layer) {
	var properties = layer.feature.properties
	layer.bindPopup("<p>test</p>")
}

var map = L.map('map').setView([0.90925, 108.98463], 12);

var layer_OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var icon1 = L.icon({
	iconUrl: './assets/img/icon1.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon2 = L.icon({
	iconUrl: './assets/img/icon2.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon3 = L.icon({
	iconUrl: './assets/img/icon3.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon4 = L.icon({
	iconUrl: './assets/img/icon4.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon5 = L.icon({
	iconUrl: './assets/img/icon5.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon6 = L.icon({
	iconUrl: './assets/img/icon6.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon7 = L.icon({
	iconUrl: './assets/img/icon7.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon8 = L.icon({
	iconUrl: './assets/img/icon8.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon9 = L.icon({
	iconUrl: './assets/img/icon9.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});
var icon10 = L.icon({
	iconUrl: './assets/img/icon10.png',
	iconSize: [20, 35],
	iconAnchor: [10, 37],
	popupAnchor: [0, -28]
});

var layer_Central = new L.GeoJSON.AJAX("./assets/geojson/2_Central.geojson", {
	pointToLayer: function (geoJsonPoint, latlng) {
		return L.marker(latlng, {
			icon: icon1
		}); //options object for Marker
	},
	onEachFeature: popup
}).addTo(map);
var layer_East = new L.GeoJSON.AJAX("./assets/geojson/2_East.geojson", {
	pointToLayer: function (geoJsonPoint, latlng) {
		return L.marker(latlng, {
			icon: icon2
		}); //options object for Marker
	},
	onEachFeature: popup
}).addTo(map);
var layer_North = new L.GeoJSON.AJAX("./assets/geojson/2_North.geojson", {
	pointToLayer: function (geoJsonPoint, latlng) {
		return L.marker(latlng, {
			icon: icon3
		}); //options object for Marker
	},
	onEachFeature: popup
}).addTo(map);
var layer_South = new L.GeoJSON.AJAX("./assets/geojson/2_South.geojson", {
	pointToLayer: function (geoJsonPoint, latlng) {
		return L.marker(latlng, {
			icon: icon4
		}); //options object for Marker
	},
	onEachFeature: popup
}).addTo(map);
var layer_West = new L.GeoJSON.AJAX("./assets/geojson/2_West.geojson", {
	pointToLayer: function (geoJsonPoint, latlng) {
		return L.marker(latlng, {
			icon: icon5
		}); //options object for Marker
	},
	onEachFeature: popup
}).addTo(map);

var baseMaps = [{
	groupName: "Base maps",
	expanded: true,
	layers: {
		"OpenStreetMap": layer_OSM
	}
    }]
var overlays = [{
	groupName: "Regional Data",
	expanded: true,
	layers: {
		"Central <img src='./assets/img/icon1.png', class='markerThumbnail'>": layer_Central,
		"East <img src='./assets/img/icon2.png', class='markerThumbnail'>": layer_East,
		"North <img src='./assets/img/icon3.png', class='markerThumbnail'>": layer_North,
		"South <img src='./assets/img/icon4.png', class='markerThumbnail'>": layer_South,
		"West <img src='./assets/img/icon5.png', class='markerThumbnail'>": layer_West,
	}
}]

var options = {
	container_width: "300px",
	container_maxHeight: "700px",
	group_maxHeight: "250px",
	groupCheckboxes: true,
	removeOutsideVisibleBounds: true,
	collapsed: false
};

var control = L.Control.styledLayerControl(baseMaps, overlays, options);
map.addControl(control);


$(document).ready(function () {
	map.invalidateSize()
})
