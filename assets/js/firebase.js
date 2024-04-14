const xhttp = new XMLHttpRequest();
xhttp.responseType = "json";
xhttp.onload = function() {
    if (xhttp.status === 200) {
        //stuff = [...xhttp.response];
        stuff = xhttp.response;
        console.log(stuff)
    }

}
xhttp.open('GET', 'https://birdwatch-6f587-default-rtdb.firebaseio.com/.json');
xhttp.send();