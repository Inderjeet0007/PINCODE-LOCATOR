	
var markers = [];
var infowindow;

var map
      function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
          center: {lat : 19.0650, lng: 72.8697},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();''

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
      });

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

var iconBase = 'images/';
        var icons = {
          hospital: {
            icon: iconBase + 'hospital.png'
          },
          school: {
            icon: iconBase + 'school.png'
          },
        };
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
