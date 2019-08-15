function NavButton(imageName,posX,posY,name) {
    this.state = this.IDLE;
    this.action = name;
    Button.call(this, imageName,posX,posY,name);
    this.onClick = this.onClick.bind(this);
};
NavButton.prototype = Object.create(Button.prototype);
NavButton.constructor = NavButton;
NavButton.prototype.action = null;


NavButton.prototype.onClick = function(data){
    Button.prototype.onClick.call(this);
    trace("NavButton " + this.action);
            Events.Dispatcher.dispatchEvent(new Event(Event.DRONE_MOVE, this));
    switch(this.action)
    {
        case "up":
            Events.Dispatcher.dispatchEvent(new Event(Event.DRONE_UP, this));
        break;
        case "down":
            Events.Dispatcher.dispatchEvent(new Event(Event.DRONE_DOWN, this));
        break;
        case "left":
            Events.Dispatcher.dispatchEvent(new Event(Event.DRONE_LEFT, this));
        break;
        case "right":
            Events.Dispatcher.dispatchEvent(new Event(Event.DRONE_RIGHT, this));
        break;
    }
}