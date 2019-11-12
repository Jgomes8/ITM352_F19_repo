var express = require('express'); //call express
var app = express(); //initialize express
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next(); 
});
//We replaced the response.send above with console.log as otherwise the below app.use would not recieve requests. Now the app.use will send a response to a request
app.use(express.static('./public')); //We are telling express to use public folder
app.listen(8080, () => console.log(`listening on port 8080`));
