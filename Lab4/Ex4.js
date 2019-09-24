var http = require('http');

//create a server object:
http.createServer(function (req, res) {
    console.log(req.headers); //output the request headers to the console
    res.writeHead(200, { 'Content-Type': 'text/html' }); // set MIME type to HTML 
    //Now we are inputting a new string for redirection; we will need to comment out each individual line so only 1 works
    res.write('<META http- equiv ="refresh" content="0;URL=http://www.google.com">'); //Google doesnt work!!!
    //res.write('<script>window.location = "http://www.apple.com";</script>'); 
    //res.writeHead(301, { "Location": "http://amazon.com"}); 
    res.end(); //end the response
}).listen(8081); //the server object listens on port 8081

console.log('Hello world HTTP server listening on localhost port 8081');