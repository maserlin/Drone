/**
 * A fairly basic button implementation with 4 states:
 * 0 up (normal)
 * 1 down (pressed)
 * 2 on (highlit) todo
 * 3 off (greyed out) todo
 *
 * Basically it's a MovieClip and is expecting a spritesheet with 4 images
 * labelled _up, _down, _on, _off
 *
 * @param imageName
 * @param posX
 * @param posY
 * @param name
 * @constructor
 */
function Button(imageName,posX,posY,name){
    this.name = name || imageName;


    var buttonTextures = [];
    for(var i in PIXI.utils.TextureCache){
        //trace(i);
        if(String(i).indexOf(imageName+"-") != -1){
            if(String(i).indexOf("0") != -1){
                buttonTextures[0] = PIXI.Texture.fromFrame(i);
            }
            if(String(i).indexOf("1") != -1){
                buttonTextures[1] = PIXI.Texture.fromFrame(i);
            }
            if(String(i).indexOf("2") != -1){
                buttonTextures[2] = PIXI.Texture.fromFrame(i);
            }
            if(String(i).indexOf("3") != -1){
                buttonTextures[3] = PIXI.Texture.fromFrame(i);
            }
            trace(i)
        }
    }

    PIXI.extras.MovieClip.call(this, buttonTextures);
    this.position.x = posX || 100;
    this.position.y = posY || 100;
    this.anchor.x = this.anchor.y = 0.5;
    this.loop = false;
    this.gotoAndStop(0);
    this.interactive = true;

    var that = this;
    this.mousedown = this.touchstart = function(data){
        console.log("Down");
        that.onDown(data);
    }
    this.mouseup = this.mouseout = this.touchend = function(data){
        console.log("Up");
        that.onUp(data);
    }
    this.click = this.tap = function(data){
        that.onClick(data);
    }
}
Button.prototype = Object.create(PIXI.extras.MovieClip.prototype);
Button.constructor = Button;
Button.prototype.active = true;

Button.prototype.onDown = function(data){
    this.gotoAndStop(1);
}
Button.prototype.onUp = function(data){
    if(this.active)this.gotoAndStop(0);
}
Button.prototype.onClick = function(data){
    console.log("Click");
}

Button.prototype.setEnable = function(enable){
    if(enable){
        this.active = true;
        this.gotoAndStop(0);
    }
    else{
        this.active = false;
        this.gotoAndStop(2);
    }
}

Button.prototype.setVisible = function(vis){
    this.visible = vis;
}
