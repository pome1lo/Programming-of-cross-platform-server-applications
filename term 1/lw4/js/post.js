function Post() {
    console.log('Post');
    fetch('http://localhost:5000/api/db', {
        method:'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
        },
        body:JSON.stringify({
            id: ID.value,
            name: Name.value,
            bday: Bday.value})}
    )
    .then(response => { 
        return response.json();
    })
    .then((pdata)=> {
        console.log('POST.pdata', pdata);
    });
}