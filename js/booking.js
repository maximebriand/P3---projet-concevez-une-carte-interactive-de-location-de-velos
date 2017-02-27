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
        signButtonClick(); //create a new booking each time the booking button is hitten
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
                
                canvas = $('.canvas');
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
            
            if (isMobile === true) {displayMobileElt();};

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

function signButtonClick() {

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

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


function displayMobileElt() {
    $(".map_with_infos").css("height", "750px");
    $("aside").css({
        "height": "300px", 
        "display": "block"
    });
}


