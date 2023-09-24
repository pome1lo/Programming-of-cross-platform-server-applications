function f1() { console.log("f1"); }
function f2() { console.log("f2"); }
function f3() { console.log("f3"); }

function main() {
    console.log("main");

    setTimeout(f1, 50);
    setTimeout(f3, 30);

    new Promise((resolve, reject) => {
        resolve('I am a promise, right after f1 and f3! Really?');
    }).then(resolve => console.log(resolve));

    new Promise((resolve, reject) => {
        resolve('I am a promise after promise');
    }).then(resolve => console.log(resolve));
    
    f2();
}

main();