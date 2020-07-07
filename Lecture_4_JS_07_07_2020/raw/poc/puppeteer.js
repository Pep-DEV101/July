let puppeteer = require("puppeteer");
// npm install puppeteer
let gPage;
let { email, password } = require("../../../credentials.json");
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
        let loginBtnWillBeClickedP = gPage.click("button[data-analytics='LoginPassword']");
        let navigationPromise = Promise.all([loginBtnWillBeClickedP, gPage.waitForNavigation({ waitUntil: "networkidle0" })]);
        return navigationPromise;
    }).then(function () {
        console.log("user");
        let ipCardWillBeClickedP =
            Promise.all([gPage.click("a.ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link"), gPage.waitForNavigation({ waitUntil: "networkidle0" })])
        return ipCardWillBeClickedP;
    }).then(function () {
        // network 
        let waitForwarmupCardp = gPage.waitForSelector("a[data-attr1='warmup']");
        return waitForwarmupCardp;
    })
    .then(function () {
        // console.log("Reached IP Page Link");
        let warmCardClickP = Promise.all([gPage.click("a[data-attr1='warmup']"), gPage.waitForNavigation({ waitUntil: "networkidle0" })]);
        return warmCardClickP;
    }).catch(function (err) {
        console.log(err);
    })