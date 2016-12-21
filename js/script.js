//SLIDER
var slideIndex, clickedArrow;
slideIndex = 1;
clickedArrow = $('.arrow');

displaySlide(slideIndex);

clickedArrow.click(function(){
    if ($(this).hasClass( "next" )) {
        changeSlide(1);
    } if ($(this).hasClass( "previous" )) {
        changeSlide(-1);
    }
});

$(document).keydown(function(e){
   switch (e.which){
     case 37: // fleche gauche
       changeSlide(-1);
       break;
     case 39: // fleche droite
       changeSlide(1);
       break;
   }
}); 

function changeSlide(n) {
  displaySlide(slideIndex += n);
}

function displaySlide(n) {
    var i;
    var numberSlides = $(".slide");
    if (n > numberSlides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = numberSlides.length }
    for (i = 0; i < numberSlides.length; i++) {
        $(numberSlides[i]).hide(500, "linear");
    }
    $(numberSlides[slideIndex - 1]).show(100, "linear");
}




sessionStorage.setItem("station", "");
//MAP
var map, velibJSON, marker, infocontent;
infocontent = $('aside div.content');

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 48.866667, lng: 2.333333 },
        zoom: 15
    });
    

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var infoWindow = new google.maps.InfoWindow({ map: map });
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Vous êtes ici.');
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        var infoWindow = new google.maps.InfoWindow({ map: map });
        handleLocationError(false, infoWindow, map.getCenter());
    }

    $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function(json) {
        velibJSON = json;
        $.each(velibJSON, function() {
            var image = "css/img/pin_velib_small.png";

            var marker = new google.maps.Marker({
                position: { lat: this.position.lat, lng: this.position.lng },
                map: map,
                icon: image,
                title: this.address
            });

              marker.addListener('click', function() {
                canvas.style.display = "none";
                signBtn[0].style.display = "none";
              });

            var address, places, availableBikes, availableBikeStands, banking, bonus, name;
            address = this.address;
            places = this.bike_stands;
            availableBikes = this.available_bikes;
            availableBikeStands = this.available_bike_stands;
            banking = this.banking;
            bonus = this.bonus;
            name = this.name;
            status = this.status;

            if (banking === true) { banking = "disponible" } else { banking = "indisponible" };

            if (status === "OPEN") { status = "ouverte" } else { status = "fermée" };

            
            marker.addListener('click', function() {
                infocontent.empty();
                var placesDescription, availableBikesDescription, availableBikeStandsDescription;
                if ( places <= 1 ){ placesDescription = "</span> place à cette station</li>" }
                    else { placesDescription = "</span> places à cette station</li>" };

                if (availableBikes <= 1 ) {availableBikesDescription = "</span> vélo de disponible</li>" }
                    else {availableBikesDescription = "</span> vélos sont disponibles</li>"};

                if ( availableBikeStands <= 1 ) { availableBikeStandsDescription = "</span> emplacement de libre</li>" }
                    else { availableBikeStandsDescription = "</span> emplacements sont libres</li>" }

                infocontent.append(
                    "<h3 class=\"available_bikes\">Station : <span>" + name + "</span></h3> <ul>" +
                    "<li class=\"available_bikes\">La station est <span>" + status + "</span></li>" +
                    "<li class=\"available_bikes\">Adresse : <span>" + address + "</span></li>" +
                    "<li class=\"available_bikes\"><span>" + places + " " + placesDescription +
                    "<li class=\"available_bikes\"><span>" + availableBikes + " " + availableBikesDescription +
                    "<li class=\"available_bikes\"><span>" + availableBikeStands + " " + availableBikeStandsDescription +
                    "<li class=\"available_bikes\">Le paiement à cette station est <span>" + banking + "</span></li></ul>" +
                    "<button class=\"booking\">Réserver un vélo</button>"
                );

                //BOOKING FUNCTION
                bookVelib(name);

            });
            // To add the marker to the map, call setMap();
            marker.setMap(map);

        })
    });

} 
sessionStorage.setItem("station", "");

//BOOK A VELIB FUNCTION
function bookVelib(station) {
    var footer, bookingButton, bookingLimit, canvas;
    footer = $('footer div.wrapper');
    bookingButton = $('.booking'),
    bookingLimit = "20min";
    canvas = $('#canvas');
    

    bookingButton.click(function() {
        canvas.show();
        signBtn.show();

        if (sessionStorage.getItem("station") === station) {
            alert("vous avez déjà réservé un Velib à cette station !");

        } else {
            sessionStorage.setItem("station", station);

            bookingLimit = 20 * 60;
            sessionStorage.clear();

            footer.html();
            setTimeout(function() { sessionStorage.removeItem("station"); }, (bookingLimit));
            setTimeout(countDown, 1000);

            function countDown() {
                bookingLimit--;
                if (bookingLimit > 0) {
                    setTimeout(countDown, 1000);
                }
                var minutes = Math.floor(bookingLimit / 60);
                var seconds = bookingLimit - minutes * 60;

                minutesSpan = $('#minutes');
                secondsSpan = $('#seconds');
                minutesSpan.html(minutes);
                secondsSpan.html(seconds);

            }

            footer.append("<p>1 vélo réservé à la station " + station + " pour <span id=\"minutes\"></span> minutes et <span id=\"seconds\"></span> secondes")

        }
    });


    };



//CANVAS
//http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#demo-simple
var canvas, context, signBtn;
canvas = $('#canvas')[0];
signBtn = $('#sign');
context = canvas.getContext('2d');

$('#canvas').mousedown(function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});
$('#canvas').mousemove(function(e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});
$('#canvas').mouseup(function(e) {
    paint = false;
});
$('#canvas').mouseleave(function(e) {
    paint = false;
});
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#333";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}

function clearCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}


signBtn.click(function() {
    clearCanvas();
})









