let fs = require("fs");
let content = fs.readFileSync("template.html", "utf-8");
let replacedFile = content.replace("{Heading}", "My heading");
fs.writeFileSync("final.html", replacedFile);