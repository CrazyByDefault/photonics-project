// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var shell      = require('node-cmd');
var tcp        = require('tcp-proxy');

var server = tcp.createServer({
  target: {
    host: '127.0.0.1',
    port: 8080
  }
});

server.listen(8081);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    shell.run('avconv -f video4linux2 -s 640x480 -i /dev/video0 -ss 0:0:2 -frames 1 /foo/out.jpg')
    console.log('Something is happening.');
    shell.run('/root/openface/demos/classifier.py infer generated-embeddings/classifier.pkl out.jpg')
    next(); // make sure we go to the next routes and don't stop here
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
