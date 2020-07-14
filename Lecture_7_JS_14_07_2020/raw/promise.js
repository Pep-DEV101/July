let fs = require("fs");
console.log("Before");
let rfP = fs.promises.readFile("f1.txt");

rfP.then(function (data) {
    console.log("" + data);
})
console.log("After");