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

$(document).keydown(function(keyboard){
   switch (keyboard.which){
     case 37: // left arrow
       changeSlide(-1);
       break;
     case 39: // right arrow
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
    if (n > numberSlides.length) { slideIndex = 1 } //if slide index is bigger than number of slides we go back to the first one
    if (n < 1) { slideIndex = numberSlides.length } //if slide index is lower than 1 we go to the last one
    for (i = 0; i < numberSlides.length; i++) {
        $(numberSlides[i]).hide(500, "linear");
    }
    $(numberSlides[slideIndex - 1]).show(100, "linear");
    
}