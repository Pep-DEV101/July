// function definition=> code
function myfn(param) {
    console.log(param)
    param();
    // return "some value";
    return undefined;
}
// myfn(function smaller() {
//     console.log(" I am smaller");
// })
// function call
// let rVal = myfn("Steve");
// myfn([1, 2, 3, 4, 5]);
// myfn(10);
// myfn(null);
// console.log(rVal);
// fn are variables
// variables can be passed as parameter to a fn
// function can be passed as  parameter to a fn

// you can assign value / address  of a variable
//  to a variable
// you can assign address of a fn to a variable
// let a = 10;
// let b = a;
// console.log(b);
let a = [1, 2, 3, 4, 5];
let b = a;
console.log(b);

let greeter = function sayHi() {
    console.log("Hello All");
}

console.log(greeter);
greeter();