function isDataValide(data) {
    if(typeof data === 'number') 
        return true;
    return false;
}

function raiseToTheSecondDegree(data) {
    return new Promise((resolve, reject) => {
        if(isDataValide(data)) {
            resolve(`Raise ${data} to the second degree: ${data * data}`);
        } else {
            reject(new Error('Data is not a number!'));
        }
    });
}

function raiseToTheThirdDegree(data) {
    return new Promise((resolve, reject) => {
        if(isDataValide(data)) {
            resolve(`Raise ${data} to the third degree: ${data * data * data}`);
        } else {
            reject(new Error('Data is not a number!'));
        }
    });
}

function raiseToTheFourthDegree(data) {
    return new Promise((resolve, reject) => {
        if(isDataValide(data)) {
            resolve(`Raise ${data} to the fourth degree: ${data * data * data * data}`);
        } else {
            reject(new Error('Data is not a number!'));
        }
    });
}

const promises = [
    raiseToTheSecondDegree(2),
    raiseToTheThirdDegree(2), 
    raiseToTheFourthDegree(2)
];

//Promise.any(promises) //выполнит все три функции параллельно и вернет первое разрешенное значение. Если все промисы отклонены, то будет возвращена ошибка.
Promise.race(promises)  // выполнит все три функции параллельно, но вернет только первое разрешенное значение или первую отклоненную ошибку.
  .then((results) => console.log(results))
  .catch((error) => console.log(error));