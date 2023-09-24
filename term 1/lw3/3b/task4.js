function validateCard(number) {
    console.log('Card number:' + number);
    if(Math.random() % 2 === 0) {
        return true;
    }
    return false;
}

function proceedToPayment(orderNumber) {
    console.log('Order id:' + orderNumber);
    if(Math.random() % 2 === 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Payment failed'));
            }, 1000);
        }); 
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Payment successful');
        }, 1000);
    });
}

function createOrder(cardNumber) {
    if(validateCard(cardNumber)) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Card is not valid'));
            }, 1000);
        });
    }
    else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Math.random(cardNumber));
            }, 5000);
        });
    }
}

const testNumber = '1342457689765653';

createOrder(testNumber)
    .then((result) => {
        console.log(result);
        proceedToPayment(result)
            .then((resultId) => {
                console.log(resultId)
            })
            .catch((err) => {
                console.error(err);        
            })
    })
    .catch((error) => {
        console.error(error);
    });

async function handlePromise() {
    try {
        const result = await createOrder(testNumber);
        const resultId = await proceedToPayment(result); 
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

handlePromise();