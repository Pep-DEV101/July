let fs = require("fs");
console.log("Before");
let rfP = fs.promises.readFile("f1.txt");

async function fn() {
    let data = await rfP;
    console.log("" + data);
}
fn();
console.log("After");