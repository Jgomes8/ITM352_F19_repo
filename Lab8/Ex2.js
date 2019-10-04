//Exercise 2a - We want to prematurely end our loop by using the break statement to output "Im old" when # is greater than half my age
//NOTE: BREAK ONLY WORKS INSIDE A LOOP; it will immediately stop a loop and go to next code outside it
/*
var age = 22;
var number = 1; //This initializes the counter
while(number < age) {
    console.log(`Are you ${number} years old?`);
    if(number >= (age/2)) {
        console.log("I'm old!");
        break;
    }
    number++;
}
console.log(`You must be ${number} years old!`);
*/

//Exercise 2b - Rewrite to skip ages greater than 3/4 my age then output new string
//NOTE: && = 'and'; both are true
//Since we increment first, we should set number to 0 otherwise we get off-by-one errors
//This code describes: when the conditional number is < our age, we will increment number. IF our age is less than half AND number is 3/4 greater than age, then we'll output "no age zone" for all ages inbetween.  Then it will output your final age by continuing the original code.
/*=
var age = 22;
var number = 0; //This initializes the counter
while(number < age) {
    number++;
    if(number > (age/2) && number < (3/4)*age ) {
        console.log("No age zone!");
        continue;
    }
    console.log(`Are you ${number} years old?`);
}
console.log(`You must be ${number} years old!`);
*/

//Exercise 2c - W
//Note that the last console.log(You must be X years old) does not execute because we TERMINATED THE PROGRAM!
var age = 22;
var number = 0; //This initializes the counter
while(number < age) {
    number++;
    if(number > (age/2) ) {
        console.log("Don't ask how old I am!")
        process.exit();
    }
    console.log(`Are you ${number} years old?`);
}
console.log(`You must be ${number} years old!`);