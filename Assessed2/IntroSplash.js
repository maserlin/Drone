function IntroSplash()
{
    SplashScreen.call(this);


    var msg = "Click to place drone\n";
    msg += "UP button = Forwards\n";
    msg += "DOWN button = Backwards\n";
    msg += "L/R buttons = Turn\n";
    msg += "RED button = FIRE!\n";
    msg += "\nMATCH 3 PRIZES TO WIN!\n";
    this.introtext = new PIXI.Text(msg, {font : 'bold 46px Arial', fill : 0xffcc00, align : 'center', dropShadow:true,dropShadowDistance:3});
    this.introtext.position = new Point(this.background.position.x, this.background.position.y - ((this.background.height/2)+40));
    this.introtext.anchor.x = this.introtext.anchor.y = 0.5;


    this.onSplashShowing = this.onSplashShowing.bind(this);
    this.onSplashDismissed = this.onSplashDismissed.bind(this);
    Events.Dispatcher.addEventListener(Event.SPLASH_SHOWING, this.onSplashShowing);


}
IntroSplash.prototype = Object.create(SplashScreen.prototype);
IntroSplash.constructor = IntroSplash;
IntroSplash.prototype.introtext = null;


IntroSplash.prototype.onSplashShowing = function (data)
{
    Events.Dispatcher.removeEventListener(Event.SPLASH_SHOWING, this.onSplashShowing);
    Events.Dispatcher.addEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);
    this.addChild(this.introtext);
}

IntroSplash.prototype.onSplashDismissed = function()
{
    Events.Dispatcher.removeEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);
    this.removeChild(this.introtext);
}