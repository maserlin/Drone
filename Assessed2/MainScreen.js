function MainScreen(bgBounds, consolePos)
{
    GameScreen.call(this);

    this.grid = new Grid(bgBounds);
    this.addChild(this.grid);

    this.onGridClicked = this.onGridClicked.bind(this);
    Events.Dispatcher.addEventListener(Event.GRID_CLICKED, this.onGridClicked);

    // consoleP.y is the right-hand column of buttons alignment
    this.rocketBay = new RocketBay(new Point(consolePos.y-56, 100));
    this.addChild(this.rocketBay);

    this.drone = new Drone(new Point(consolePos.x, 120));
    this.addChild(this.drone);
    this.onDroneMoveCmd = this.onDroneMoveCmd.bind(this);
    Events.Dispatcher.addEventListener(Event.DRONE_MOVE, this.onDroneMoveCmd);

    this.onLaunchButtonClicked = this.onLaunchButtonClicked.bind(this);
    Events.Dispatcher.addEventListener(Event.LAUNCH_BUTTON_CLICKED, this.onLaunchButtonClicked);

    this.onMissileComplete = this.onMissileComplete.bind(this);
    this.awardPrizes = this.awardPrizes.bind(this);
    this.fadeText = this.fadeText.bind(this);

    this.showPrizeSplash = this.showPrizeSplash.bind(this);
    this.onSplashDismissed = this.onSplashDismissed.bind(this);

    this.canLaunch = this.canLaunch.bind(this);

    this.droneReport = this.droneReport.bind(this);
    this.clearReport = this.clearReport.bind(this);
    Events.Dispatcher.addEventListener(Event.DRONE_CLICKED, this.droneReport);

    // Center ourselves onscreen
//    this.pivot.x = this.width/2;
//    this.pivot.y = this.height/2;
//    this.position.x = getWindowBounds().x/2;
//    this.position.y = getWindowBounds().y/2;


}
MainScreen.prototype = Object.create(GameScreen.prototype);
MainScreen.constructor = MainScreen;
MainScreen.prototype.rocketBay = null;
MainScreen.prototype.drone = null;
MainScreen.prototype.grid = null;
MainScreen.prototype.droneGridElement = null;
MainScreen.prototype.missile = null;
MainScreen.prototype.prizes = null;
MainScreen.prototype.prizeTexts = null;
MainScreen.prototype.firePoints = null;
MainScreen.prototype.reportText = null;

MainScreen.prototype.droneReport = function(data)
{
    var msg = "Drone is docked";
    if(this.drone.docked == false)
    {
        msg = "Drone is at\n";
        msg += "" + this.droneGridElement.Col + "," + (9-this.droneGridElement.Row) + "\n";
        msg += "Facing " + this.drone.directions[this.drone.direction];
    }

    this.reportText = new PIXI.Text(msg, {font : 'bold 28px Arial', fill : 0xff1010, align : 'center', dropShadow:true,dropShadowDistance:3});
    this.reportText.position = new Point(-700,-300);
    this.reportText.anchor.x = this.reportText.anchor.y = 0.5;
    this.addChild(this.reportText);

    var that = this;
    setTimeout(that.clearReport,1000);

}
MainScreen.prototype.clearReport = function(data)
{
    this.removeChild(this.reportText);
}

MainScreen.prototype.canLaunch = function()
{
    return  this.drone.state == Drone.HOVERING &&
            this.missile == null &&
            this.rocketBay.hasRockets();
}

MainScreen.prototype.onLaunchButtonClicked = function(data)
{
    trace("MainScreen.prototype.onLaunchButtonClicked " + data.type + " " + data.data.name);

    if( this.canLaunch() )
    {
        trace("Launch a missile");

        //
        var targetData = this.drone.acquireTarget(this.droneGridElement,this.grid.getTileSize());
        if(targetData != null)
        {
            if(this.firePoints[targetData.Row][targetData.Col] == true)
            {
                this.firePoints[targetData.Row][targetData.Col] = false;

                Events.Dispatcher.addEventListener(Event.MISSILE_COMPLETE, this.onMissileComplete);

                this.missile = new Missile(targetData);//new Point(targetData.Origin.x,targetData.Origin.y),targetData.Point);
                this.addChild(this.missile);
                this.removeChild(this.drone);
                this.addChild(this.drone);
                this.rocketBay.hideRocket();
            }
        }
    }

}

