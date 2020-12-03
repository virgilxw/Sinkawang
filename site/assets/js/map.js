function popup(feature, layer) {
	var properties = layer.feature.properties
	layer.bindPopup("<p>test</p>")
}


var map = L.map('map').setView([0.90925, 108.98463], 12);

var layer_OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var layer_Central = new L.GeoJSON.AJAX("./assets/geojson/3_combined.geojson", {
	pointToLayer: function (geoJsonPoint, latlng) {
		return L.marker(latlng, {
			icon: icon1
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
	groupName: "Data",
	expanded: true,
	layers: {}
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

// create the sidebar instance and add it to the map
var sidebar = L.control.sidebar({
		container: 'sidebar'
	})
	.addTo(map)
	.open("intro");


$(document).ready(function () {
	map.invalidateSize()
})
