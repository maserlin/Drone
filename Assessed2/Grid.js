function Grid(bgBounds)
{
    PIXI.Container.call(this);

    // Learning more about positioning here!
    this.scale.x = this.scale.y = 1.06;
    this.position = new Point(bgBounds.x-126,bgBounds.y-126);

    this.grid = [];

    for(var row=0; row<10; row++)
    {
        var newrow = [];
        for(var col=0; col<10; col++)
        {
            var tile = new PIXI.Sprite(PIXI.utils.TextureCache["img/gridtile.png"]);
            tile.alpha = 1;
            //tile.anchor = new Point(0.5,0.5);
            tile.position.x = col*72;
            tile.position.y = row * 72;
            tile.interactive = true;
            tile.Row = row;
            tile.Col = col;
            tile.alpha = 0.01;
            var that = this;
                tile.click = tile.tap = function(data){
                    that.onClick(data);
                }
            this.addChild(tile);
            newrow.push(tile);
        }
        this.grid.push(newrow);
    }
    this.getTileSize = this.getTileSize.bind(this);
};
Grid.prototype = Object.create(PIXI.Container.prototype);
Grid.prototype.constructor = Grid;
Grid.prototype.grid = null;

Grid.prototype.getTileSize = function()
{
    return new Point((this.grid[0][0].width*this.scale.x).toFixed(2),(this.grid[0][0].height*this.scale.y).toFixed(2));
}

Grid.prototype.onClick = function(data){
    console.log("Click target " + data.target.Row + " " + data.target.Col);
    Events.Dispatcher.dispatchEvent(new Event(Event.GRID_CLICKED, data));
}