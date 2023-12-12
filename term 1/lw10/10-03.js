const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 3000;

server.on('message', (message, remoteInfo) => {

    console.log(`😎 Client message: "${message}"`);

    const msgResponse = `ECHO: ${message}`;

    server.send(msgResponse, remoteInfo.port, remoteInfo.address, (err) => {
        if (err) { server.close(); }
    });

});

server.bind(PORT);