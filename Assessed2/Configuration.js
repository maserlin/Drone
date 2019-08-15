/**
 * Base configuration file for all games. Singleton!
 */

var config = null;

function Configuration(){

}

/**
 * simple singleton: feel free to improve on this implementation :)
 */
Configuration.getInstance = function(){
    if(config == null)config = new Configuration();
    return config;
}
Configuration.prototype.profileXmlDoc = null;
Configuration.prototype.serverUrl = null;
Configuration.prototype.stakes = null;
Configuration.prototype.prizes = null;

Configuration.prototype.allow = function(){
    console.log("ALLOW");
}


Configuration.prototype.getNumberOfWinlines = function(){
    return this.winlines.length;
}

/**
 * Set whatever we need to from profile xml 
 */
Configuration.prototype.setConfig = function(xmlString)
{
    this.profileXmlDoc = createDoc( xmlString );
    this.setStakes( this.profileXmlDoc.getElementsByTagName("Stakes") );
    this.setPrizes(this.profileXmlDoc.getElementsByTagName("Prizes"));
}

/**
 * Store the stakes to use
 */
Configuration.prototype.setStakes = function(xml){
    trace(xml);
    this.stakes = [];
    var stakes = xml[0].attributes.getNamedItem("value").nodeValue.split(",");
    for(var s=0; s<stakes.length; ++s){
        this.stakes.push(Number(stakes[s]));
    }
}

/**
 * Flattened prize array: pick one using rng
 */
Configuration.prototype.setPrizes = function(xml){
    this.prizes = [];
    var weights = xml[0].attributes.getNamedItem("weight").nodeValue.split(",");
    var multipliers = xml[0].attributes.getNamedItem("multiplier").nodeValue.split(",");

    for(var i=0; i<multipliers.length; i++)
    {
        for(var j=0; j<parseInt(weights[i],10); j++)
        {
            this.prizes.push(parseInt(multipliers[i]));
        }
    }
}

