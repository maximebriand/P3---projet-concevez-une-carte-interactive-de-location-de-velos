function Booking (station) {
    this.bookingDate = Math.floor($.now() / 1000);
    this.bookingLimit = 20 * 60; // 20 minutes * 60 seconds
    this.footer = $('footer div.wrapper');

    this.init = function (station){
        this.station = station;
        this.createBooking();
    }

    this.createBooking = function() {
        var alertElt = $("aside .content .alert");
        sessionStorage.setItem("station", JSON.stringify(this.station));
        sessionStorage.setItem("bookingDate", this.bookingDate);
        this.displayBookingInfo();
        this.startCountdow();
        alertElt.remove();
    }

    this.startCountdow = function() {
        clearTimeout(this.timeOutVariable);
        this.countDown();
    }

    this.displayBookingInfo = function() {
        this.footer.html("<p>1 vélo réservé à la station " + this.station.name + " pour <span id=\"minutes\"></span> minutes et <span id=\"seconds\"></span> secondes");
    }

    //Function to excecute when the map is initialize to check if there is already a booking in webstorage.
    this.checkBooking = function() {
        this.bookingPastTime = (Math.floor($.now()) / 1000) - (sessionStorage.getItem("bookingDate"));
        const temp =  sessionStorage.getItem('station');
        this.station = $.parseJSON(temp);

        // IF SESSION OF 20 MINUTES IS STILL AVAILABLE WE DISPLAY THE VALUE IN THE FOOTER
        if (this.bookingPastTime < this.bookingLimit && sessionStorage.getItem("station")) {

            this.bookingLimit = this.bookingLimit - Math.round(this.bookingPastTime);
            this.createBooking();

        } else {
            this.footer.html("<p>Vous n'avez pas de réservation en cours</p>")
        }
    }

    this.countDown = function() {
        this.bookingLimit--;
        this.timeOutVariable = setTimeout(function () {
            if (this.bookingLimit > 0) {
                this.countDown();
            } else {
                this.footer.html("<p>Votre réservation a expiré</p>")
            }
        }.bind(this), 1000);

        var minutes = Math.floor(this.bookingLimit / 60);
        var seconds = this.bookingLimit - minutes * 60;

        this.minutesSpan = $('#minutes');
        this.secondsSpan = $('#seconds');
        this.minutesSpan.html(minutes);
        this.secondsSpan.html(seconds);
    }
}

