function Get() {
    console.log('GET');
    fetch(
        'http://localhost:5000/api/db', {
            method:'GET', 
            mode: 'no-cors',
            headers:{ 
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            }
        }
    )
    .then(response => { 
        return response.json();
    })
    .then((pdata) => {
        console.log('pdata',pdata);
        get_result.innerHTML='';
        pdata.forEach(el => {
            get_result.innerHTML += (el.id + '. ' + el.name + ' ' + el.bday + '<br/>');
        });
    });
}