let fs = require("fs");
console.log("Before");
// async function
fs.readFile("f1.txt", f1cb);
function f1cb(err, content) {
    console.log("Content: " + content);
    console.log("f1 ka after");
}
console.log("After")