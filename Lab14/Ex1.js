/*We're going to assume that our data for this lab is stored in a json file
We are going to use unique usernames as array objects with some properties
i.e. name, password, email, etc.  If we wanted to grab this data, we can call
the array object name (username). This is similar to our products.js from Assignment 1*/

fs = require('fs'); //Load in filesystem module, apply to fs variable
var filename = 'user.data.json';

data = fs.readFileSync(filename, 'utf-8') //readFileSync is a command found in the fs module, must call it by doing fs.(name) first
                                          //readFileSync goes off and reads a file, but then also tells you to do the function before moving on
                                          //^^^ This is called synchronously; if its asynchronous then it will go as soon as possible

//console.log(data); //Console log for testing (outputs data variable as a string)
console.log(typeof data); //Currently this data variable (our file's cotents) is a string.  We don't want it to be a string, we want to be able to grab the actual data so... (we do the below action)
users_reg_data = JSON.parse(data); //This will move through our data string from our json file (user.data.json) and turn it into an object

//console.log(users_reg_data); //Console log for testing (shows arrays)
//console.log(typeof users_reg_data); //Console log for testing (shows type -> object); this proves the JSON.parse(data) worked
console.log(users_reg_data['itm352'].password); //Console log for testing (shows actual object properties)