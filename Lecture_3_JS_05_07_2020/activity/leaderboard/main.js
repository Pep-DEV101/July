let request = require("request");
let fs = require("fs");
let AllMatchRef = require("./allMatch.js");
let cheerio = require("cheerio");
let url = "https://www.espncricinfo.com/series/_/id/8039/season/2015/icc-cricket-world-cup";
console.log("Request send");
request(url, cb);
function cb(err, header, body) {
    if (err == null && header.statusCode == 200) {
        console.log("Recieved Data");
        fs.writeFileSync("match.html", body);
        parsehtml(body)
    } else if (header.statusCode == 404) {
        console.log("url not found");
    } else {
        console.log(err);
        console.log(header);
    }
}
function parsehtml(data) {
    let ch = cheerio.load(data);
    let anchors = ch(".widget-items.cta-link .label.blue-text.blue-on-hover");
    let link = anchors.attr("href");
    // console.log(matchLink);
    let completeLink = "https://www.espncricinfo.com" + link;
    // console.log(completeLink);
    AllMatchRef.processAllMatch(completeLink);

    // console.log("Saved All cards");
}