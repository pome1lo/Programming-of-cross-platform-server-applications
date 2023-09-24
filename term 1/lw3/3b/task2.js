function secondJob() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('MY ERROR 😎'));
        }, 3000);
    });
}

secondJob()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });

async function handlePromise() {
    try {
        const result = await secondJob();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

handlePromise();