//
//Parts 1-

var express = require('express'); //start express module
var app = express(); //assign express functions to app variable

app.use(express.static('static_files')); //denote static_files as directory for express requests (app.post/get) for files to be fetched from

var fakeDatabase = { //Create database (array objects)
    'Philip': {
        job: 'proffessor', pet: 'cat.jpg'
    },
    'John': {
        job: 'student', pet: 'dog.jpg'
    },
    'Carol': {
        job: 'engineer', pet: 'bear.jpg'
    }
};

//Lets get data for ALL users
app.get('/users', function(request, response) { //method that sets routes for an HTTP get request for certain URLs; 'if someone is trying to get /users from app, I want to run following function
    console.log('running app.get /users');
    var allUsernames = Object.keys(fakeDatabase); //assign list(keys) of all objects from fakeDatabase array and assign it to variable
    console.log('allUsernames is:', allUsernames); //Console log text and variable 
    response.send(allUsernames); //Send variable to be printed on webpage
}); 

//Lets get data for a specific user
app.get('/users/:userid', function(request, response) { //If i type /users/ then anything else after, it will output this request action. 
    var nameToLookup = request.params.userid; //We want to specifically get certain userid's however (e.g. John, Carol, etc). To do this we assign it to a new variable.
    //params = special request that contains parameters for that request, .userid = the userid path; params lets us use the path as a parameter (like req/res)
    
    var val = fakeDatabase[nameToLookup]; //This is using bracket notation to grab information from fakeDatabase from what we input as the nameToLookup (what is inserted into our URL as the user/userID)
    
    console.log(nameToLookup, '->', val); 
    //response.send(val); //This will write {job: professor, pet: cat for Philip, or etc for the other database stuff}, but this only works if that object exists.
    if (val) {
        response.send(val); //So lets do an if statement to check, If val does exist, respond to user with val information
    } else {
        response.send({}); //If val doesnt exist, then respond with a blank object (brackets).
    }

});


app.listen(8080, () => console.log(`listening on port 8080`));