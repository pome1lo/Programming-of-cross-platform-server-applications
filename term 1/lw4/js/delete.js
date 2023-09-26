function Delete() {
    console.log('Delete');
    fetch('http://localhost:5000/api/db', {
        method: 'Delete',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
        },
        body:JSON.stringify({
            id: IDDel.value,
            name: '0',
            bday:  '0'
        })
    }
    )
    .then(response=> { 
        return response.json();
    })
    .then((pdata)=> {
        console.log('Delete.pdata', pdata);
    });
}