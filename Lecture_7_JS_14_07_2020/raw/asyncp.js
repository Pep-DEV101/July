let fs = require("fs");
console.log("Before");
let rfP = fs.promises.readFile("f1.txt");
function fn() {
    return new Promise(function (resolve, reject) {
        console.log("Inside fn");
        rfP
        .then(function (data) {
            console.log("" + data);
            resolve(10)
        }).catch(function (err) {
            reject
        })
    })
}
let rValP = fn();
console.log(rValP);
console.log("After");
rValP.then(function (data) {
    console.log("``````````````````````");
    console.log(data);
})