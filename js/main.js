function pad(n, width, z) {
	//helper function to pad numbers. Takes in three variables: n is original number, width is the desired length, and z is the desired padding character which defaults to "0"
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function clickpoint(indata) {
	// Function to load data after clicking on a point.

	// Open info tab on sidebar
	sidebar.open("info");

	// Calculate latlng
	latlng = [parseFloat(indata["gps_lat"]), parseFloat(indata["gps_lon"])]

	// inject details into sidebar
	$("#indo").empty().append(indata["name_indo"])
	$("#hanzi").empty().append(indata["name_hanzi"])
	$("#pinyin").empty().append(indata["name_pinyin"])
	$("#road").empty().append(indata["road"])
	$("#region").empty().append(indata["region"])
	$("#address").empty().append(indata["address"])
	$("#latlng").empty().append(indata["gps_lat"] + ", " + indata["gps_lon"])

	// Create highlighted point on map
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
	latlng[1] = latlng[1] - 0.0025
	map.flyTo(latlng, 17)

	// Gallery function
	if (indata["ref_no"] != "") {
		$("#gallery").empty()

		htmlcode = "<h2>There are images associated with this site:</h2>"
		$("#gallery").append(htmlcode)

		for (let i = 1; i <= indata["num_images"]; i++) {
			ref_no = pad(indata["ref_no"], 3);
			img_no = pad(i, 2);

			file_name = ref_no + "-" + img_no + ".jpg";

			htmlcode = "<div class='image row'><div class='img-wrapper'><a href='./img/" + ref_no + "/" + file_name + "'><img src='./img/" + ref_no + "/" + file_name + "'><div class='img-overlay'><i class='fa fa-plus-circle' aria-hidden='true'></i></div></a></div></div>"

			$("#gallery").append(htmlcode)
		}

		// gallery lightbox
		// Gallery image hover
		$(".img-wrapper").hover(
			function () {
				$(this).find(".img-overlay").animate({
					opacity: 1
				}, 600);
			},
			function () {
				$(this).find(".img-overlay").animate({
					opacity: 0
				}, 600);
			}
		);

		// Lightbox
		var $overlay = $('<div id="overlay"></div>');
		var $image = $("<img>");
		var $prevButton = $('<div id="prevButton"><i class="fa fa-chevron-left"></i></div>');
		var $nextButton = $('<div id="nextButton"><i class="fa fa-chevron-right"></i></div>');
		var $exitButton = $('<div id="exitButton"><i class="fa fa-times"></i></div>');

		// Add overlay
		$overlay.append($image).prepend($prevButton).append($nextButton).append($exitButton);
		$("#gallery").after($overlay);

		// Hide overlay on default
		$overlay.hide();

		// When an image is clicked
		$(".img-overlay").click(function (event) {
			// Prevents default behavior
			event.preventDefault();

			// Adds href attribute to variable
			var imageLocation = $(this).parent().attr("href");
			// Add the image src to $image
			$image.attr("src", imageLocation);
			// Fade in the overlay
			$overlay.fadeIn("slow");
		});

		// When the overlay is clicked
		$overlay.click(function () {
			// Fade out the overlay
			$(this).fadeOut("slow");
		});

		// keyboard navigation
		$(document).keydown(function (e) {
			if (e.keyCode == 37) {
				// Left
				$prevButton.click()
			} else if (e.keyCode == 39) {
				// Right
				$nextButton.click()
			} else if (e.keyCode == 27) {
				$exitButton.click()
			}
		})

		// When next button is clicked
		$nextButton.click(function (event) {
			// Hide the current image
			$("#overlay img").hide();
			// Overlay image location
			var $currentImgSrc = $("#overlay img").attr("src");
			// Image with matching location of the overlay image
			var $currentImg = $("#gallery img[src='" + $currentImgSrc + "']");
			// Finds the next image
			var $nextImg = $($currentImg.closest(".image").next().find("img"));
			// All of the images in the gallery
			var $images = $("#gallery img");
			// If there is a next image
			if ($nextImg.length > 0) {
				// Fade in the next image
				$("#overlay img").attr("src", $nextImg.attr("src")).fadeIn(800);
			} else {
				// Otherwise fade in the first image
				$("#overlay img").attr("src", $($images[0]).attr("src")).fadeIn(800);
			}
			// Prevents overlay from being hidden
			event.stopPropagation();
		});

		// When previous button is clicked
		$prevButton.click(function (event) {
			// Hide the current image
			$("#overlay img").hide();
			// Overlay image location
			var $currentImgSrc = $("#overlay img").attr("src");
			// Image with matching location of the overlay image
			var $currentImg = $('#gallery img[src="' + $currentImgSrc + '"]');
			// Finds the next image
			var $nextImg = $($currentImg.closest(".image").prev().find("img"));
			// Fade in the next image
			$("#overlay img").attr("src", $nextImg.attr("src")).fadeIn(800);
			// Prevents overlay from being hidden
			event.stopPropagation();
		});

		// When the exit button is clicked
		$exitButton.click(function () {
			// Fade out the overlay
			$("#overlay").fadeOut("slow");
		});
	}
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
	$.ajax({
		type: "GET",
		url: "./assets/altars.csv",
		dataType: "text",
		success: function (indata) {
			processCSV(indata);
		}
	});

})
