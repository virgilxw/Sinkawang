// Function to generate popup
function popup(feature, layer) {
	var properties = layer.feature.properties

	string = ""

	if (properties.ref_no !== "") {
		temp_num = properties.ref_no.padStart(3, '0')
		string = "<p> There are pictures, floor plans, and adetailed description associated with this temple. <a href='./temples/" + temp_num + ".html'> Click here to view them </p> </a>" + "<iframe id='frame' onload='this.contentWindow.document.documentElement.scrollTop=520' src='./temples/" + temp_num + ".html'></iframe>"
	}

	layer.bindPopup("<h2>" + properties.name_indo + "</h2><h4>" + properties.name_hanzi + "</h4><h4>" + properties.name_pinyin + "</h4>" + "<p><b>Address: </b>" + properties.address + "</p><p><b>Neighourhood: </b>" + properties.neighbourhood + "</p>" + string)

	console.log($("#frame"))
}

var default_style = {
	radius: 5,
	fillColor: "#66c2a5",
	color: "rgba(0, 0, 0, 0.3)",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.6
}

highlightedPoints = []

function reset_style() {
	highlightedPoints = []
	layer_Points.eachLayer(function (layer) {
		layer.setStyle(default_style)
	})
}

function highlightlayerUID(id) {

	highlightedPoints.push(id)
	val = false

	layer_Points.eachLayer(function (layer) {
		if (layer.feature.properties.id == id) {
			layer.setStyle({
				fillColor: "#ffdd00",
				color: "#ff0000"
			})
			val = true

			map.flyTo([layer._latlng.lat, layer._latlng.lng], 16)
		}
	})
	if (val = false) {
		throw "Point " + id + " not found"
	}
}

function clearlayerUID(id) {

	var index = highlightedPoints.indexOf(id);

	if (index > -1) {
		highlightedPoints.splice(index, 1);
	}

	layer_Points.eachLayer(function (layer) {
		if (layer.feature.properties.id == id) {
			layer.setStyle(default_style)
			val = true
		}
	})
	if (val = false) {
		throw "Point " + id + " not found"
	}
}

var map = L.map('map').setView([0.90925, 108.98463], 12);

var layer_OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var layer_Points = new L.GeoJSON.AJAX("./assets/geojson/3_combined.geojson", {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, default_style)
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
	layers: {
		"Temple Points": layer_Points
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

	// Search
	var $select = $('#select-id').selectize({
		maxItems: null,
		valueField: 'id',
		labelField: 'name',
		searchField: ['id', 'name'],
		options: [],
		create: false,
		render: {
			item: function (item, escape) {
				return '<div>' +
					(item.id ? '<span class="title">' + escape(item.id) + '</span>' : '') +
					(item.name ? '<span class="subtitle">' + escape(item.name) + '</span>' : '') +
					'</div>';
			},
			option: function (item, escape) {
				var label = item.name || item.id;
				var caption = item.name ? item.id : null;
				return '<div>' +
					(caption ? '<span class="title">' + escape(caption) + '</span>' : '') +
					'<span class="subtitle">' + escape(label) + '</span>' +
					'</div>';
			},
		},
		onItemAdd: function (val) {

			highlightlayerUID(val)
		},
		onItemRemove: function (val) {
			clearlayerUID(val)
		},
		load: function (query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: './assets/json/2_combined.json',
				type: 'GET',
				dataType: 'json',
				data: {},
				error: function () {
					callback();
				},
				success: function (res) {
					callback(res);
				}
			});
		}
	})

	// Search
	var $select = $('#select-chinese').selectize({
		maxItems: null,
		valueField: 'id',
		labelField: 'name',
		searchField: 'name_chinese',
		options: [],
		create: false,
		render: {
			item: function (item, escape) {
				return '<div>' +
					(item.id ? '<span class="title">' + escape(item.id) + '</span>' : '') +
					(item.name_chinese ? '<span class="subtitle">' + escape(item.name_chinese) + '</span>' : '') +
					'</div>';
			},
			option: function (item, escape) {
				var label = item.name_chinese || item.id;
				var caption = item.name_chinese ? item.id : null;
				return '<div>' +
					(caption ? '<span class="title">' + escape(caption) + '</span>' : '') +
					'<span class="subtitle">' + escape(label) + '</span>' +
					'</div>';
			},
		},
		onItemAdd: function (val) {

			highlightlayerUID(val)
		},
		onItemRemove: function (val) {
			clearlayerUID(val)
		},
		load: function (query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: './assets/json/2_combined.json',
				type: 'GET',
				dataType: 'json',
				data: {},
				error: function () {
					callback();
				},
				success: function (res) {
					callback(res);
				}
			});
		}
	})

	var $select = $('#select-address').selectize({
		maxItems: null,
		valueField: 'id',
		labelField: 'name',
		searchField: 'address',
		options: [],
		create: false,
		render: {
			item: function (item, escape) {
				return '<div>' +
					(item.id ? '<span class="title">' + escape(item.id) + '</span>' : '') +
					(item.address ? '<span class="subtitle">' + escape(item.address) + '</span>' : '') +
					'</div>';
			},
			option: function (item, escape) {
				var label = item.address || item.id;
				var caption = item.address ? item.id : null;
				return '<div>' +
					(caption ? '<span class="title">' + escape(caption) + '</span>' : '') +
					'<span class="subtitle">' + escape(label) + '</span>' +
					'</div>';
			},
		},
		onItemAdd: function (val) {

			highlightlayerUID(val)
		},
		onItemRemove: function (val) {
			clearlayerUID(val)
		},
		load: function (query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: './assets/json/2_combined.json',
				type: 'GET',
				dataType: 'json',
				data: {},
				error: function () {
					callback();
				},
				success: function (res) {
					callback(res);
				}
			});
		}
	})
})
