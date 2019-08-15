function OutroSplash(prizes)
{
    SplashScreen.call(this);

    this.prizes = prizes;
    this.getMessage = this.getMessage.bind(this);

    var msg = this.getMessage(prizes);

    this.outrotext = new PIXI.Text(msg, {font : 'bold 60px Arial', fill : 0xffcc00, align : 'center', dropShadow:true,dropShadowDistance:3});
    this.outrotext.position = new Point(this.background.position.x, this.background.position.y - ((this.background.height/2)+40));
    this.outrotext.anchor.x = this.outrotext.anchor.y = 0.5;


    this.onSplashShowing = this.onSplashShowing.bind(this);
    this.onSplashDismissed = this.onSplashDismissed.bind(this);
    Events.Dispatcher.addEventListener(Event.SPLASH_SHOWING, this.onSplashShowing);


}
OutroSplash.prototype = Object.create(SplashScreen.prototype);
OutroSplash.constructor = OutroSplash;
OutroSplash.prototype.outrotext = null;
OutroSplash.prototype.prizes = null;


OutroSplash.prototype.getMessage = function(prizes)
{
    var msg = "";

    var vals = [];
    var count = [];
    for(var i in prizes.data)
    {
        if(!vals.includes(prizes.data[i]))
        {
            vals.push(prizes.data[i]);
            count[prizes.data[i]] = 1;
        }
        else
        {
            count[prizes.data[i]]++;
        }
    }

    var prize = 0;
    for(var p in count)
    {
        if(count[p] >= 3)
        {
            prize = parseFloat(p);
            break;
        }
    }

    if(prize > 0)
    {
        msg = "Congratulations!\n";
        msg += "You win GBP " + prize.toFixed(2) + "!!!";
    }
    else
    {
        msg = "You didn't match 3 or more prizes.\nBetter luck next time!";
    }

    return msg;
}


OutroSplash.prototype.onSplashShowing = function (data)
{
    Events.Dispatcher.removeEventListener(Event.SPLASH_SHOWING, this.onSplashShowing);
    Events.Dispatcher.addEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);
    this.addChild(this.outrotext);
}

OutroSplash.prototype.onSplashDismissed = function()
{
    Events.Dispatcher.removeEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);
    this.removeChild(this.outrotext);
}