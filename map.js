
$( document ).ready(function() {

	var data = [];

	$('#mode-toggle-switch').change(function() {

		if ($(this).is(':checked')) {
			setMode('ADMIN');
		} else {
			setMode('TRAINING');
		}

	});

	function setMode(mode) {

		if (mode == "ADMIN") {

			$('body').addClass('admin');
			$('#mode-toggle').html('ADMIN');
		} else {

			clearAllMarkers();
			$('#number-entry').val('');
			$('body').removeClass('admin');
			$('#mode-toggle').html('TRAINING');
		}
	}

	$.getJSON("data.json", function(d){
			data = d;
	 }).fail(function(e){
			 console.log(e);
	 });

	 $('.search-button').click(function() {

			 var number = $('#number-entry').val();
			 if (number.length === 0) { return }

			 console.log(data);

			 console.log(data.length);

			 for (var i=0; i++; i<data.length) {

				 console.log(data[i].id);

				 if (data[i].id == number) {
					 current[0] = data[i].lat;
					 current[1] = data[i].lon;
					 clearAllMarkers();
					 generateMarkersAtLocation(current[0], current[1]);
					 setViewAtLocation(current[0], current[1], 10);
				 }
			 }

	 });

	$('.set-button').click(function() {

			var number = $('#number-entry').val();
			if (number.length === 0) { alert('No number entered!'); }

			data.push({
				"id": number,
				"lat": current[0],
				"lon": current[1],
				"gps": settings.gps,
				"wifi": settings.wifi,
				"cell": settings.cell
			});

			alert('Number: ' + number + ' was updated!');

			console.log(data);

	});

		var nz = [-41.1485, 173.2021];
		var home = [-41.29132045311281, 174.77418606176357];
		var current = home;

		/* Settings from checkboxes */
		var settings = {
			"gps": true,
			"wifi": true,
			"cell": true
		}

		$('.settings').change(function() {
			settings.gps = $('#settings-gps').is(':checked');
			settings.wifi = $('#settings-wifi').is(':checked');
			settings.cell = $('#settings-cell').is(':checked');


			clearAllMarkers();
			generateMarkersAtLocation(current[0], current[1]);

			// $.ajax({
			// 		 url: "https://malachite-dot-pufferfish.glitch.me/update?username=testUser&data=1234",
			// 		 crossDomain: true
			//  }).then(function(data) {
			// 		alert(data);
			//  });

	  });

		var mapopts = {
			zoomSnap: 0.25,
		};

		var map = L.map("map", mapopts).setView([-41.1485, 173.2021], 6);

		var roadMutant = L.gridLayer
			.googleMutant({
				maxZoom: 24,
				type: "roadmap",
			})
			.addTo(map);

		var styleMutant = L.gridLayer.googleMutant({
			styles: [
				{ elementType: "labels", stylers: [{ visibility: "off" }] },
				{ featureType: "water", stylers: [{ color: "#444444" }] },
				{ featureType: "landscape", stylers: [{ color: "#eeeeee" }] },
				{ featureType: "road", stylers: [{ visibility: "off" }] },
				{ featureType: "poi", stylers: [{ visibility: "off" }] },
				{ featureType: "transit", stylers: [{ visibility: "off" }] },
				{ featureType: "administrative", stylers: [{ visibility: "off" }] },
				{
					featureType: "administrative.locality",
					stylers: [{ visibility: "off" }],
				},
			],
			maxZoom: 24,
			type: "roadmap",
		});

		map.on('click', function(e) {
				if ($('body').hasClass('admin')) {

					clearAllMarkers();
					current = [e.latlng.lat, e.latlng.lng];
					generateMarkersAtLocation(e.latlng.lat, e.latlng.lng);

				} else { return }
		});

		var redCircle = {
		   color: 'red',
		   fillColor: 'red',
		   fillOpacity: 0.3
		}

		var greenCircle = {
		   color: 'green',
		   fillColor: 'green',
		   fillOpacity: 0.2
		}

		var blueCircle = {
		   color: 'blue',
		   fillColor: 'blue',
		   fillOpacity: 0.1
		}



		var markers = [];
		markers.push(L.circle(home, 100, blueCircle).addTo(map));
		markers.push(L.circle(home, 25, greenCircle).addTo(map));
		markers.push(L.circle(home, 5, redCircle).addTo(map));

		function setViewAtLocation(lat, lon, zoom) {
			map.setView([lat, lon], zoom);
		}
		function generateMarkersAtLocation(lat, lon) {

		 	var loc = [lat, lon];
			if (settings.cell) { markers.push(L.circle(loc, 100, blueCircle).addTo(map)); }
			if (settings.wifi) { markers.push(L.circle(loc, 25, greenCircle).addTo(map)); }
			if (settings.gps) {	markers.push(L.circle(loc, 5, redCircle).addTo(map)); }

		}

		function clearAllMarkers() {
			for(var i = 0; i < markers.length; i++){
				markers[i].remove();
			}
			markers = [];
		}

	});
