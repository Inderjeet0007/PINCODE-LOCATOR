	
var markers = [];
var infowindow;

function initMap(){
	navigator.geolocation.getCurrentPosition(
		function(position){
			var loc = {lat: position.coords.latitude,lng: position.coords.longitude};
			map = new google.maps.Map(document.getElementById('map'), {
				center:loc,
				zoom: 14
			});

			infowindow = new google.maps.InfoWindow();

		},function(error){

		}
	);
	map.data.loadGeoJson('mumbai_wards.geojson');
}
$(document).ready(function(){
	$("#hosp").click(function(){
		deleteMarkers();
		createMarkers("hospital");
	});
	$("#sch").click(function(){
		deleteMarkers();
		createMarkers("school");
	});
	$("#pol").click(function(){
		deleteMarkers();
		createMarkers("police");
	});
});

function createMarkers(query){
	var service = new google.maps.places.PlacesService(map);
	console.log(map.getCenter());
	service.textSearch({
	    location: map.getCenter(),
	    radius: 500,
	    query: [query]
	}, function(results, status){
		if (status === google.maps.places.PlacesServiceStatus.OK){
	    for (var i = 0; i < results.length; i++) {
	    	createMarker(results[i]);
	    }
	}
	});
}

function deleteMarkers(){
	for (var i = 0; i < markers.length; i++){
		markers[i].setMap(null);
	}
	markers = [];
}
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent("<img src=\"" + place.icon + "\"> <br><h1>" + place.name + "</h1><p>" + place.formatted_address + "</p>");
    infowindow.open(map, this);
  });

  markers.push(marker);
}
