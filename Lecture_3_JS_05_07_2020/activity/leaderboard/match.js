let request = require("request");
let fs = require("fs"); //file system
let cheerio = require("cheerio");
let path = require("path"); // nodejs module
let count = 0;
let lb = [];
function processMatch(url) {
    console.log("Request send");
    count++;
    request(url, cb)
}
function cb(err, header, body) {
    if (err == null && header.statusCode == 200) {
        console.log("Recieved Data");
        count--;
        fs.writeFileSync("match.html", body);
        parsehtml(body)
        if (count == 0) {
 console.table(lb);
        }
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
    let result = matchResultElement.text().trim();
    let matchSummaryElem = ch(".summary span");
    let summary = matchSummaryElem.text();
    let wt = summary.split("won")[0];
    wt = wt.trim();
    let cardsElems = ch(".card.content-block.match-scorecard-table .Collapsible");
    // console.log(cardsElems.length);
    // fs.writeFileSync("innings.html", cardsElems);
    // console.log("Innings file saved");
    console.log("###################################");
    for (let i = 0; i < cardsElems.length; i++) {
        let teamNameElem = ch(cardsElems[i]).find("h5");
        let cTeam = teamNameElem.text();
        cTeam = cTeam.split("Innings")[0];
        cTeam = cTeam.trim();
        if (cTeam == wt) {
            let AllRows = ch(cardsElems[i]).find(".table.batsman tbody tr");
            for (let j = 0; j < AllRows.length; j++) {
                let AllCols = ch(AllRows[j]).find("td");
                if (AllCols.length > 1) {
                    // player waali row
                    let cols = ch(AllRows[j]).find("td");
                    let batsmanName = ch(cols[0]).text().trim();
                    let runs = ch(cols[2]).text().trim();
                    let balls = ch(cols[3]).text().trim();
                    let fours = ch(cols[5]).text().trim();
                    let sixes = ch(cols[6]).text().trim();
                    let sr = ch(cols[7]).text().trim();


                    console.log(`Teams: ${cTeam} Name ${batsmanName} Runs: ${runs}  Balls: ${balls} Fours: ${fours} sixes: ${sixes} sr: ${sr}`);


                    processPlayer(cTeam, batsmanName, runs);
                }
            }
            console.log("````````````````````````````````````````````````");
        }


    }
}
// processMatch("https://www.espncricinfo.com/series/8039/scorecard/656495/australia-vs-new-zealand-final-icc-cricket-world-cup-2014-15");
module.exports = {
    processMatch: processMatch
}
// function checkIfDirExist(dest) {
//     return fs.existsSync(dest);
// }
// function createDir(dest) {
//     return fs.mkdirSync(dest);
// }
// \\team\\batsManName.json

function processPlayer(team, batsmanName, runs) {
    runs = parseInt(runs)
    // 1.check =>team folder
    // search leaderboard
    // create an object of player
    // push in leaderboard
    for (let i = 0; i < lb.length; i++) {
        let player = lb[i];
        if (player.Name == batsmanName && player.Team == team) {
            // player exist
            player.Runs += runs
            return
        }
    }
    
    // first occurrence
    let obj = {
        Name: batsmanName,
        Team: team,
        Runs: runs
    }
    lb.push(obj);

}