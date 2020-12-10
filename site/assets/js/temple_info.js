$.getJSON("/assets/geojson/2_combined.json").then(function (data) {

	var templeID = $(".templeid").attr("id")
	var templeinfo = data.filter(x => x["ref_no"] == templeID)

	$("#title").append(templeinfo[0]["name_indo"])
	$("#hanzi").append(templeinfo[0]["name_hanzi"])
	$("#pinyin").append(templeinfo[0]["name_pinyin"])
	$("#neighbourhood").append(templeinfo[0]["neighbourhood"])
	$("#region").html(templeinfo[0]["region"])

	var map = L.map('mapcont').setView([0.90925, 108.98463], 12);

	var layer_OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var marker = L.marker([templeinfo[0]["gps_lat"], templeinfo[0]["gps_lon"]]).addTo(map);

	map.flyTo([templeinfo[0]["gps_lat"], templeinfo[0]["gps_lon"]], 15)
});
