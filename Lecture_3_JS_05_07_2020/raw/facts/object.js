let obj = {
    firstName: "Steve",
    lastName: "Rogers",
    age: 45,
    isAvenger: true,
    movies: ["First Aveneger", "Civil War"],
    address: {
        city: "New York",
        state: "Manhatten"
    }
}
// JavaScript Object Notation
// console.log(obj);
// get
// console.log(obj.firstName);
// console.log(obj.movies[1]);
// console.log(obj["age"]);
// add key 
// obj.friends = ["tony", "Bruce"];
// update
// obj.age=46
// delete
// delete obj.isAvenger
// console.log(obj);

function updateObj(prop, value) {
    obj[prop] = value;
}
updateObj("isAvenger", false);
updateObj("age", 104);
console.log(obj);