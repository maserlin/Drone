function RocketBay(position) {
    PIXI.Container.call(this);
    this.rockets = [];
    this.position.x = position.x;
    this.position.y = position.y;

    var b = new PIXI.Sprite(PIXI.utils.TextureCache["img/border.png"]);
    b.position.x -= 7;
    b.position.y = this.position.y-7;
    b.scale.x = b.scale.y = 1.2;

    this.addChild(b);

    var r = new PIXI.Sprite(PIXI.utils.TextureCache["img/rocket.png"]);
    r.position.y = this.position.y;
    this.rockets.push(r);
    this.addChild(r);

    r = new PIXI.Sprite(PIXI.utils.TextureCache["img/rocket.png"]);
    r.position.y = this.position.y+14;
    this.rockets.push(r);
    this.addChild(r);

    r = new PIXI.Sprite(PIXI.utils.TextureCache["img/rocket.png"]);
    r.position.y = this.position.y+28;
    this.rockets.push(r);
    this.addChild(r);

    r = new PIXI.Sprite(PIXI.utils.TextureCache["img/rocket.png"]);
    r.position.y = this.position.y+42;
    this.rockets.push(r);
    this.addChild(r);

    r = new PIXI.Sprite(PIXI.utils.TextureCache["img/rocket.png"]);
    r.position.y = this.position.y+56;
    this.rockets.push(r);
    this.addChild(r);

    this.scale.x *= 2;
    this.scale.y *= 1.6;
//    this.pivot.x = this.width/2;
//    this.pivot.y = this.height/2;
    trace("Show rockets");


    this.hideRocket = this.hideRocket.bind(this);
    this.showRockets = this.showRockets.bind(this);
    this.hasRockets = this.hasRockets.bind(this);
    this.rocketToHide = 4;
};
RocketBay.prototype = Object.create(PIXI.Container.prototype);
RocketBay.prototype.constructor = RocketBay;
RocketBay.prototype.rockets = null;
RocketBay.prototype.rocketToHide = 4;

RocketBay.prototype.hasRockets = function()
{
    return this.rocketToHide >= 0;
}


RocketBay.prototype.hideRocket = function()
{
    this.removeChild(this.rockets[this.rocketToHide]);
    this.rocketToHide--;
}

RocketBay.prototype.showRockets = function()
{
    for(rocket in this.rockets)
    {
        this.addChild(this.rockets[rocket]);
    }
    this.rocketToHide = 4;
}