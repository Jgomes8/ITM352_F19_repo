var attributes  =  "Joey;22;22.5;-21.5" ; 
theSeparator = ";";
parts = attributes.split(theSeparator);

var attributes  =  "Joey;22;22.5;-21.5" ; 
parts = ["Joey",22,22.52,21.5];
for(i=0; i < parts.length; i++) {
    console.log(typeof parts[i]);
    
}
//Part C
console.log(parts.join(theSeparator));