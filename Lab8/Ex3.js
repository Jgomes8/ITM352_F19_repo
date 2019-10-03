//Exercise 3a - recreated Ex1 while loop as for loop
/*
var age = 22;
for(var number = 1; number < age; number++) { //For loop seperates initializer(variable), the condition, and how we want to increment
    console.log(`Are you ${number} years old?`);
}
console.log(`You must be ${number} years old!`);
*/

//Exercise 3b - create for loop to count down from 50 to your age
var age = 22;
for(var number = 50; number > age; number--) { //We want to make sure we change our decrement and our conditional since our number is now greater than our age
    console.log(`Are you ${number} years old?`);
}
console.log(`You must be ${number} years old!`);