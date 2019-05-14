function Slider() {

    this.init = function () {
        for (var i=1; i <= $('.slider__slide').length; i++){
            $('.slider__indicators').append('<div class="slider__indicator" data-slide="'+i+'"></div>')
        }
        this.startSlider();
        this.automatic();
    }

    this.startSlider = function () {
        setTimeout(function(){
            $('.slider__wrap').addClass('slider__wrap--hacked');
            this.animate();
            this.goToSlide(this.currentSlide);
        }.bind(this), 1000);
        this.clickNext();
    }

    this.goToSlide = function(number){
        $('.slider__slide').removeClass('slider__slide--active');
        $('.slider__slide[data-slide='+number+']').addClass('slider__slide--active');
    }
    this.automatic = function () {
        setTimeout(function () {
            this.animate();
            this.goToSlide(this.currentSlide);
            this.automatic();
        }.bind(this), 5500)
    }
    this.animate = function () {
        this.currentSlide = Number($('.slider__slide--active').data('slide'));
        var totalSlides = $('.slider__slide').length;
        this.currentSlide++
        if (this.currentSlide > totalSlides){
            this.currentSlide = 1;
        }
    }
    this.clickNext = function () {
        $('.slider__next, .go-to-next').on('click', function(){
            this.animate();
            this.goToSlide(this.currentSlide);
        }.bind(this))
    }

    this.init();
}