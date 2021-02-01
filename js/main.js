function clickpoint(indata) {

	sidebar.open("info");

	latlng = [parseFloat(indata["gps_lat"]), parseFloat(indata["gps_lon"])]
	console.log(latlng)

	$("#indo").empty().append(indata["name_indo"])
	$("#hanzi").empty().append(indata["name_hanzi"])
	$("#pinyin").empty().append(indata["name_pinyin"])
	$("#neighbourhood").empty().append(indata["neighbourhood"])
	$("#region").empty().append(indata["region"])
	$("#address").empty().append(indata["address"])
	$("#latlng").empty().append(indata["gps_lat"] + ", " + indata["gps_lon"])

	pointer = L.circleMarker(latlng, {
		renderer: renderer,
		radius: 7,
		fillColor: "#FFE433",
		fillOpacity: 1,
		weight: 2,
		color: "#D92727",
		opacity: 1
	})

	highlighted_layers.clearLayers()
	highlighted_layers.addLayer(pointer)

	// Offset so map center takes into account sidebar
	console.log(latlng)
	latlng[1] = latlng[1] - 0.0025
	console.log(latlng)
	map.flyTo(latlng, 17)
}

function processCSV(indata) {
	outdata = $.csv.toObjects(indata);

	outdata.forEach(function (entry) {
		latlng = [entry["gps_lat"], entry["gps_lon"]]

		var pointer = entry["id"]

		pointer = L.circleMarker(latlng, {
			renderer: renderer,
			radius: 5,
			fillColor: "#0DB8B5",
			weight: 1,
			color: "#000000",
			opacity: 0.3
		}).on("click", function (e) {
			clickpoint(entry)
		})

		temple_layers.addLayer(pointer)

	})

	return outdata
}

// Load basemap
var map = L.map('map', {
	preferCanvas: true
}).setView([0.90925, 108.98463], 12)

L.tileLayer('https://api.mapbox.com/styles/v1/shgis-kennethdean/ckj4dgeskcfpi19qm1bd2tu23/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2hnaXMta2VubmV0aGRlYW4iLCJhIjoiY2tqMTBpOHl0MDI0YzJ5c2IzOHMyM2V4eCJ9.DFNMWEGdVJkBh9mS2OkrbA', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Open sidebar to intro page
var sidebar = L.control.sidebar({
	autopan: true, // whether to maintain the centered map point when opening the sidebar
	closeButton: true, // whether t add a close button to the panes
	container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
	position: 'left', // left or right
}).addTo(map);
sidebar.open('home');

var renderer = L.canvas({
	padding: 0.5
});

temple_layers = L.layerGroup().addTo(map)
highlighted_layers = L.layerGroup().addTo(map)


$(document).ready(function () {
	$.ajax({
		type: "GET",
		url: "./assets/2_combined.csv",
		dataType: "text",
		success: function (indata) {
			processCSV(indata);
		}
	});

})
