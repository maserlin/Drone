/**
 * A graphical button to handle keypress:
 *
 * It has multiple function though:
 * First press: Send a bet (and spin the reels!)
 * Second press: set reels to quick-stop (turbo mode) as soon as a result is available.
 * Next press: Cancel win animations and skip to next action ie start freespins or bonus if flagged.
 *
 * LaunchButton button functionality can get fairly complex so make sure you're well in control of its state.
 *
 * Base class is a standard button implementation with 4 states:
 * up, down, off, on (highlit)
 *
 * @param imageName
 * @param posX
 * @param posY
 * @param name
 * @constructor
 */
function LaunchButton(imageName,posX,posY,name) {
    this.state = this.IDLE;
    Button.call(this, imageName,posX,posY,name);
    this.onClick = this.onClick.bind(this);
};
LaunchButton.prototype = Object.create(Button.prototype);
LaunchButton.constructor = LaunchButton;



/**
 * TODO Clicks may fire twice on certain android devices
 * but only once on iPad or desktop or other Androids.
 * May be to do with this function being run onTap AND onClick
 * @see Button.js constructor
 */
LaunchButton.prototype.onClick = function(data){

    Button.prototype.onClick.call(this);

    trace("LaunchButton");
    Events.Dispatcher.dispatchEvent(new Event(Event.LAUNCH_BUTTON_CLICKED, this));

    // todo
    //SoundPlayer.getInstance().play(Sounds.CLICK);
}



