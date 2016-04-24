var express = require('express');                                   // require express
var app = express();                                                // define our app using express
var bodyParser = require('body-parser');                            // for parsing post parameters
var mongoose = require('mongoose');                                 // for connecting with mongodb
mongoose.connect('mongodb://localhost:27017/kinveydatastore');      // connect with mongodb on localhost:27017
var port = process.env.PORT || 8080;                                // set our app port

// Redis variables:
var redis = require("redis");                                       // require redis to publish fulfillment events
var redisHost = "localhost";                                        // host at which redis is running
var redisPort = 6379;                                               // port at which redis is running
var channelName = "fulfillment";                                    // channel at which fulfillment events should be sent
var pub = redis.createClient(redisPort, redisHost);                 // create a redis publish client

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// create product model

var productSchema = new mongoose.Schema({name: String, price: Number});
var Product = mongoose.model('Product', productSchema);

// create order model

var orderSchema = new mongoose.Schema({status: String, prodsPurchased: {}});
var Order = mongoose.model('Order', orderSchema);

var router = express.Router();                                      // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'Welcome to Kinvey api!'});
});

// product route for our API
router.route('/product/')
    .get(function (req, res) {                                      // GET product returns all products in mongodb collection
        Product.find(function (err, products) {
            if (err)
                res.send(err);
            res.json(products);
        });
    })
    .post(function (req, res) {                                     // POST product adds a new product in mongodb collection
        var prod = new Product();                                   // create a new instance of the Product model
        if (!req.body.name || !req.body.price) {                    // check that name and price of product both are specified as parameters in POST request
            res.status(400).send({error: 'Both name and price should be specified!'});
            return;
        }
        prod.name = req.body.name;
        prod.price = req.body.price;

        // save the product and check for errors
        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({message: 'Product created!'});
        });

    });

// order route for our API
router.route('/order/')
    .get(function (req, res) {                                      // GET order returns all orders in mongodb
        Order.find(function (err, orders) {
            if (err)
                res.send(err);
            res.json(orders);
        });
    })
    .post(function (req, res) {                                     // POST order creates a new order with status 'Received'
        var order = new Order();
        var status = "Received";                                    // assuming that the first time an order is placed, it's status is marked as Received
        order.status = status;
        if (!req.body.prodIds) {                                    // check that some products were actually purchased
            res.status(400).send({error: 'No products selected in order!'});
            return;
        }
        var productIds = req.body.prodIds.split(",");               // product IDs are comma delimited so split them in an array
        var products = null;
        Product.find({                                              // find product details of these product IDs in products collection
            '_id': {$in: productIds}
        }, 'name price', function (err, products) {
            if (err) {                                              // check for errors
                res.status(500).send({error: err});
                return;
            } else if (products == null) {                          // if no products with the given productIDs exist
                res.status(400).send({error: 'No such product(s) found!'});
                return;
            } else {                                                // otherwise we found the products
                order.prodsPurchased = products;                    // set prodsPurchased to the details of all products found
                order.save(function (err, order) {                  // save order information in orders collection in mongodb
                    if (err)
                        res.send(err);

                    res.json({message: 'Order successfully submitted!'});
                    pub.publish(channelName, JSON.stringify(order));        // publish order fulfillment request on redis channel
                });
            }
        });
    });

router.route('/order/:order_id')                                    // if an order ID is supplied along with order GET request
    .get(function (req, res) {                                      // retrieve and send that order's detail in API response
        Order.findById(req.params.order_id, function (err, order) {
            if (err)
                res.send(err);
            if (order == null) {           // if no such order id exists
                res.status(400).send({error: 'No such order ID found!'});
                return;
            }
            res.json(order);
        });
    });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER

app.listen(port);
console.log('Server started on port ' + port);