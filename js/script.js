var markers = [];

function initMap() {
    var parisCenter = new google.maps.LatLng(48.866667, 2.333333);
    var myOptions = {
        zoom: 15,
        center: parisCenter,
        scrollwheel: false,
    }
    map = new google.maps.Map(document.getElementById("map"), myOptions);
};

//add a marker to the map.
function createMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
};


// for each avec toutes les coordonnées dans un objets
function addMarkers() {
    $.each(markers, function(){
        NewMarker = new google.maps.LatLng(this.latitude, this.longitude);
        createMarker(NewMarker);
        google.maps.event.addListener(marker, 'click', function() {
            console.log(this.name)
        });
    });
};


var JCDecaux = $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49")
    .done(function(json) {
        for (var i = 0, length = json.length; i < length; i++) {
            var data = json[i];        
            markers.push({
                longitude: data.position.lng,
                latitude: data.position.lat,
                status: data.status,
                name: data.name
            });
        };
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() { //always() reçoit en paramètre une fonction de rappel qui permet de préciser le comportement du programme après l'appel AJAX, que l'appel ait été réussi ou non.
        addMarkers();
    });