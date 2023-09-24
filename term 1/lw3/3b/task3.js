function thirdJob(data) {
    if(typeof data !== 'number') {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Data is not a number!'));
            }, 0);
        });
    }
    else {
        if(data % 2 === 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('odd');
                }, 1000);
            });
        }
        else {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject('even');
                }, 2000);
            });
        }
    }
}

thirdJob('NaN')
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });

async function handlePromise() {
    try {
        const result = await thirdJob(2);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

handlePromise();