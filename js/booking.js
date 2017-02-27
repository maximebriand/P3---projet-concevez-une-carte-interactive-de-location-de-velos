var bookedMarkerIndex, stationNumber, urlStation, specificStationData;
var gmarkers = [];

var googleMap = {
    map: null,
    localJson: [],

    init: function(mapElt, centerLat, centerLng, zoom, url ) {
        this.map = new google.maps.Map(mapElt, {
            center: {
                lat: centerLat, 
                lng: centerLng
            },
            zoom: zoom
            
        });
        checkBooking(); //used to check if there is a booking
        bookingButtonClick(); //create a new booking each time the booking button is hitten
    },


    addMarker() {
        var me = this;//used to call the object
        var table = this.localJson;
        $.each(table, function(index, value) {
            googleMap.createMarker(table[index], index);
        });
    },


    getResponse(url) {
        var tempTable = [];
        var me = this;//used to call the object

        $.getJSON(url, function(json) {
            $.each(json, function(index, value) {
                tempTable.push(json[index]);
            });
        }).always(function(){
            me.addMarker(); 
        });
        this.localJson = tempTable;
    },

    createMarker(stationsInfo, index) {
        if (bookingPastTime < bookingLimit && sessionStorage.getItem("station")) {
            googleMap.localJson[sessionStorage.getItem("indexSelectedMarker")].status = "BOOKED";
        };
        NewMarker = new google.maps.LatLng(stationsInfo.position.lat, stationsInfo.position.lng);     
        this.displayMarker(NewMarker, stationsInfo.status, stationsInfo.available_bikes);
        this.onMarkerClick(stationsInfo, index);
    },

    displayMarker(location, status, available) {
        var image;
        if (status === "OPEN" && available >= 1) {
            image = "css/img/pin_velib_open.png";
        } else if (status === "BOOKED") {
            image = "css/img/pin_velib_booked.png";
        }else {
            image = "css/img/pin_velib_closed.png";
        }

        marker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: image,
        })

        gmarkers.push(marker);
    },

    unbookingChangeStatus(index) {
        var me = this;
        var stationByIndex = me.localJson[index];
        stationNumber = stationByIndex.number;

        urlStation = "https://api.jcdecaux.com/vls/v1/stations/" + stationNumber + "?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49";
        $.getJSON(urlStation, function(json) {
            specificStationData = json;
        }).always(function() {
            me.localJson[index].status = specificStationData.status;
            me.replaceMarkers();
        });
    },

    replaceMarkers() {
        for (i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(null);
        }
        this.addMarker();
    },

    onMarkerClick(clickedMarker, index) {
        //on marker click
        google.maps.event.addListener(marker, 'click', function() {
  
            var canvas, asideElement, bookingButton, address, places, availableBikes, availableBikeStands, banking, bonus,
                name, placesDescription, availableBikesDescription, availableBikeStandsDescription;
                
                canvas = $('#canvas');
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
                index = index;

            if (places <= 1) { placesDescription = "</span> place à cette station</li>" } else { placesDescription = "</span> places à cette station</li>" };
            if (availableBikes <= 1) { availableBikesDescription = "</span> vélo de disponible</li>" } else { availableBikesDescription = "</span> vélos sont disponibles</li>" };
            if (availableBikeStands <= 1) { availableBikeStandsDescription = "</span> emplacement de libre</li>" } else { availableBikeStandsDescription = "</span> emplacements sont libres</li>" }
            if (banking === true) { banking = "disponible" } else { banking = "indisponible" };
            if (status === "OPEN" || "BOOKED") { statusMarker = "ouverte";} else { statusMarker = "fermée"; };
            bookingButton.hide();
            canvas.hide();
            clearCanvas();
            signBouton.hide();
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
            if (statusMarker === "ouverte" && availableBikes >= 1 && status !== "BOOKED") { bookingButton.show(); }
            else if (status === "BOOKED") {asideElement.append("<p class=\"alert\">Vous avez déjà une réservation en cours pour cette station</p>")}

            sessionStorage.setItem("stationSelectedMarker", clickedMarker.name);
            sessionStorage.setItem("latSelectedMarker", clickedMarker.position.lat);
            sessionStorage.setItem("lngSelectedMarker", clickedMarker.position.lng);
            bookedMarkerIndex = index;
        });
    }
};




var newBooking = {
    station: null,
    stationLat: null,
    stationLng: null,
    bookingDate: Math.floor($.now() / 1000),

    initBooking(markerStation, markerLat, markerLng) {
        this.station = markerStation;
        this.stationLat = markerLat;
        this.stationLng = markerLng;
    },
    createBooking() {
        var alertElt = $("aside .content .alert");
        var previousIndex = sessionStorage.getItem("indexSelectedMarker")
        sessionStorage.setItem("station", this.station);
        sessionStorage.setItem("bookingDate", this.bookingDate);
        displayBookingInfo();
        this.startCountdow();
        alertElt.remove();

        sessionStorage.setItem("indexSelectedMarker", bookedMarkerIndex);
        googleMap.localJson[bookedMarkerIndex].status = "BOOKED";
        googleMap.unbookingChangeStatus(previousIndex);
    },
    startCountdow() {
        clearTimeout(timeOutVariable);
        bookingLimit = 20 * 60;
        setTimeout(countDown, 1000);
    }
}


var bookingLimit = 20 * 60; // 20 minutes * 60 seconds
var footer = $('footer div.wrapper');

function displayBookingInfo() {
    footer.html("<p>1 vélo réservé à la station " + sessionStorage.getItem("station") + " pour <span id=\"minutes\"></span> minutes et <span id=\"seconds\"></span> secondes");
};

var timeOutVariable, bookingPastTime;

//Function to excecute when the map is initialize to check if there is already a booking in webstorage.
function checkBooking() {
    bookingPastTime = (Math.floor($.now()) / 1000) - (sessionStorage.getItem("bookingDate"));
   
    // IF SESSION OF 20 MINUTES IS STILL AVAILABLE WE DISPLAY THE VALUE IN THE FOOTER
    if (bookingPastTime < bookingLimit && sessionStorage.getItem("station")) {
        bookingLimit = bookingLimit - Math.round(bookingPastTime);
        timeOutVariable = setTimeout(countDown, 1000);
        displayBookingInfo();
    } else {
        footer.html("<p>Vous n'avez pas de réservation en cours</p>")
    }
}

function bookingButtonClick() {

    signBouton.click(function() {

        if (dataUrl !== canvas.toDataURL()) {
            var superBooking = Object.create(newBooking); //create a booking object
            superBooking.initBooking(
                sessionStorage.getItem("stationSelectedMarker"),
                sessionStorage.getItem("latSelectedMarker"),
                sessionStorage.getItem("lngSelectedMarker"));
            superBooking.createBooking();
        } else {
            $("aside .content").append("<p class=\"alert\">Vous devez signer pour valider votre réservation</p>")
        }

    })
};


function countDown() {
    bookingLimit--;
    if (bookingLimit > 0) {
        timeOutVariable = setTimeout(countDown, 1000);
    } else {
        footer.html("<p>Votre réservation a expiré</p>")
    }
    var minutes = Math.floor(bookingLimit / 60);
    var seconds = bookingLimit - minutes * 60;

    minutesSpan = $('#minutes');
    secondsSpan = $('#seconds');
    minutesSpan.html(minutes);
    secondsSpan.html(seconds);  
};


//Google Map callback to initialize the map
function initMap() {
    googleMap.init(document.getElementById("map"), 48.866667, 2.333333, 15);
    var apiUrl = "https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49";
    googleMap.getResponse(apiUrl);
};




