let fs = require("fs");
console.log("Before");
fs.readFile("f11.txt", function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("" + data);
    }
})
console.log("After");