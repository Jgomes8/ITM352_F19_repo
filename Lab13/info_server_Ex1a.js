//We are using this mainly to output "hey i got a request"; use for diagnostics
var express = require('express'); //call express
var app = express(); //initialize express
app.all('*', function (request, response, next) {
    response.send(request.method + ' to path ' + request.path);
});
app.listen(8080, () => console.log(`listening on port 8080`));
