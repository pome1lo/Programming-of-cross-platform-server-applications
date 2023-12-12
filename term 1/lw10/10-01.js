const net = require('net');

const HOST = '0.0.0.0';
const PORT = 3000;

const server = net.createServer()
    .listen(PORT, () => {
        console.log(`Server started on port ${PORT}...`)
    }
);

server.on('connection', socket => {
    console.log('👍 User connected!!');

    socket.on('data', data => {
        console.log(`Client message: "${data}"`);
        socket.write(`ECHO: ${data}`);
    });

    socket.on('close', () => {
        console.log('👎 User disconnected');
    });

    socket.on("error", (error) => {
        console.log(`Error: ${error}`);
    });
});