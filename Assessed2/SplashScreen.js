function SplashScreen()
{
    PIXI.Container.call(this);

    this.background = new PIXI.Sprite(PIXI.utils.TextureCache["img/splashscreen.png"]);
    this.background.anchor.x = this.background.anchor.y = 0.5;
    this.background.scale.x = this.background.scale.y = 0;
    this.background.alpha = 0;
    this.addChild(this.background);
    this.background.interactive = true;


    var that = this;
        this.background.click = this.background.tap = function(data){
            that.onClick(data);
        }

    this.animateIn = this.animateIn.bind(this);
    globalTicker.add(this.animateIn);
}
SplashScreen.prototype = Object.create(PIXI.Container.prototype);
SplashScreen.prototype.constructor = SplashScreen;
SplashScreen.prototype.background;
SplashScreen.prototype.text;


SplashScreen.prototype.onClick = function(data)
{
    this.removeChild(this.background);
    this.removeChild(this.text);
    Events.Dispatcher.dispatchEvent(new Event(Event.SPLASH_DISMISSED, this));
}

SplashScreen.prototype.animateIn = function(data)
{
    if(this.background.alpha < 1.0)
    {
        this.background.alpha += 0.05;
    }
    else
    {
        this.background.alpha = 1.0;
    }

    if(this.background.scale.x < 2.0)
    {
        this.background.scale.x += 0.05;
        this.background.scale.y += 0.05;
    }
    else
    {
        this.background.scale.x = this.background.scale.y = 2.0;
    }

    if(this.background.scale.x == 2.0 && this.background.alpha == 1.0)
    {
        Events.Dispatcher.dispatchEvent(new Event(Event.SPLASH_SHOWING, this));
        globalTicker.remove(this.animateIn);

        var msg = "CLICK TO PLAY!";
        this.text = new PIXI.Text(msg, {font : 'bold 46px Arial', fill : 0xffcc00, align : 'center', dropShadow:true,dropShadowDistance:3});
        this.text.position = new Point(this.background.position.x, this.background.position.y + ((this.background.height/2)-40));
        this.text.anchor.x = this.text.anchor.y = 0.5;
        this.addChild(this.text);
    }

}