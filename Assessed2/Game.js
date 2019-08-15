/**
 * GAME manages all onscreen components individually or in groups.
 * Onscreen components are all derived from PIXI.Container so they can be put on the stage
 * and removed as necessary in their logical groups, and can resize as a group, be zoomed in and out
 * or cross-faded etc etc.
 * For larger projects it may be advisable to split this file up into GameManager and Game,
 * where GameManager performs all the housekeeping and can load any "Game" and run it transparently.
 * In this case the "Game" has the following responsibilities:
 * Build 3 layers to add to the stage: background, game, console. Interaction between these layers
 * is handled by Events.
 * Change the backgrounds and game screens (reels, bonus1, bonus2) as appropriate, by event request;
 * here we cross-fade the screens in and out, but this functionality could be added to GameScreen
 * to have them fade themselves if that is preferred.
 * Send Requests to the ServerProxy and field the Responses:
 * For the ReelsScreen we are handling the results and telling the reels when to start and stop:
 * again this can be changed to a more appropriate implementation if desired.
 * For the BonusScreen we aren't doing much, but also we act as the switchboard for request/response.
 * The value of this is that some servers require some book-keeping calls between the game and
 * the wrapper or server and we can handle that here without making the game code unnecessarily complex.
 */

function Game(){

    // Maintain a game background Object to handle aspects of scene changes and stage sizing
    this.gameBackground = null;

    /*
     * Receives results in a variety of formats (xml, json, name=value pairs)
     * and parses into one format appropriate for all games (usually JSON)
     * For server comms only
     this.dataParser = new DataParser();
     */

    /*
     * Sends requests to a server and fields the result. Uses dataParser to determine
     * validity and signals readiness of response with an Event.
    this.serverProxy = new ServerProxy(GameConfig.getInstance().serverUrl, this.dataParser);
    
    this.onInitResponseReceived = this.onInitResponseReceived.bind(this);
    this.onBetResponseReceived = this.onBetResponseReceived.bind(this);
    this.onInvalidBetResponseReceived = this.onInvalidBetResponseReceived.bind(this);
    this.onBonusResponseReceived = this.onBonusResponseReceived.bind(this);
     */

    // Display layer management
    this.layers = [];
    this.layers[Game.BACKGROUND] = new PIXI.Container();
    this.layers[Game.MAIN] = new PIXI.Container();
    this.layers[Game.CONSOLE] = new PIXI.Container();
    this.layers[Game.SPLASH] = new PIXI.Container();
}
Game.BACKGROUND = "background";
Game.MAIN = "main";
Game.CONSOLE = "console";
Game.SPLASH= "splash";
Game.prototype.layers = null;
Game.prototype.mainScreen = null;
Game.prototype.currentScreen = null;
Game.prototype.validResponseReceived = false;
Game.prototype.invalidResponseReceived = false;
Game.prototype.scaleDown = 1;

/**
 * Build everything.
 * We are maintaining three distinct layers:  
 * Game.BACKGROUND:
 *      contains a container with any number of swappable backgrounds in the control of GameBackground.js
 *      driven from here depending on game results, by event management
 * 
 * Game.MAIN:
 *      This layer contains one of ReelsScreen, BonusScreen, Bonus2Screen etc: we manage which is showing
 *      based on game result combined with events sent by the current occupier of the layer. 
 * 
 * Game.CONSOLE:
 *      TODO this will house the UI components.
 */
Game.prototype.onAssetsLoaded = function(obj){

    // Check exists
    Configuration.getInstance().allow();
    
    // These layers remain undisturbed: 
    // We can add and remove children from them as the game plays out.

    // Main bg is css whole page (clouds)
    // Game bg is the road texture
    stage.addChild(this.layers[Game.BACKGROUND]);
    // MAIN layer is for the playable elements (drone, rocket anims, prize display, splash screens etc)
    stage.addChild(this.layers[Game.MAIN]);
    // For all UI components; up, down, etc
    stage.addChild(this.layers[Game.CONSOLE]);
    // splash
    stage.addChild(this.layers[Game.SPLASH]);

    // Create a background manager with a couple of images to play with.
    // Change road.jpg to road.png and wtf :)
    this.gameBackground = new GameBackground();
    // gameBackground should be able to do its own cross-fades etc because it *is*
    // a PIXI.Container: we can manage it as a single item. 
    this.layers[Game.BACKGROUND].addChild(this.gameBackground);

    // UI controls:
    // Launch button, move up/down etc
    this.console = new Console(this.gameBackground.getBounds());
    this.layers[Game.CONSOLE].addChild(this.console);

    // manages or messages all game components
    this.mainScreen = new MainScreen(this.gameBackground.getBounds(), this.console.getAlignment());
    // Right now we want to show the MainScreen so bind the method
    this.loadScreen = this.loadScreen.bind(this);
    // Loads the screen into view (addChild) and sets as currentScreen.
    this.loadScreen(this.mainScreen);



    //
    this.onShowPrizeSplash = this.onShowPrizeSplash.bind(this);
    this.onSplashDismissed = this.onSplashDismissed.bind(this);
    Events.Dispatcher.addEventListener(Event.SHOW_PRIZE_SPLASH, this.onShowPrizeSplash);

    var screen = new IntroSplash();
    this.layers[Game.SPLASH].addChild(screen);
    Events.Dispatcher.addEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);


    //
    this.fadeOut = this.fadeOut.bind(this);
    this.fadeIn = this.fadeIn.bind(this);

    // Set resizing
    this.resize = this.resize.bind(this);
    Events.Dispatcher.addEventListener(Event.RESIZED, this.resize);
};
Game.prototype.prizeSplash=null;



