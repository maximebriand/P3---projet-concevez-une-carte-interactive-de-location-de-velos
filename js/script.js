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
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.866667, lng: 2.333333},
    zoom: 12
  });

//     var contentString = '<div id="content">'+
//       '<div id="siteNotice">'+
//       '</div>'+
//       '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//       '<div id="bodyContent">'+
//       '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//       'sandstone rock formation in the southern part of the '+
//       'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//       'south west of the nearest large town, Alice Springs; 450&#160;km '+
//       '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//       'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//       'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//       'Aboriginal people of the area. It has many springs, waterholes, '+
//       'rock caves and ancient paintings. Uluru is listed as a World '+
//       'Heritage Site.</p>'+
//       '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//       'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//       '(last visited June 22, 2009).</p>'+
//       '</div>'+
//       '</div>';

// var infowindow = new google.maps.InfoWindow({
//     content: contentString
//   });
var velibJSON;

$.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function( json ) {
    velibJSON = json;
    $.each(velibJSON, function(){
          var marker = new google.maps.Marker({
            position: {lat: this.position.lat, lng: this.position.lng},
            map: map,
            title: this.address
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          
            }); 

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    })
});

}

//VELIB

// API KEY= 1ee25283f155079a4b54ddab39eac6d733b1fa49
var velibJSON;

$.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49", function( json ) {
    velibJSON = json;
    console.log(velibJSON);
});


