const http = require("http");
const readline = require("readline");

let state1 = "norm";
let state2 = "";

const requestListener = function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(200);
    res.end(state1);
};

const server = http.createServer(requestListener);
server.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);

    const readl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      
    const setState = function(line) {
        state2 = state1;
        state1 = line;
        readl.setPrompt(`${state1} -->`);
        console.log(`reg = ${state2} --- ${state1}`)
    }

    readl.setPrompt(`${state1} -->`);
    readl.prompt();

    readl.on('line', (line) => {
        switch (line.trim()) {
            case 'exit': console.log('GG!'); readl.close(); process.exit(0);
            case 'norm': setState(line); break;
            case 'stop': setState(line); break;
            case 'test': setState(line); break;
            case 'idle': setState(line); break;
            default: console.log(`Error: ${line.trim()}`); break;
        }
        readl.prompt();
    })
});