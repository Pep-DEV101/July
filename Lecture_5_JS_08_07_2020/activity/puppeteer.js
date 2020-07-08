let puppeteer = require("puppeteer");
// npm install puppeteer
let gPage;
let { email, password } = require("../../credentials.json");
let bopenP = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"]
})
bopenP.then(function (browser) {
    console.log("Browser Opened");
    let bPagesP = browser.pages();
    return bPagesP;
}).then(function (allPages) {
    // console.log(allPages.length);
    let page = allPages[0];
    let pageWillBeOpenedP = page.goto("https://www.hackerrank.com/auth/login");
    gPage = page;
    return pageWillBeOpenedP;
}).then(function (res) {
    console.log("Google home page");
    // console.log(res);
    let emailTypeP = gPage.type("#input-1", email);
    return emailTypeP;
}).then(function () {
    let passwordTypeP = gPage.type("#input-2", password);
    return passwordTypeP;
}).
    then(function () {
        let navigationPromise = navgatorFn("button[data-analytics='LoginPassword']");
        return navigationPromise;
    }).then(function () {
        let ipCardWillBeClickedP = navgatorFn("a.ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link");
        return ipCardWillBeClickedP;
    }).then(function () {
        // network 
        let waitForwarmupCardp = gPage.waitForSelector("a[data-attr1='warmup']");
        return waitForwarmupCardp;
    })
    .then(function () {
        // console.log("Reached IP Page Link");
        let warmCardClickP = navgatorFn("a[data-attr1='warmup']");
        return warmCardClickP;
    }).then(function () {
        let allLinkP = gPage.waitForSelector("a.js-track-click.challenge-list-item");
        return allLinkP
    })
    .then(function () {
        let allQuestionsP = 
        gPage.$$("a.js-track-click.challenge-list-item");
        return allQuestionsP;
    }).then(function (allQuestions) {
        let linkPArr = [];
        console.log(allQuestions.length);
        for (let i = 0; i < allQuestions.length; i++) {
            let linkP = gPage.evaluate(function (element) {
                return element.getAttribute("href");
            }, allQuestions[i]);
            linkPArr.push(linkP);
        }
        let allLinkP = Promise.all(linkPArr);
        return allLinkP
    }).then(function (allLinks) {
        console.log(allLinks);
    })
    .catch(function (err) {
        console.log(err);
    })

function navgatorFn(selector) {
    return new Promise(function (resolve, reject) {
        let navigationP = Promise.all([gPage.click(selector), gPage.waitForNavigation({ waitUntil: "networkidle0" })]);
        navigationP
            .then(function () {
                console.log("Successfully Navigated to next page");
                resolve();
            }).catch(function (err) {
                reject(err);
            })
    })
}

function solveChallenge(url) {

}