
function Canvas(isMobile){

    this.canvas = $('#canvas')[0];
    this.canvasElt = $('#canvas');
    this.signButton = $('#sign');
    this.ctx = this.canvas.getContext("2d");
    this.ctx.strokeStyle = "#333";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 3;
    this.isMobile = isMobile;

    this.drawing = false;
    this.mousePos = { x:0, y:0 };
    this.lastPos = this.mousePos;
    
    this.init = function () {
        this.canvasElt.show();
        this.signButton.show();
        this.mouseDown();
        this.mouseUp();
        this.mouseMove();
        this.touchStart();
        this.touchEnd();
        this.touchMove();
        this.scrollStart();
        this.scrollEnd();
        this.scrollMove();
    }

    this.mouseDown = function(){
        this.canvas.addEventListener("mousedown", function(e){
            this.drawing = true;
            this.lastPos = this.getMousePos(this.canvas, e);
        }.bind(this));
    },

    this.mouseUp = function(){
        this.canvas.addEventListener("mouseup", function(e){
            this.drawing = false;
        }.bind(this));
    },

    this.mouseMove = function(){
        this.canvas.addEventListener("mousemove", function(e){
            this.mousePos = this.getMousePos(this.canvas, e);
            this.renderCanvas();
        }.bind(this));
    },

    this.getMousePos = function(canvasDom, mouseEvent){
        const rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    },

    this.renderCanvas = function(){
        if(this.drawing){
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
            this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
            this.ctx.stroke();
            this.lastPos = this.mousePos;
        }
    },


    this.touchStart = function(){
        this.canvas.addEventListener("touchstart", function(e){
            this.drawing = true;
            this.lastPos = this.getTouchPos(this.canvas, e);
        }.bind(this), {passive: true});
    },

    this.touchEnd = function(){
        this.canvas.addEventListener("touchend", function(){
            this.drawing = false;
        }.bind(this));
    },

    this.touchMove = function(){
        this.canvas.addEventListener("touchmove", function(e){
            this.mousePos = this.getTouchPos(this.canvas, e);
            this.renderCanvas();
        }.bind(this), {passive: true});
    },

    this.getTouchPos = function(canvasDom, touchEvent){
        const rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    },

    this.scrollStart = function(){
        window.addEventListener("touchstart", function(e){
            if(e.target === this.canvas){
                e.preventDefault();
            }
        }.bind(this), {passive: false});
    },

    this.scrollEnd = function(){
        window.addEventListener("touchend", function(e){
            if(e.target === this.canvas){
                e.preventDefault();
            }
        }.bind(this));
    },

    this.scrollMove = function(){
        window.addEventListener("touchmove", function(e){
            if(e.target === this.canvas){
                e.preventDefault();
            }
        }.bind(this), {passive: false});
    }
    
    this.isEmpty = function () {
        const blank = document.createElement('canvas');

        blank.width = this.canvas.width;
        blank.height = this.canvas.height;

        return this.canvas.toDataURL() === blank.toDataURL();
    }

    this.init();
}






