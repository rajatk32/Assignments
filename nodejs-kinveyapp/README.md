# Description

You have been tasked by Acme eCommerce to create a REST API for viewing a product catalog, as well as for submitting orders and viewing order status.  The data can be stored  on a local data store of your choice.  When an order is placed, as well as writing to the local data store, an 'order fulfillment request' must be sent to a Redis server, so that it can be processed by our fulfillment system.    

Create a node.js service that monitors for the fulfillment events in redis. You can use any redis functionality to assist in monitoring for the event.  Once the event is triggered and the data retrieved from redis, post the results to a Kinvey datastore via the Kinvey REST API (you can sign up for a free account at https://console.kinvey.com/ and view basic documentation at http://devcenter.kinvey.com/rest/guides/getting-started and http://devcenter.kinvey.com/rest/guides/datastore).  For authentication, use masteresecret credentials for simplicity (http://devcenter.kinvey.com/rest/guides/security#credentials).  

You are free to use any frameworks and libraries you want, but please be prepared to reason about your choices.  You are also free to go beyond the scope of this assignment and add additional functionality of your own choosing.  

This is meant to be first iteration quality.  It is not expected that you write a production-hardened app, but you should include a list of items that you would work on to make it production-ready.  Special attention, however, should be paid to API design.

Some things to consider: 
* Handling errors/failure scenarios
* Testing Strategy
* Performance implications for a high volume of requests
* How to make the app fault-tolerant