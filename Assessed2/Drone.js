function Drone(position){
    PIXI.Container.call(this);

    this.home = new Point(-500,310);
    this.directions = [Drone.S,Drone.W,Drone.N,Drone.E];
    this.direction = 0;

    var border = new PIXI.Sprite(PIXI.utils.TextureCache["img/border.png"]);
    border.anchor.x = border.anchor.y = 0.5;
    border.position = this.home;
    // Larger scaling than in RocketBay becuase whole Bay is scaled
    border.scale.x = 3;
    border.scale.y = 2;
    this.addChild(border);

    this.droneSprite = new PIXI.Sprite(PIXI.utils.TextureCache["img/drone1.png"]);
    this.addChild(this.droneSprite);
    this.droneSprite.anchor.x = this.droneSprite.anchor.y = 0.5;
    this.droneSprite.rotation = 0.0;
    this.droneSprite.position = this.home;

    var that = this;
    this.droneSprite.interactive = true;
    this.droneSprite.click = this.droneSprite.tap = function(data){
        that.onClick(data);
    }

    this.acquireTarget = this.acquireTarget.bind(this);
    this.flyTo = this.flyTo.bind(this);
    this.flyForwards = this.flyForwards.bind(this);
    this.flyBackwards = this.flyBackwards.bind(this);
    this.animate = this.animate.bind(this);
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.turn = this.turn.bind(this);
};
Drone.prototype = Object.create(PIXI.Container.prototype);
Drone.prototype.constructor = Drone;
Drone.prototype.droneSprite = null;
Drone.prototype.home;
Drone.prototype.docked = true;
Drone.N = "North";
Drone.S = "South";
Drone.E = "East";
Drone.W = "West";
Drone.DOCKED = 0;
Drone.MOVING = 1;
Drone.HOVERING = 2;
Drone.RTB = 3;
Drone.prototype.state = Drone.DOCKED;
Drone.prototype.directions = null;
Drone.prototype.direction = 0;
Drone.prototype.startTime = null;
Drone.prototype.duration = 4;
Drone.prototype.gridSize = 0.4; // affects bounce height
Drone.prototype.elapsedTime = 0;
Drone.prototype.stretchFactor = 1; // make elliptical if >1
Drone.prototype.ellipseWidth = 300;
Drone.prototype.ellipseHeight = 2;
Drone.prototype.speed = 20;
Drone.prototype.targetPosition = null;
Drone.prototype.moveX = 0;
Drone.prototype.moveY = 0;
Drone.prototype.homeSpeed = 5;

Drone.prototype.onClick = function(data)
{
    trace("drone clicked");
    Events.Dispatcher.dispatchEvent(new Event(Event.DRONE_CLICKED, this));
}


Drone.prototype.acquireTarget = function(gridCoords, tileSize)
{
    var target = null;

    switch(this.directions[this.direction])
    {
        case Drone.N:
        if(gridCoords.Row > 1){
            target = {};
            target.Point = new Point(this.droneSprite.x, this.droneSprite.y - ((parseInt(tileSize.y) * 2)));
            target.Row = gridCoords.Row-2;
            target.Col = gridCoords.Col;
            target.Origin = new Point(this.droneSprite.x+10, this.droneSprite.y-50);//ok
            target.Heading = Drone.N;
        }
        break;
        case Drone.S:
        if(gridCoords.Row < 8){
            target = {};
            target.Point = new Point(this.droneSprite.x, this.droneSprite.y + (parseInt(tileSize.y) * 2));
            target.Row = gridCoords.Row+2;
            target.Col = gridCoords.Col;
            target.Origin = new Point(this.droneSprite.x-10, this.droneSprite.y+50);
            target.Heading = Drone.S;
        }
        break;
        case Drone.E:
        if(gridCoords.Col < 8){
            target = {};
            target.Point = new Point(this.droneSprite.x + (parseInt(tileSize.x) * 2), this.droneSprite.y);
            target.Row = gridCoords.Row;
            target.Col = gridCoords.Col+2;
            target.Origin = new Point(this.droneSprite.x+50, this.droneSprite.y+10);//ok
            target.Heading = Drone.E;
        }
        break;
        case Drone.W:
        if(gridCoords.Col > 0){
            target = {};
            target.Point = new Point(this.droneSprite.x - (parseInt(tileSize.x) * 2), this.droneSprite.y);
            target.Row = gridCoords.Row;
            target.Col = gridCoords.Col-2;
            target.Origin = new Point(this.droneSprite.x-50, this.droneSprite.y-10);
            target.Heading = Drone.W;
        }
        break;
    }

    return target;
}