Game.prototype.onShowPrizeSplash = function(prizes)
{
    this.prizeSplash = new OutroSplash(prizes);
    this.layers[Game.SPLASH].addChild(this.prizeSplash);
    Events.Dispatcher.addEventListener(Event.SPLASH_DISMISSED, this.onSplashDismissed);
}

Game.prototype.onSplashDismissed = function(data)
{
    this.layers[Game.SPLASH].removeChild(data);
}

Game.prototype.resize = function(event){
    var data = event.data;

    // Reposition to center
    for( var layer in this.layers)
    {
        this.layers[layer].position.x = data.size.x/2;
        this.layers[layer].position.y = data.size.y/2;

        // Scale both by X to maintain aspect ratio
        this.layers[layer].scale.x = data.scale.x * this.scaleDown;
        this.layers[layer].scale.y = data.scale.x * this.scaleDown;
    }
}

/**
 * 
 */
Game.prototype.loadScreen = function(screen){
    this.layers[Game.MAIN].addChild(screen);
    this.currentScreen = screen;    
}

Game.prototype.fadeOut = function(){
    if(this.fadeScreen.alpha > 0.05){
        this.fadeScreen.alpha -= 0.05;
    }
    else {
        globalTicker.remove(this.fadeOut);
        this.fadeScreen.alpha = 0;
        this.onFadedOut();
    }
}

Game.prototype.fadeIn = function(screen){
    if(this.fadeScreen.alpha < 1){
        this.fadeScreen.alpha += 0.05;
    }
    else {
        globalTicker.remove(this.fadeIn);
        this.fadeScreen.alpha = 1;
        this.onFadedIn();
    }
}

/**
 * SPIN has been called by the player.
 * Alternatively we could listen for a BET_REQUEST, as we sometimes have to validate
 * the bet with the game wrapper or server before allowing the spin to continue:
 * here we simply send the bet in the expectation that an invalid bet
 * will be flagged by the server response value.
 */
Game.prototype.onFireMissile = function(event){
    trace("Missile fired");
    this.foitems = null;

    /**
     * TODO
     * this is an example bet only.
     */
    var req = Object.create(null);
    req.code = Event.BET;
    req.stake = this.console.getTotalBetInCents();
    req.winlines = this.console.getNumberOfWinlinesSelected();
    req.foitems = this.foitems;
    
    /*
     * Valid bet is OK to send: make Request and tell the reels they may spin.
     * Listen for a server response and do not stop the reels until
     * a) all reels are spinning and
     * b) response received.
     * This can all be re-wired and delegated to the ReelsScreen itself if required.
     */
    Events.Dispatcher.addEventListener(Event.VALID_RESPONSE_RECEIVED, this.onBetResponseReceived);
    Events.Dispatcher.addEventListener(Event.INVALID_RESPONSE_RECEIVED, this.onInvalidBetResponseReceived);
    Events.Dispatcher.addEventListener(Event.ALL_REELS_SPINNING,this.onReelsSpinning);
    this.validResponseReceived = false;
    this.invalidResponseReceived = false;
    this.reelsSpinning = false;

    this.serverProxy.makeRequest(req);
    this.reelsScreen.spinReels();

    this.console.hide();
};


/**
 * Don't STOP REELS unless they are all spinning AND result received.
 * THIS MODULE receives the results and acts accordingly:
 * This can change; delegate to reels screen if required!
 */
Game.prototype.onBetResponseReceived = function(event){
    Events.Dispatcher.removeEventListener(Event.VALID_RESPONSE_RECEIVED, this.onBetResponseReceived);
    Events.Dispatcher.removeEventListener(Event.INVALID_RESPONSE_RECEIVED, this.onInvalidBetResponseReceived);
    this.validResponseReceived = true;

    // TODO
}

/**
 * If the reels are all spinning it's safe to stop them.
 * This is the onError case.
 * @param event
 */
Game.prototype.onInvalidBetResponseReceived = function(event){
    Events.Dispatcher.removeEventListener(Event.VALID_RESPONSE_RECEIVED, this.onBetResponseReceived);
    Events.Dispatcher.removeEventListener(Event.INVALID_RESPONSE_RECEIVED, this.onInvalidBetResponseReceived);
    this.invalidResponseReceived = true;

    // TODO
}

/**
 * TODO
 * @param event
 */
Game.prototype.onInitResponseReceived = function(event){
    console.log("Init request received");
}


/**
 * No server? Or server error! Construct a fake result.
 * This may show some wins; what we are doing here is emulating a play-for-fun response.
 * Don't use this for real ... !!!
 * Do a fake safe-stop to bring the reels to halt not showing a win.
 * The game server (when it exists) should be sent a token indicating play-for-fun or
 * play-for-real so it can maintain the fake or real balance etc. The game need not know
 * which is in use.
 */
Game.prototype.onErrorResponse = function(){
    console.log("onErrorResponse TODO");
};



