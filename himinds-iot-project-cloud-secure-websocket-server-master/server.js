const fs = require('fs');
const WebSocket = require('ws');
const https = require('https');

const server = new https.createServer({
    cert: fs.readFileSync('server.crt'),
    key: fs.readFileSync('server.key')
});

const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws) {
    ws
        .on('message', function incoming(message) {

            console.log('received: %s', message);

            ws.send('hello from server!, the time is: ' + timestamp());
        });
});


//Helper function to create a timestamp
function timestamp() {
    return (new Date)
        .toISOString()
        .replace(/z|t/gi, ' ')
        .trim()
};

//Start the server
server.listen(8080);




