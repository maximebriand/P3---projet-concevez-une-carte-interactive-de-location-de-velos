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
        NewMarker = new google.maps.LatLng(stationsInfo.position.lat, stationsInfo.position.lng);     
        googleMap.displayMarker(NewMarker, stationsInfo.status, stationsInfo.bike_stands);
        googleMap.onMarkerClick(stationsInfo);
        
    

    },

    displayMarker: function(location, status, available) {
        var image;
        if (status === "OPEN" && available > 1) {
            image = "css/img/pin_velib_open.png";
        } else {
            image = "css/img/pin_velib_closed.png";
        }
        

        marker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: image,
        })
    },

    onMarkerClick: function(clickedMarker) {
        //on marker click
        google.maps.event.addListener(marker, 'click', function() {
            console.log(clickedMarker.name);
        });  
    }

}

 
$(function(){
    var apiUrl = "https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49";
    googleMap.init(document.getElementById("map"), 48.866667, 2.333333, 15);
    googleMap.addMarker(apiUrl);
})