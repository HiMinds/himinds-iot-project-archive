const WebSocket = require('ws');


// in order to handle self-signed certificates we need to turn off the validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const ws = new WebSocket('wss://localhost:8080');

ws.on('open', function open() {
  ws.send('hello from client');
});

ws.on('message', function incoming(data) {
  console.log(data);

  ws.close(); // Done
});

ws.addEventListener('error', (err) => console.log(err.message));
