http = require('http');

let startState = "norm";

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<h1>${startState}</h1>`);
}).listen(5000);

console.log('Server is running at http://localhost:5000');

process.stdin.setEncoding('utf8');
process.stdout.write(startState + "->");
process.stdin.on('readable', () => {
    let state = null;
    while((state = process.stdin.read()) !== null) {
        switch (state.trim()) {
            case "exit": process.exit(0); break;
            case "norm":
            case "idle":
            case "stop":
            case "test":
                process.stdout.write("reg = " + startState + " --> " + state);
                startState = state.trim();
                break;
            default:
                process.stdout.write(state);
        }
        process.stdout.write(startState + "->");
    }
});