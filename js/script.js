var googleMap = {
    apiUrl: null,
    map: null,

    init: function(mapElt, centerLat, centerLng, zoom ) {
        this.map = new google.maps.Map(mapElt, {
            center: new google.maps.LatLng(centerLat, centerLng),
            zoom: zoom,
            
        });
        return map
    },
    addMarker: function(url) {
        $.getJSON(url, function(json) {
            $.each(json, function(index, value){
                googleMap.createMarker(json[index]);
            });
        });
    },

    createMarker: function(stationsInfo) {
        console.log(stationsInfo.position.lat);
        NewMarker = new google.maps.LatLng(stationsInfo.position.lat, stationsInfo.position.lng);
        googleMap.displayMarker(NewMarker);
        google.maps.event.addListener(marker, 'click', function() {
            console.log(stationsInfo.name)
        });
    },

    displayMarker: function(location) {
        marker = new google.maps.Marker({
            position: location,
            map: this.map,
        })
    }

}

 
$(function(){
    var apiUrl = "https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49";
    googleMap.init(document.getElementById("map"), 48.866667, 2.333333, 15);
    googleMap.addMarker(apiUrl);
})