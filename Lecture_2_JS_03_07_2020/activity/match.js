let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
function processMatch(url) {
    console.log("Request send");
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
function parsehtml(body) {
    let ch = cheerio.load(body);
    let matchResultElement = ch(".desc.text-truncate");
    console.log(matchResultElement.text());
    let matchSummaryElem = ch(".summary span");
    console.log(matchSummaryElem.text());
    let cardsElems = ch(".card.content-block.match-scorecard-table .Collapsible");
    // console.log(cardsElems.length);
    // fs.writeFileSync("innings.html", cardsElems);
    // console.log("Innings file saved");
    console.log("###################################");
    for (let i = 0; i < cardsElems.length; i++) {
        let teamNameElem = ch(cardsElems[i]).find("h5");
        let cTeam = teamNameElem.text()
        cTeam = cTeam.split("Innings")[0]
        let AllRows = ch(cardsElems[i]).find(".table.batsman tbody tr")
        for (let j = 0; j < AllRows.length; j++) {
            let AllCols = ch(AllRows[j]).find("td");
            if (AllCols.length > 1) {
                // player waali row
                let cols = ch(AllRows[j]).find("td");
                let batsmanName = ch(cols[0]).text();
                let runs = ch(cols[2]).text();
                let balls = ch(cols[3]).text();
                let fours = ch(cols[5]).text();
                let sixes = ch(cols[6]).text();
                let sr = ch(cols[7]).text();
                console.log(`Teams: ${cTeam} Name ${batsmanName} Runs: ${runs}  Balls: ${balls} Fours: ${fours} sixes: ${sixes} sr: ${sr}`);
            }
        }
        console.log("````````````````````````````````````````````````");

    }
}
module.exports = {
    processMatch: processMatch
}