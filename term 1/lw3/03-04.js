const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


function factorial(n) {
	if (n === 0 || n === 1) {
		return 1;
    } else {
		return n * factorial(n - 1);
    }
}

// function factorial(n, cb) {
// 	if (n < 0) {
// 		cb(new Error("Факториал отрицательного числа не определен"));
// 		return;
// 	}
// 	if (n === 0 || n === 1) {
// 		process.nextTick(() => cb(null, 1));
// 		return;
// 	}
// 	let res = n;
// 	process.nextTick(function calc() {
// 		if (n === 2) {
// 			cb(null, res);
// 			return;
// 		}
// 		res *= --n;
// 		process.nextTick(calc);
// 	});
// }
//
// function getFactorialResult(num) {
// 	return factorial(num, (err, result) => {
// 		if (err) {
// 			console.error(err);
// 			return;
// 		}
// 		test = result;
// 		console.log(`Факториал числа: ${result}`);
// 	}); 
// }


app.get('/fact', (req, res) => {
    const k = parseInt(req.query.k);
	const fact = factorial(k);
	process.nextTick(() => res.json({ k, fact }));
});

app.get('/factList', (request, response) => {
    const max = parseInt(request.query.max);
    let res = [];
    for (let i = 0; i < max; i++) {
        const start = performance.now();
        let result = factorial(i);
        const end = performance.now(); 
        res[i] = `\n${i}. Result: ${((end - start) * 10000).toFixed(2)}-${i}/${result}`;
    }
    process.nextTick(() => response.end(res.toString()));
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/03-03.html');
});

app.listen(5000, () => {
    console.log('Server is running on port http://localhost:5000');
});