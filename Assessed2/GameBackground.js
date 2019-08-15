function GameBackground(){
    PIXI.Container.call(this);

    this.backgrounds = [];

    // Initial positioning
    var size = getWindowBounds();

    // Width, height from the sprite texture (sprite has no dimensions until rendered)
    var tileTexture = PIXI.utils.TextureCache["img/roadsmall.png"];
    var width = tileTexture.baseTexture.width;
    var height = tileTexture.baseTexture.height;

    // Basic texture info: x,y from sprite
    var roadTile = new PIXI.Sprite(tileTexture);


    // Declare 9 "tiles"
    for(var i=0; i<9; i++){
        this.backgrounds.push(new PIXI.Sprite(tileTexture));
        this.backgrounds[i].anchor = new Point(0.5, 0.5);
        this.addChild(this.backgrounds[i]);
}

    // -- Positioning

    this.backgrounds[0].position.x = roadTile.position.x - width;
    this.backgrounds[0].position.y = roadTile.position.y - height;

    this.backgrounds[1].position.x = roadTile.position.x;
    this.backgrounds[1].position.y = roadTile.position.y - height;

    this.backgrounds[2].position.x = roadTile.position.x + width;
    this.backgrounds[2].position.y = roadTile.position.y - height;

    this.backgrounds[3].position.x = roadTile.position.x - width;
    this.backgrounds[3].position.y = roadTile.position.y;

    // No movement required
//    this.backgrounds[4].position.x = roadTile.position.x;
//    this.backgrounds[4].position.y = roadTile.position.y;

    this.backgrounds[5].position.x = roadTile.position.x + width;
    this.backgrounds[5].position.y = roadTile.position.y;

    this.backgrounds[6] .position.x = roadTile.position.x - width;
    this.backgrounds[6] .position.y = roadTile.position.y + height;

    this.backgrounds[7] .position.x = roadTile.position.x;
    this.backgrounds[7] .position.y = roadTile.position.y + height;

    this.backgrounds[8] .position.x = roadTile.position.x + width;
    this.backgrounds[8] .position.y = roadTile.position.y + height;


    // Define bounds
    this.getBounds = this.getBounds.bind(this);
    this.bounds = new Rectangle(this.backgrounds[0].position.x,
                                this.backgrounds[0].position.y,
                                width*3,
                                height*3);



    this.change = this.change.bind(this);
    this.swap = this.swap.bind(this);

}
GameBackground.prototype = Object.create(PIXI.Container.prototype);
GameBackground.prototype.constructor = GameBackground;
GameBackground.prototype.backgrounds = null;



/*
 * TODO swap backgrounds
*/
GameBackground.prototype.change = function(from, to){
    this.from = from;
    this.to = to;
    this.backgrounds[this.to].alpha  = 0;
    this.addChild(this.backgrounds[this.to]);
    globalTicker.add(this.swap);
}

/*
 * TODO swap backgrounds
*/
GameBackground.prototype.swap = function(){
    this.backgrounds[this.from].alpha -= 0.025;
    this.backgrounds[this.to].alpha += 0.025;
    
    if(this.backgrounds[this.to].alpha >= 1){
        this.backgrounds[this.from].alpha = 0;
        this.backgrounds[this.to].alpha = 1;
        this.removeChild(this.backgrounds[this.from]);
        globalTicker.remove(this.swap);
    }
}

GameBackground.prototype.getBounds = function(){
    return this.bounds;
}
