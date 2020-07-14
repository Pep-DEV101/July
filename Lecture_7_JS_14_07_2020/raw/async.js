let fs = require("fs");
console.log("Before");
let rfP = fs.promises.readFile("f1.txt");

async function fn() {
    try{
        console.log("Inside async fn");
        let data = await rfP;
        console.log("" + data);
        return 10;
    }
    catch(err){
        return err
    }
}
let rValP = fn();
console.log(rValP);
console.log("After");

rValP.then(function(data){
    console.log("``````````````````````");
    console.log(data);
})

// setTimeout(function(){
//     console.log("Inside setT");
//     console.log(rValP)
// },1000)