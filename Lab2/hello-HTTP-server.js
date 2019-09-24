var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  console.log(req.headers); //output the request headers to the console
  //For quiz //res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html><b>Hello World!</b></html>'); //write a response to the client
  //For quiz //res.write('<script>document.getElementById("id_h1").innerHTML="Goodbye World!";</script>')
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

console.log('Hello world HTTP server listening on localhost port 8080');