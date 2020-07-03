function LibFn() {
    console.log("I am lib fn");
}
function somefn() {
    console.log("I am another fn");
}
function privatefn() {
    console.log("I don't want to be exported");
}
let a=10;
let secret =20;

module.exports = {
    LibFn: LibFn,
    Another: somefn,
    a:a
}
