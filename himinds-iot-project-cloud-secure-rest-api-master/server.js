var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

var serverPort = process.env.PORT || 8080; 

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({id: 1, message: 'hello API'});
});

// POST /timestamp to get a timestamp
router.get('/timestamp', function (req, res) {
    res.json({id: 1234, message: 'utc timestamp', timestamp: timestamp()});

});

// allroutes will be prefixed with /api
app.use('/api', router);

// Using our self-signed certificates
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app).listen(serverPort);

console.log("Server Started at: https://127.0.0.1:" + serverPort);


//Helper function to create a timestamp
function timestamp() {
    return (new Date)
        .toISOString()
        .replace(/z|t/gi, ' ')
        .trim()
};