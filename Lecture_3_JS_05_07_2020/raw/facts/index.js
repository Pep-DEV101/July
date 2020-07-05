console.log("Hello All:) ");
// // Dynamically typed lang 
// // types=> number ,string ,boolean,undefined ,null
let varName;
console.log(varName);
varName = "I am a string";
console.log(varName);
varName = null;
console.log(varName);
// Java similar syntax => for ,while ,if else, switch ,classes,arrays
// isPrime
let num = 22;
for (let div = 2; div * div <= num; div++) {
    if (num % div == 0) {
        console.log("Number is not prime");
        return;
    }
}
console.log("Number is prime");
// to run => node index.js
