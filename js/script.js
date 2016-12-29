
var bookingButton, signButton, canvasArea, asideElement, footer, selectedStationID;
	bookingButton = $('#booking');
	signButton = $('#sign');
	canvasArea = $('#canvas');
	asideElement = $('aside div.content');
	footer = $('footer div.wrapper');
(function() {

    window.onload = function() {

        // Creating a new map
        var map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(48.866667, 2.333333),
            zoom: 15,
        });

        // Try HTML5 geolocation.
       if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
               var pos = {
                   lat: position.coords.latitude,
                   lng: position.coords.longitude
               };
               var infoWindow = new google.maps.InfoWindow({map: map});
               infoWindow.setPosition(pos);
               infoWindow.setContent('Vous êtes ici.');
               map.setCenter(pos);
           }, function() {
               handleLocationError(true, infoWindow, map.getCenter());
           });
       } else {
           // Browser doesn't support Geolocation
           handleLocationError(false, infoWindow, map.getCenter());
       }

        $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function(json) {


            var markers = [];
            // Looping through the JSON data
            for (var i = 0, length = json.length; i < length; i++) {
                var data = json[i],
                    latLng = new google.maps.LatLng(json[i].position.lat, json[i].position.lng);
                var image = "css/img/pin_velib_small.png";
                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: image,
                    title: data.name,
                    id: i
                });

                (function(marker, json) {

                    // Attaching a click event to the current marker
 					google.maps.event.addListener(marker, "click", function(e) {
						signButton.hide();
						canvasArea.hide();
						
						var address, places, availableBikes, availableBikeStands, banking, bonus, name;
							address = json.address;
							places = json.bike_stands;
							availableBikes = json.available_bikes;
							availableBikeStands = json.available_bike_stands;
							banking = json.banking;
							bonus = json.bonus;
							name = json.name;
							status = json.status;

                        bookingButton.show();
                        asideElement.empty();
                        selectedStationID = this.id;

                        var placesDescription, availableBikesDescription, availableBikeStandsDescription;
                        
                        if (places <= 1) { placesDescription = "</span> place à cette station</li>" } else { placesDescription = "</span> places à cette station</li>" };
                        if (availableBikes <= 1) { availableBikesDescription = "</span> vélo de disponible</li>" } else { availableBikesDescription = "</span> vélos sont disponibles</li>" };
                        if (availableBikeStands <= 1) { availableBikeStandsDescription = "</span> emplacement de libre</li>" } else { availableBikeStandsDescription = "</span> emplacements sont libres</li>" }
						if (banking === true) { banking = "disponible" } else { banking = "indisponible" };
						if (status === "OPEN") { status = "ouverte" } else { status = "fermée" };

                        asideElement.append(
                            "<h3 class=\"available_bikes\">Station : <span>" + name + "</span></h3> <ul>" +
                            "<li class=\"available_bikes\">La station est <span>" + status + "</span></li>" +
                            "<li class=\"available_bikes\">Adresse : <span>" + address + "</span></li>" +
                            "<li class=\"available_bikes\"><span>" + places + " " + placesDescription +
                            "<li class=\"available_bikes\"><span>" + availableBikes + " " + availableBikesDescription +
                            "<li class=\"available_bikes\"><span>" + availableBikeStands + " " + availableBikeStandsDescription +
                            "<li class=\"available_bikes\">Le paiement à cette station est <span>" + banking + "</span></li></ul>"
                        );
                    });
                })(marker, data);
            };
            bookingButton.click(function() {
                canvasArea.show();
                signButton.show();
            });
            signButton.click(function() {
				if (sessionStorage.getItem("station") === json[selectedStationID].name) {
					asideElement.append("<p class=\"alert\">vous avez déjà réservé un Velib à cette station !</p>");
				} else {
	                sessionStorage.setItem("station", json[selectedStationID].name);
	                sessionStorage.setItem("bookingDate", Math.floor($.now() / 1000));

	                clearTimeout(timeOutVariable);
	                bookingLimit = 20 * 60;    
	                setTimeout(countDown, 1000);

	                displayBookingInfo();
	                clearCanvas();
	             	canvasArea.hide();
	                signButton.hide();
					asideElement.empty();
					bookingButton.hide();
				}
            });
        })
    }
function displayBookingInfo() {
    footer.html("<p>1 vélo réservé à la station " + sessionStorage.getItem("station") + " pour <span id=\"minutes\"></span> minutes et <span id=\"seconds\"></span> secondes");
}

var bookingLimit = 11 * 60;    
var bookingPastTime = (Math.floor($.now()) / 1000 ) - (sessionStorage.getItem("bookingDate"));
var timeOutVariable;
// IF SESSION OF 20 MINUTES IS STILL AVAILABLE WE DISPLAY THE VALUE IN THE FOOTER
if ( bookingPastTime < bookingLimit && sessionStorage.getItem("station")) {
    bookingLimit = bookingLimit - Math.round(bookingPastTime);
    timeOutVariable = setTimeout(countDown, 1000);
    displayBookingInfo();
} else {
	footer.html("<p>Vous n'avez pas de réservation en cours</p>")
}

function countDown() {
    bookingLimit--;
    if (bookingLimit > 0) {
        timeOutVariable = setTimeout(countDown, 1000);
    } else {
    	footer.html("<p>Votre réservation a expirée</p>")
    }
    var minutes = Math.floor(bookingLimit / 60);
    var seconds = bookingLimit - minutes * 60;

    minutesSpan = $('#minutes');
    secondsSpan = $('#seconds');
    minutesSpan.html(minutes);
    secondsSpan.html(seconds);  
}
})();
