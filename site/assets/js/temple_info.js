$.getJSON("./assets/geojson/2_combined.json").then(function (data) {

	var templeID = $(".templeid").attr("id")
	var templeinfo = data.filter(x => x["ref_no"] == templeID)
	console.log(templeinfo[0])

	$("#local_name").append(templeinfo[0]["name_indo"])
	$("#hanzi").append(templeinfo[0]["name_hanzi"])
	$("#pinyin").append(templeinfo[0]["name_pinyin"])
	$("#neighbourhood").append(templeinfo[0]["neighbourhood"])
	$("#region").append(templeinfo[0]["region"])

});
