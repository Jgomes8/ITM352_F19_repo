product1 = { 'name': 'small gumball', 'price': 0.02 };
product2 = { 'name': 'medium gumball', 'price': 0.05 };
product3 = { 'name': 'large gumball', 'price': 0.07 };

// array of all products
products = [product1, product2, product3];
cart_quantities = [2,0,4]; // corresponds to products array

//Add in for loop to list out arrays
for(i=0; i<products.length; i++) {
    console.log(`extended price for product ${products[i].name} is ${products[i].price * cart_quantities[i]}`);
}

//We are using things like .length to note the array length
//Other .object functions include .name and .price because those are aspects that were defined above 