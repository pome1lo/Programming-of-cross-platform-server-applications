function PUT() {
    console.log('PUT');
    fetch('http://localhost:5000/api/db', {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
        },
        body:JSON.stringify({
            id: IDPut.value, 
            name: NamePut.value,
            bday: BdayPut.value
        })}
    )
    .then(response => {
        return response.json();
    })
    .then((pdata)=> {
        console.log('PUT.pdata', pdata);
    });
}