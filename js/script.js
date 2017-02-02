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
        googleMap.displayMarker(NewMarker, stationsInfo.status, stationsInfo.available_bikes);
        googleMap.onMarkerClick(stationsInfo);
    },

    displayMarker: function(location, status, available) {
        var image;
        if (status === "OPEN" && available >= 1) {
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
  
            var asideElement, bookingButton, address, places, availableBikes, availableBikeStands, banking, bonus,
                name, placesDescription, availableBikesDescription, availableBikeStandsDescription;
                
                bookingButton = $('#booking');
                asideElement = $("aside .content");
                address = clickedMarker.address;
                places = clickedMarker.bike_stands;
                availableBikes = clickedMarker.available_bikes;
                availableBikeStands = clickedMarker.available_bike_stands;
                banking = clickedMarker.banking;
                bonus = clickedMarker.bonus;
                name = clickedMarker.name;
                status = clickedMarker.status;

            if (places <= 1) { placesDescription = "</span> place à cette station</li>" } else { placesDescription = "</span> places à cette station</li>" };
            if (availableBikes <= 1) { availableBikesDescription = "</span> vélo de disponible</li>" } else { availableBikesDescription = "</span> vélos sont disponibles</li>" };
            if (availableBikeStands <= 1) { availableBikeStandsDescription = "</span> emplacement de libre</li>" } else { availableBikeStandsDescription = "</span> emplacements sont libres</li>" }
            if (banking === true) { banking = "disponible" } else { banking = "indisponible" };
            if (status === "OPEN") { status = "ouverte";} else { status = "fermée"; };
            bookingButton.hide();
            asideElement.empty();
            asideElement.append(
                "<h3 class=\"available_bikes\">Station : <span>" + name + "</span></h3> <ul>" +
                "<li class=\"available_bikes\">La station est <span>" + status + "</span></li>" +
                "<li class=\"available_bikes\">Adresse : <span>" + address + "</span></li>" +
                "<li class=\"available_bikes\"><span>" + places + " " + placesDescription +
                "<li class=\"available_bikes\"><span>" + availableBikes + " " + availableBikesDescription +
                "<li class=\"available_bikes\"><span>" + availableBikeStands + " " + availableBikeStandsDescription +
                "<li class=\"available_bikes\">Le paiement à cette station est <span>" + banking + "</span></li></ul>"
            );
            if (status === "ouverte" && availableBikes >= 1) {bookingButton.show();}

            console.log(clickedMarker.name);
        });
    }


}

 
$(function(){
    var apiUrl = "https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49";
    googleMap.init(document.getElementById("map"), 48.866667, 2.333333, 15);
    googleMap.addMarker(apiUrl);
})