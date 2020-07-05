let request = require("request");
let fs = require("fs");
let MatchRef = require("./match.js");
let cheerio = require("cheerio");
console.log("Request send");
function processAllMatch(url) {

    request(url, cb);
}
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
    let cards = ch(".col-md-8.col-16");
    for (let i = 0; i < cards.length; i++) {
        let anchorsArr = ch(cards[i]).find(".match-cta-container a");
        let link = ch(anchorsArr[0]).attr("href");
        // console.log(matchLink);
        let completeLink = "https://www.espncricinfo.com" + link;
        // console.log(completeLink);
        MatchRef.processMatch(completeLink);
    }
    // console.log("Saved All cards");
}
module.exports = {
    processAllMatch: processAllMatch
}