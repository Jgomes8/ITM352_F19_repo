//Exercise 1-creating counter loop until it reaches our age
/*
var age = 22;
var number = 1; //This initializes the counter
while(number != age) {
    console.log(`Are you ${number} years old?`);
    number++;
}
console.log(`You must be ${number} years old!`);
*/
//This version takes into account fractions and off-by-one errors--- sorta?
var age = 22.5;
var number = 1; //This initializes the counter
while(number < age) {
    console.log(`Are you ${number} years old?`);
    number++;
}
console.log(`You must be ${number} years old!`);
