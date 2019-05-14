$(document).ready(function(){
    var startingBooking = new Booking();
    startingBooking.checkBooking();

    function initMapNantes() {
        const mapElt = $('#map')[0];
        const centerLat = 47.2173;
        const centerLng = -1.5534;
        const zoom = 12;
        const city = 'Nantes';

        const nantes = new myMap(mapElt, centerLat, centerLng, zoom, city, startingBooking);
        nantes.init();
    };

    initMapNantes();



});