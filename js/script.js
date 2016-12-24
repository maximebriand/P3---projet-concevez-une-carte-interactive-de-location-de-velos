var selectedStationID, data, i, marker, velibJson;
(function() {

    window.onload = function() {

        // Creating a new map
        var map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(48.866667, 2.333333),
            zoom: 15,
        });



        $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function(json) {


            var markers = [];
            // Looping through the JSON data
            for (var i = 0, length = json.length; i < length; i++) {
                var data = json[i],
                    latLng = new google.maps.LatLng(json[i].position.lat, json[i].position.lng);

                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: data.name,
                    id: i
                });



                (function(marker, json) {

                    // Attaching a click event to the current marker
 					google.maps.event.addListener(marker, "click", function(e) {
						
						var address, places, availableBikes, availableBikeStands, banking, bonus, name;
						address = json.address;
						places = json.bike_stands;
						availableBikes = json.available_bikes;
						availableBikeStands = json.available_bike_stands;
						banking = json.banking;
						bonus = json.bonus;
						name = json.name;
						status = json.status;

                        $('#booking').show();
                        $('aside div.content').empty();
                        selectedStationID = this.id;

                        $('aside div.content').empty();
                        var placesDescription, availableBikesDescription, availableBikeStandsDescription;
                        
                        if (places <= 1) { placesDescription = "</span> place à cette station</li>" } else { placesDescription = "</span> places à cette station</li>" };

                        if (availableBikes <= 1) { availableBikesDescription = "</span> vélo de disponible</li>" } else { availableBikesDescription = "</span> vélos sont disponibles</li>" };

                        if (availableBikeStands <= 1) { availableBikeStandsDescription = "</span> emplacement de libre</li>" } else { availableBikeStandsDescription = "</span> emplacements sont libres</li>" }

                        $('aside div.content').append(
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
            $('#booking').click(function() {

                $('#canvas').show();
                $('#sign').show();
            });
            $('#sign').click(function() {
                sessionStorage.setItem("station", json[selectedStationID].name);
                sessionStorage.setItem("bookingDate", Math.floor($.now() / 1000));
                $('footer div.wrapper').append("<p>1 vélo réservé à la station " + sessionStorage.getItem("station") + " pour <span id=\"minutes\"></span> minutes et <span id=\"seconds\"></span> secondes");
            });
        })



    }




})();