// todo easing
Drone.prototype.flyForwards = function(gridCoords, tileSize)
{
    switch(this.directions[this.direction])
    {
        case Drone.N:
        if(gridCoords.Row > 0){
            this.droneSprite.y -= parseFloat(tileSize.y);
            gridCoords.Row--;
            gridCoords.position.y -= parseFloat(tileSize.y);
        }
        break;
        case Drone.S:
        if(gridCoords.Row < 9){
            this.droneSprite.y += parseFloat(tileSize.y);
            gridCoords.Row++;
            gridCoords.position.y += parseFloat(tileSize.y);
        }
        break;
        case Drone.E:
        if(gridCoords.Col < 9){
            this.droneSprite.x += parseFloat(tileSize.x);
            gridCoords.Col++;
            gridCoords.position.x += parseFloat(tileSize.x);
        }
        break;
        case Drone.W:
        if(gridCoords.Col > 0){
            this.droneSprite.x -= parseFloat(tileSize.x);
            gridCoords.Col--;
            gridCoords.position.x -= parseFloat(tileSize.x);
        }
        break;
    }
    return gridCoords;
}

// todo easing & refactor these 2 methods
Drone.prototype.flyBackwards = function(gridCoords, tileSize)
{
    switch(this.directions[this.direction])
    {
        case Drone.S:
        if(gridCoords.Row > 0){
            this.droneSprite.y -= parseFloat(tileSize.y);
            gridCoords.Row--;
            gridCoords.position.y -= parseFloat(tileSize.y);
        }
        break;
        case Drone.N:
        if(gridCoords.Row < 9){
            this.droneSprite.y += parseFloat(tileSize.y);
            gridCoords.Row++;
            gridCoords.position.y += parseFloat(tileSize.y);
        }
        break;
        case Drone.W:
        if(gridCoords.Col < 9){
            this.droneSprite.x += parseFloat(tileSize.x);
            gridCoords.Col++;
            gridCoords.position.x += parseFloat(tileSize.x);
        }
        break;
        case Drone.E:
        if(gridCoords.Col > 0){
            this.droneSprite.x -= parseFloat(tileSize.x);
            gridCoords.Col--;
            gridCoords.position.x -= parseFloat(tileSize.x);
        }
        break;
    }
    return gridCoords;
}




// Todo easing
Drone.prototype.turn = function(cmd)
{
    if(this.state == Drone.HOVERING)
    {
        switch(cmd)
        {
            case "left":
                this.droneSprite.rotation += Math.PI * 2 * 0.25;
                this.direction = this.direction+1 < this.directions.length ? this.direction+1 : 0;
                break;
            case "right":
                this.droneSprite.rotation -= Math.PI * 2 * 0.25;
                this.direction = this.direction-1 >= 0 ? this.direction-1 : this.directions.length-1;
                break;
        }
    }

}


Drone.prototype.start = function(){
    globalTicker.add(this.animate);
};

Drone.prototype.stop = function(){
    this.droneSprite.position = this.home;
    this.state = Drone.DOCKED;
    this.docked = true;
    this.droneSprite.rotation = 0.0;
    globalTicker.remove(this.animate);
};

Drone.prototype.animate = function(data)
{
    switch(this.state)
    {
        // TODO easing on this movement
        case Drone.MOVING:

            break;

        case Drone.HOVERING:
            this.elapsedTime += data;

            if(this.startTime === null) {
              this.startTime = this.elapsedTime;
              this.path = [];
            }

            var progress = (this.elapsedTime - this.startTime) / this.duration / this.speed;

            var x = this.stretchFactor * Math.sin(progress * 2 * Math.PI);
            var y = (Math.cos(progress * 2 * Math.PI));

            // Just "float" using the Y
            this.droneSprite.x = /*this.ellipseWidth / 2 + (this.gridSize * -x) +*/ this.targetPosition.x;
            this.droneSprite.y = /*this.ellipseHeight / 2*/ + (this.gridSize * -y) + this.targetPosition.y;


            //this.path.push(new Point(this.circle.position.x,this.circle.position.y));

            if(progress >= 1){
              this.startTime = null; // reset to this.startTime time
            }
            break;

        // Todo easing
        case Drone.RTB:
            if(this.droneSprite.position.x > this.home.x)
            {
                this.droneSprite.position = new Point(this.droneSprite.position.x-this.homeSpeed, this.droneSprite.y);
                this.droneSprite.rotation += Math.PI * 2 * 0.01;
            }
            else
            {
                if(this.droneSprite.position.y >= this.home.y)
                {
                    this.stop();
                }
            }
            if(this.droneSprite.position.y < this.home.y)
            {
                this.droneSprite.position = new Point(this.droneSprite.position.x, this.droneSprite.y+this.homeSpeed);
            }
            else
            {
                if(this.droneSprite.position.x <= this.home.x)
                {
                    this.stop();
                }
            }
            break;
    }
}

Drone.prototype.returnToBase = function()
{
    this.state = Drone.RTB;
}

// TODO path animation and or animated easing to target location - easeinout?
// TODO once "flying" add sin/cos float animation
// TODO propellors
Drone.prototype.flyTo = function(screenPosition)
{
    if(this.docked)
    {
       this.state = Drone.HOVERING;
       this.docked = false;
       this.direction = 0;
       this.start();
    }

   // Always place todo easing
   this.targetPosition = new Point(screenPosition.x+(this.droneSprite.texture.width/2), screenPosition.y+(this.droneSprite.texture.height/2));

   this.droneSprite.position = this.targetPosition;
}

