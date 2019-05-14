/**
 * Created by maximebriand on 14/05/2019.
 */

function myMap(mapElt, centerLat, centerLng, zoom, city, startingBooking) {
    this.mapElt = mapElt;
    this.centerLat = centerLat;
    this.centerLng = centerLng;
    this.zoom = zoom;
    this.city = city;
    this.tempTable = [];
    this.startingBooking = startingBooking;

    this.init = function()
    {
        this.createMap();
    }

    this.createMap = function() {
        this.mapBike = new google.maps.Map(this.mapElt, {
            center: {
                lat: this.centerLat,
                lng: this.centerLng
            },
            zoom: this.zoom,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#d7b79c"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]
        });
        this.getJsonData();
    }

    this.getJsonData = function () {
        const url = "https://api.jcdecaux.com/vls/v1/stations?contract=" + this.city + "&apiKey=1ee25283f155079a4b54ddab39eac6d733b1fa49";
        $.getJSON(url, function(json) {
            $.each(json, function(index, value) {
                this.addMarker(value);
            }.bind(this));
        }.bind(this));
    }

    this.addMarker = function(station){
        const thisStation = station;
        var image;
        var iconSize = new google.maps.Size(38, 38); // scaled size
        if (thisStation.status === "OPEN" && thisStation.available_bikes >= 1) {
            image = "css/img/pin_velib_open.png";
        } else if (status === "BOOKED") {
            image = "css/img/pin_velib_booked.png";
            iconSize = new google.maps.Size(45, 45);
        }else {
            image = "css/img/pin_velib_closed.png";
        }

        var icon = {
            url: image,
            scaledSize: iconSize
        }

        marker = new google.maps.Marker({
            position: thisStation.position,
            map: this.mapBike,
            icon: icon
        });
        marker.addListener('click', function (thisstation) {
            var dataDisplayed = new displayData(thisStation, this.startingBooking);
        }.bind(this));
    }


}