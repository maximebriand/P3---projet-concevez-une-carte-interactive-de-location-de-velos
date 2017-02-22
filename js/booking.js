var googleMap = {
    map: null,

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
            if (status === "ouverte" && availableBikes >= 1) { bookingButton.show(); }

            sessionStorage.setItem("stationSelectedMarker", clickedMarker.name);
            sessionStorage.setItem("latSelectedMarker", clickedMarker.position.lat);
            sessionStorage.setItem("lngSelectedMarker", clickedMarker.position.lng);
        });
    }
};




var newBooking = {
    station: null,
    stationLat: null,
    stationLng: null,
    bookingDate: Math.floor($.now() / 1000),
    markerImg: "css/img/pin_velib_booked.png",

    initBooking: function(markerStation, markerLat, markerLng) {
        this.station = markerStation;
        this.stationLat = markerLat;
        this.stationLng = markerLng;
    },
    createBooking: function(){
        sessionStorage.setItem("station", this.station);
        sessionStorage.setItem("bookingDate", this.bookingDate);
        displayBookingInfo();
        this.startCountdow();
    }, 
    startCountdow: function() {
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

var timeOutVariable;

//Function to excecute when the map is initialize to check if there is already a booking in webstorage.
function checkBooking() {
    var bookingPastTime = (Math.floor($.now()) / 1000) - (sessionStorage.getItem("bookingDate"));
   
    // IF SESSION OF 20 MINUTES IS STILL AVAILABLE WE DISPLAY THE VALUE IN THE FOOTER
    if (bookingPastTime < bookingLimit && sessionStorage.getItem("station")) {
        bookingLimit = bookingLimit - Math.round(bookingPastTime);
        timeOutVariable = setTimeout(countDown, 1000);
        displayBookingInfo();
    } else {
        footer.html("<p>Vous n'avez pas de réservation en cours</p>")
    }
}

function bookingButtonClick(){
    var bookingButton = $('#booking');
    bookingButton.click(function() {
        var superBooking = Object.create(newBooking); //create a booking object
        superBooking.initBooking(
            sessionStorage.getItem("stationSelectedMarker"), 
            sessionStorage.getItem("latSelectedMarker"), 
            sessionStorage.getItem("lngSelectedMarker"));
        superBooking.createBooking();
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
    googleMap.addMarker(apiUrl);
};




