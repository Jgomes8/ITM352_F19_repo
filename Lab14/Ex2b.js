/*We want to first check if a file exists before we run any code*/

fs = require('fs'); //Load in filesystem module, apply to fs variable
var filename = 'user.data.json';
//var filename = 'zuser.data.json'; //Used to test our if-else statement with non-existent filename

if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    console.log(filename + ' has ' + stats.size + ' characters'); //The .size stat will output CHARACTERS
    
    data = fs.readFileSync(filename, 'utf-8'); 
    users_reg_data = JSON.parse(data); //This will move through our data string from a json file and turn it into an object
    console.log(users_reg_data['itm352'].password); //Console log for testing (shows actual object properties)
} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}
