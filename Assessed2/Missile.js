// orign parama new Point(targetPoint.Origin.x,targetPoint.Origin.y),targetPoint.Point);
function Missile(target)
{
    PIXI.Container.call(this);

    this.origin = new Point(parseFloat(target.Origin.x.toFixed(2)), parseFloat(target.Origin.y.toFixed(2)));
    this.target = new Point(parseFloat(target.Point.x.toFixed(2)), parseFloat(target.Point.y.toFixed(2)));

    this.missileSprite = new PIXI.Sprite(PIXI.utils.TextureCache["img/rocket.png"]);
    this.missileSprite.position = this.origin;
    this.missileSprite.scale.x = this.missileSprite.scale.y = 2;
    this.addChild(this.missileSprite);

    this.direction = target.Heading;

    switch(this.direction)
    {
        case Drone.E:
        this.missileSprite.rotation -= Math.PI * 4 * 0.25;
        break;
        case Drone.N:
        this.missileSprite.rotation += Math.PI * 2 * 0.25;
        break;
        case Drone.S:
        this.missileSprite.rotation -= Math.PI * 2 * 0.25;
        break;
    }


    this.addExplosion = this.addExplosion.bind(this);
    this.showWin = this.showWin.bind(this);
    this.animate = this.animate.bind(this);
    this.missileFly = this.missileFly.bind(this);
    this.scaleMissileDown = this.scaleMissileDown.bind(this);

    this.state = Missile.FIRING;
    globalTicker.add(this.animate);
};
Missile.prototype = Object.create(PIXI.Container.prototype);
Missile.prototype.constructor = Missile;
Missile.prototype.origin;
Missile.prototype.target;
Missile.prototype.missileSprite;
Missile.prototype.direction;
Missile.prototype.state;
Missile.IDLE = 0;
Missile.FIRING = 1;
Missile.STRIKE = 2;
Missile.EXPLODING = 3;
Missile.prototype.scaleDown = 0.97;

// Todo easing/smoothing
Missile.prototype.animate = function(data)
{
    switch(this.state)
    {
        case Missile.FIRING:
            this.missileFly();
            break;

        case Missile.STRIKE:
            //this.state = Missile.IDLE;
            this.removeChild(this.missileSprite);
            this.addExplosion();
            this.state = Missile.EXPLODING;
            break;

        case Missile.IDLE:
            Events.Dispatcher.dispatchEvent(new Event(Event.MISSILE_COMPLETE,this));
            globalTicker.remove(this.animate);
            break;
    }
}

Missile.prototype.addExplosion = function(){
    console.log("Explosion");

    var explosionTextures = [];

    for (var i=0; i < 26; i++)
    {
        var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
        explosionTextures.push(texture);
    };

    var explosion = new PIXI.extras.MovieClip(explosionTextures);

    explosion.position = this.target;
    explosion.anchor.x = explosion.anchor.y = 0.5;
    explosion.rotation = Math.random() * Math.PI;

    explosion.animationSpeed = .8;
    explosion.interactive = true;
    explosion.id = 1;
    explosion.loop = false;

    var that = this;
    explosion.onComplete = function(){
        that.showWin(explosion.position);
        that.removeChild(explosion);
    }

    this.addChild(explosion);
    explosion.gotoAndPlay(0);
};


Missile.prototype.showWin = function()
{
    this.state = Missile.IDLE;
    Events.Dispatcher.dispatchEvent(new Event(Event.MISSILE_COMPLETE, this.target));
}

Missile.prototype.scaleMissileDown = function()
{
    this.missileSprite.scale.x *= this.scaleDown;
    this.missileSprite.scale.y *= this.scaleDown;
}

Missile.prototype.missileFly = function()
{
    switch(this.direction)
    {
        case Drone.N:
            if(this.missileSprite.y > this.target.y)
            {
                var newY = parseFloat(this.missileSprite.position.y) - 3;
                this.missileSprite.position.y = newY;
                this.scaleMissileDown();
            }
            else
            {
                this.state = Missile.STRIKE;
            }
            break;

        case Drone.S:
            if(this.missileSprite.y < this.target.y)
            {
                var newY = parseFloat(this.missileSprite.position.y) + 3;
                this.missileSprite.position.y = newY;
                this.scaleMissileDown();
            }
            else
            {
                this.state = Missile.STRIKE;
            }
            break;

        case Drone.E:
            if(this.missileSprite.x < this.target.x)
            {
                var newX = parseFloat(this.missileSprite.position.x) + 3;
                this.missileSprite.position.x = newX;
                this.scaleMissileDown();
            }
            else
            {
                this.state = Missile.STRIKE;
            }
            break;

        case Drone.W:
            if(this.missileSprite.x > this.target.x)
            {
                var newX = parseFloat(this.missileSprite.position.x) - 3;
                this.missileSprite.position.x = newX;
                this.scaleMissileDown();
            }
            else
            {
                this.state = Missile.STRIKE;
            }
            break;
    }
}