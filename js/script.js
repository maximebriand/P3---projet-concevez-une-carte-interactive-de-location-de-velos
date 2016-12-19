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

//MAP
var map;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.866667, lng: 2.333333},
    zoom: 15
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
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
    handleLocationError(false, infoWindow, map.getCenter());
  }





var velibJSON;

$.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function(json) {
    velibJSON = json;
    $.each(velibJSON, function() {
        
        var marker = new google.maps.Marker({
            position: { lat: this.position.lat, lng: this.position.lng },
            map: map,
            title: this.address
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

        if (banking === true){banking = "disponible"}
        else {banking = "indisponible"};

        if (status === "OPEN") {status = "ouverte"}
        else {status = "fermée"};

        var infocontent = $('aside');
        marker.addListener('click', function() {
            infocontent.empty();
            infocontent.append(
                "<p class=\"available_bikes\">Station : <span>" + name + "</span></p>"
                + "<p class=\"available_bikes\">La station est <span>" + status + "</span></p>"
                + "<p class=\"available_bikes\">Adresse : <span>" + address + "</span></p>"
                + "<p class=\"available_bikes\"><span>" + places + "</span> de places à cette station</p>"
                + "<p class=\"available_bikes\"><span>" + availableBikes + "</span> vélos sont disponibles</p>"
                + "<p class=\"available_bikes\"><span>" + availableBikeStands + "</span> emplacements sont libres</p>"
                + "<p class=\"available_bikes\">Le paiement à cette station est <span>" + banking + "</span></p>"
            );
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
        
    })
});

}


//VELIB

// API KEY= 1ee25283f155079a4b54ddab39eac6d733b1fa49
// var velibJSON;

// $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function( json ) {
//     velibJSON = json;
//     $.each(velibJSON, function(){
//         console.log(this);
//     });
// });


