function getFirstName(fullName) {
    let stringArr = fullName.split(" ");
    return stringArr[0];
}
function getLastName(fullName) {
    return fullName.split(" ")[1];
}
// HOF 
function greeter(fullName, cb) {
    let message = cb(fullName);
    console.log("Hi " + message);
}
greeter("Steve Rogers", getFirstName);
greeter("Steve Rogers", getLastName);
// console.log(rVal);
