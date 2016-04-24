INSTALLATION:
===============================
Prerequisites:
mongoDB v2.6.3: https://docs.mongodb.org/v2.6/tutorial/install-mongodb-on-ubuntu/
Redis v3.0.5: http://redis.io/download
nodeJS v0.12.0: http://ask.xmodulo.com/install-node-js-linux.html

OS: Linux ubuntu 64-bit

Once the above prerequisites have been met, go to the project's root directory 'kinveyapp' and run 'npm install' to install the required dependencies.

RUN INSTRUCTIONS:
===============================
1. Make sure that your mongodb and redis instances are running

2. Configure the database connections (hostname and port numbers) in files 'app.js' and 'redis-monitor.js'. The settings which may need to be changed are:
mongoose.connect('mongodb://localhost:27017/kinveydatastore');					(In app.js)
var redisHost = "localhost";																(In app.js, redis-monitor.js)
var redisPort = 6379;																		(In app.js, redis-monitor.js)

3. Configure your kinvey credentials in file 'redis-monitor.js'
appKey: ''                                       // enter your app key here
masterSecret: ''               	    // enter your master secret here

4. Run app.js using:
node app.js
On a successful run, a message "Server started on port 8080" will be displayed. This is the port no. of our api.

5. Run redis-monitor.js using
node redis-monitor.js
On a successful run, a message "Subscribed to fulfillment channel." will be displayed.

6. To use the API, you will need the hostname of the machine on which you started app.js and the port number as reported in Step 4. For e.g. assuming our hostname is 'localhost' and port is '8080', to issue a GET request for products we will use the URL:
http://localhost:8080/api/product

Note: It is recommended to add some sample products using the POST method for API URL http://localhost:8080/api/product before you begin to test the application thoroughly.

WHAT THE CODE DOES:
===============================
app.js
This file contains code for our product and order API. It tries to connect to a mongo database 'kinveydatastore' which is our local database and also creates a publishing client for redis. The file also contains mongodb collections model information. The products collection consists of a product name and price. The orders collection contains order status and product purchased. The product API allows GET request to retrieve all products in the catalog and POST request to add a new product one by one. The order API allows GET requests to retrieve either all orders or a specific order and also allows POST requests to submit an order. An order can be submitted by providing productIds of the products purchased separated by commas. These productIds are then used to fetch their product information in products collection so that it can be included in the order. Once an order is successfully placed, a fulfillment request is also published on a redis channel.

redis-monitor.js
This file runs as a service continuously to subscribe to events on a channel. We first try to connect to Kinvey using the credential provided by the user. If the connection to Kinvey is successful, we begin listening to events on redis' channel else we abort the program. Once a order fulfillment message is received on redis channel, the order information is stored in a kinvey datastore.