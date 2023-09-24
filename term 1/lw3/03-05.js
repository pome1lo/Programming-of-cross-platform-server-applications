const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


// function factorial(n, cb) {
//     if (n < 0) {
//       cb(new Error("Факториал отрицательного числа не определен"));
//       return;
//     }
//     if (n === 0 || n === 1) {
//       setImmediate(() => cb(null, 1));
//       return;
//     }
//     let res = n;
//     setImmediate(function calc() {
//       if (n === 2) {
//         cb(null, res);
//         return;
//       }
//       res *= --n;
//       setImmediate(calc);
//     });
//   }
function factorial(n) {
	if (n === 0 || n === 1) {
		return 1;
    } else {
		return n * factorial(n - 1);
    }
}

app.get('/fact', (req, res) => {
  const k = parseInt(req.query.k);
  const fact = factorial(k);
  setImmediate(() => res.json({ k, fact }));
});

app.get('/factList', (req, res) => {
    const max = parseInt(req.query.max);
    let arr = [];
    for (let i = 0; i < max; i++) {
      const start = performance.now();
      let result = factorial(i);
      const end = performance.now(); 
      res[i] = `\n${i}. Result: ${((end - start) * 10000).toFixed(2)}-${i}/${result}`;
    }
    setImmediate(() => res.end(arr.toString()));
});



app.listen(5000, () => {
    console.log('Server is running on port http://localhost:5000');
});