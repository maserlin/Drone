function Event(type, data){
	this.type = type; // String name
	this.data = data; // wahtevs
}

Event.prototype.type = null;
Event.prototype.data = null;
Event.prototype.stopPropagation = false;
Event.prototype.target = null;
	
Event.PROFILE_LOADED = "PROFILE_LOADED";
Event.ASSETS_LOADED = "ASSETS_LOADED";
Event.RESIZED = "RESIZED";

Event.LAUNCH_BUTTON_CLICKED = "LAUNCH_BUTTON_CLICKED";
Event.MISSILE_COMPLETE = "MISSILE_COMPLETE";
Event.DRONE_UP = "DRONE_UP";
Event.DRONE_DOWN = "DRONE_DOWN";
Event.DRONE_LEFT = "DRONE_LEFT";
Event.DRONE_RIGHT = "DRONE_RIGHT";
Event.DRONE_MOVE = "DRONE_MOVE";
Event.GRID_CLICKED = "GRID_CLICKED";
Event.DRONE_CLICKED = "DRONE_CLICKED";
Event.SHOW_PRIZE_SPLASH = "SHOW_PRIZE_SPLASH";
Event.SPLASH_SHOWING = "SPLASH_SHOWING";
Event.SPLASH_DISMISSED = "SPLASH_DISMISSED";

// todo
Event.BALANCE_UPDATE_REQUEST = "BALANCE_UPDATE_REQUEST";
Event.INIT = "INIT";
Event.BONUS_COMPLETE = "BONUS_COMPLETE";
Event.GAME_COMPLETE = "GAME_COMPLETE";
Event.INVALID_RESPONSE_RECEIVED = "INVALID_RESPONSE_RECEIVED";
Event.VALID_BONUS_RESPONSE_RECEIVED = "VALID_BONUS_RESPONSE_RECEIVED";
Event.INVALID_BONUS_RESPONSE_RECEIVED = "INVALID_BONUS_RESPONSE_RECEIVED";
Event.VALID_RESPONSE_RECEIVED = "VALID_RESPONSE_RECEIVED";
Event.DISABLE_SOUND_BUTTON = "DISABLE_SOUND_BUTTON";
Event.SOUND_COMPLETE = "SOUND_COMPLETE";
Event.SOUND_ASSETS_LOADED - "SOUND_ASSETS_LOADED";