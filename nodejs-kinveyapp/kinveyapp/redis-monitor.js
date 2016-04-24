// Redis variables:
var redis = require("redis");                                       // require redis to publish fulfillment events
var redisHost = "localhost";                                        // host at which redis is running
var redisPort = 6379;                                               // port at which redis is running
var channelName = "fulfillment";                                    // channel at which fulfillment events should be sent

// kinvey variables:
// Import the Kinvey module.
var Kinvey = require('kinvey');
var promise = Kinvey.init({
    appKey: '',                                       // enter your app key here
    masterSecret: ''               // enter your master secret here
});
var collectionName = "orders";                                      // collection in which order information will be stored after fetching from redis

// Ping Kinvey after initialization completes.
promise.then(function () {
    return Kinvey.ping();
}).then(function (response) {                                        // if we are able to connect to Kinvey successfully
    var sub = redis.createClient(redisPort, redisHost);             // create a subscriber client to redis

    sub.on("subscribe", function (channel) {                         // on subscribing to channel
        console.log("Subscribed to " + channel + " channel.");
    });

    sub.on("message", function (channel, message) {                  // when a message is published on this channel
        console.log("\nMessage from channel " + channel + "\n" + message);

        var savepromise = Kinvey.DataStore.save(collectionName, {   // prepare a save promise to store received order from redis in kinvey datastore
            order: message
        });

        savepromise.then(function (entity) {                         // if order is successfully saved in kinvey datastore
            console.log("\nOrder saved successfully as: \n", entity);
        }, function (error) {                                        // else if there was an error saving
            console.log("Error saving order : " + error);
        });
    });

    sub.subscribe(channelName);                                     // subscribe to fulfillment channel
}, function (error) {                                                // if kinvey ping failed
    console.log('Failed to connect to Kinvey: ' + error);
});