function Console(bgBounds) {
    PIXI.Container.call(this);

    this.leftAlign = -((bgBounds.width/2)+100);
    this.rightAlign = (bgBounds.width/2)+100;
    this.consoleElements = [];

    //
    this.launchButtonR = new LaunchButton("launchbutton", this.rightAlign, 160, "launchbuttonR");
    this.launchButtonL = new LaunchButton("launchbutton", this.leftAlign, 160, "launchbuttonL");
    
    this.consoleElements.push(this.launchButtonR);
    this.consoleElements.push(this.launchButtonL);
    
    //
    this.navButtonUpR = new NavButton("upbutton", this.rightAlign, -200, "up");
    this.navButtonUpL = new NavButton("upbutton", this.leftAlign, -200, "up");

    this.consoleElements.push(this.navButtonUpR);
    this.consoleElements.push(this.navButtonUpL);

    //
    this.navButtonRight = new NavButton("rightbutton", this.rightAlign, -80, "right");

    this.navButtonLeft = new NavButton("leftbutton", this.leftAlign, -80, "left");

    this.consoleElements.push(this.navButtonRight);
    this.consoleElements.push(this.navButtonLeft);

    //
    this.navButtonDownR = new NavButton("downbutton", this.rightAlign, 40, "down");
    this.navButtonDownL = new NavButton("downbutton", this.leftAlign, 40, "down");

    this.consoleElements.push(this.navButtonDownR);
    this.consoleElements.push(this.navButtonDownL);

    // --

    this.enable = this.enable.bind(this);
    this.animate = this.animate.bind(this);
    this.disable = this.disable.bind(this);
    this.getAlignment = this.getAlignment.bind(this);

    this.show();
}
Console.prototype = Object.create(PIXI.Container.prototype);
Console.prototype.constructor = Console;
Console.prototype.launchButtonR = null;
Console.prototype.launchButtonL = null;
Console.prototype.consoleElements = null;
Console.SHOW = 0;
Console.HIDE = 1;
Console.prototype.state = Console.SHOW;
Console.prototype.leftAlign = null;
Console.prototype.rightAlign = null;
Console.prototype.rocketBay = null;
// --

/**
 * TODO Clicks may fire twice on certain android devices
 * but only once on iPad or desktop or other Androids.
 * May be to do with this function being run onTap AND onClick
 * @see Button.js constructor
 * Try to deal with some Droid double-tap issue
 */


Console.prototype.getAlignment = function()
{
    return new Point(this.leftAlign, this.rightAlign);
}



// -- fade in and out

Console.prototype.show = function(){
    trace("Console show");
    for(var e in this.consoleElements)
    {
        this.addChild(this.consoleElements[e]);
    }
    this.state = Console.SHOW;
    globalTicker.add(this.animate);
}

Console.prototype.hide = function(){
    trace("Console hide");
    this.state = Console.HIDE;
    globalTicker.add(this.animate);
}


// fade in and out
Console.prototype.animate = function(data){

    switch(this.state)
    {
        case Console.SHOW:
            for(var e in this.consoleElements){
                this.consoleElements[e].alpha += 0.05;
                if(this.consoleElements[e].alpha > 1.0)
                {
                    this.consoleElements[e].alpha = 1.0;
                }
            }
            // Only need to test one
            if(this.consoleElements[0].alpha == 1)
            {
                globalTicker.remove(this.animate);
            }
            break;
        case Console.HIDE:
            for(var e in this.consoleElements)
            {
                this.consoleElements[e].alpha -= 0.05;
                if(this.consoleElements[e].alpha < 0.0)
                {
                    this.consoleElements[e].alpha = 0.0;
                }
            }
            // Only need to test one
            if(this.consoleElements[0].alpha == 0.0){
                globalTicker.remove(this.animate);
                for(var e in this.consoleElements)
                {
                    this.removeChild(this.consoleElements[e]);
                }
            }
            break;
    }

}
Console.prototype.enable = function(){
    trace("Console enable");
    this.launchButtonR.setEnable(true);
}
Console.prototype.disable = function(){
    trace("Console disable");
    this.launchButtonR.setEnable(false);
}