MainScreen.prototype.onMissileComplete = function(data)
{
    Events.Dispatcher.removeEventListener(Event.MISSILE_COMPLETE, this.onMissileComplete);
    this.removeChild(this.missile);
    this.missile = null;

    var rand = Math.floor(Math.random() * config.prizes.length);

    var win = config.prizes[rand];
    this.prizes.push(win);


//    win /= 100;
    win = win.toFixed(2);

    trace("rand,prize=" + rand + " " + win);

    var msg = "GBP\n" + win;
    var text = new PIXI.Text(msg, {font : 'bold 28px Arial', fill : 0xff1010, align : 'center', dropShadow:true,dropShadowDistance:3});
    text.position = data.data;
    text.anchor.x = text.anchor.y = 0.5;
    this.addChild(text);
    this.prizeTexts.push(text);

    if(this.prizeTexts.length == 5)
    {
        var that = this;
        setTimeout(that.awardPrizes, 2000);
    }
}

MainScreen.prototype.awardPrizes = function(data)
{
    trace("award prizes");
    this.drone.returnToBase();
    globalTicker.add(this.fadeText);
}

MainScreen.prototype.fadeText = function(data)
{
    for(text in this.prizeTexts)
    {
        this.prizeTexts[text].alpha -= 0.05;
    }

    if(this.prizeTexts[0].alpha <= 0)
    {
        for(text in this.prizeTexts)
        {
            this.removeChild(this.prizeTexts[text]);
            this.prizeTexts.pop();
        }
        globalTicker.remove(this.fadeText);

        this.showPrizeSplash();
    }
}

MainScreen.prototype.showPrizeSplash = function()
{
    Events.Dispatcher.addEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);
    Events.Dispatcher.dispatchEvent(new Event(Event.SHOW_PRIZE_SPLASH, this.prizes));
}

MainScreen.prototype.onSplashDismissed = function()
{
    Events.Dispatcher.removeEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);

    // reset game?
    this.rocketBay.showRockets();
}

MainScreen.prototype.onDroneMoveCmd = function(data)
{
    var cmd = data.data.action;
    trace("MainScreen.prototype.onDroneMoveCmd " + cmd);
    if(cmd == "left" || cmd == "right")
    {
        trace ("Turn drone " + cmd);
        this.drone.turn(cmd);
    }
    else
    {
        trace("MainScreen.prototype.onDroneMoveCmd from " + this.droneGridElement.Row + " " + this.droneGridElement.Col);

        switch(cmd)
        {
            case "up":
                this.droneGridElement = this.drone.flyForwards(this.droneGridElement,this.grid.getTileSize());
            break;
            case "down":
                this.droneGridElement = this.drone.flyBackwards(this.droneGridElement,this.grid.getTileSize());
            break;
        }
    }
}

MainScreen.prototype.onGridClicked = function(data)
{
    this.droneGridElement = data.data.target;
    trace("MainScreen.prototype.onGridClicked " + this.droneGridElement.Row + " " + this.droneGridElement.Col);
    var newPosition = new Point();
    newPosition.x = (this.droneGridElement.position.x + this.grid.position.x-10)*this.grid.scale.x;
    newPosition.y = (this.droneGridElement.position.y + this.grid.position.y+10)*this.grid.scale.y;
    this.drone.flyTo(newPosition);

    this.prizes = [];
    this.prizeTexts = [];

    // Mark all fire points true (OK to fire)
    this.firePoints = [];
    for(var i=0; i<10; i++)
    {
        var arr = [];
        for(var j=0; j<10; j++)
        {
            arr.push(true);
        }
        this.firePoints.push(arr);
    }
}