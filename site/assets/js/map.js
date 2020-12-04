function reset_style() {
	layer_Points.eachLayer(function (layer) {
		layer.setStyle({
			fillColor: "#66c2a5"
		})
	})
}


var map = L.map('map').setView([0.90925, 108.98463], 12);

var default_style = {
	radius: 5,
	fillColor: "#66c2a5",
	color: "rgba(0, 0, 0, 0.3)",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.6
}


var layer_OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var layer_Points = new L.GeoJSON.AJAX("./assets/geojson/3_combined.geojson", {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, default_style)
	}
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
	layers: {
		"Village points": layer_Points
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

// create the sidebar instance and add it to the map
var sidebar = L.control.sidebar({
		container: 'sidebar'
	})
	.addTo(map)
	.open("intro");

$(document).ready(function () {

	$('.ui.accordion').accordion('refresh');

	map.invalidateSize()

	// Form 
	$("#radio-default").click(function (object) {
		reset_style();
	})

	$("a[role=tab]").click(function (object) {
		$("#radio-default").click();
		reset_style();
	})

	$("#radio-region").click(function (object) {
		console.log(layer_Points)

		layer_Points.eachLayer(function (layer) {
			if (layer.feature.properties.region == "west") {
				layer.setStyle({
					fillColor: "#a6cee3",
					fillOpacity: 1
				})
			} else if (layer.feature.properties.region == "central") {
				layer.setStyle({
					fillColor: "#1f78b4",
					fillOpacity: 1
				})
			} else if (layer.feature.properties.region == "south") {
				layer.setStyle({
					filColor: "#b2df8a",
					fillOpacity: 1
				})
			} else if (layer.feature.properties.region == "east") {
				layer.setStyle({
					fillColor: "#33a02c",
					fillOpacity: 1
				})
			} else if (layer.feature.properties.region == "north") {
				layer.setStyle({
					fillColor: "#fb9a99",
					fillOpacity: 1
				})
			}
		})
	})
})
