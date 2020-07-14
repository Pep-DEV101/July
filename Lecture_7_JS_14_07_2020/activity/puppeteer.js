let puppeteer = require("puppeteer");
// npm install puppeteer
let gPage;
let { email, password } = require("../../credentials.json");
(async function () {
    try {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        })
        let pages = await browser.pages();
        let page = pages[0];
        gPage = page
        await page.goto("https://www.hackerrank.com/auth/login");
        await page.type("#input-1", email);
        await page.type("#input-2", password);
        await navigatorFn("button[data-analytics='LoginPassword']");
        await page.waitForSelector("a[data-analytics='NavBarProfileDropDown']", { visible: true });
        await page.click("a[data-analytics='NavBarProfileDropDown']");
        await page.waitForSelector("a[data-analytics='NavBarProfileDropDownAdministration']", { visible: true });
        await navigatorFn("a[data-analytics='NavBarProfileDropDownAdministration']")
        await page.waitForSelector(".nav-tabs.nav.admin-tabbed-nav li", { visible: true });
        let allTabs = await page.$$(".nav-tabs.nav.admin-tabbed-nav li");
        await allTabs[1].click();
        let challenges = require("./challenge");
        let createChallengePageLink = page.url();
        for (let i = 0; i < challenges.length; i++) {
            await page.goto(createChallengePageLink);

            await createChallenge(challenges[i]);
        }
        console.log("Navigated");
    } catch (err) {
        console.log(err);
    }
})();

async function navigatorFn(selector) {
    try {
        await Promise.all(
            [gPage.click(selector),
            gPage.waitForNavigation({ waitUntil: "networkidle0" })]);
        console.log("Successfully Navigated to next page");
    } catch (err) {
        return err;
    }

}

async function createChallenge(ch) {
    await gPage.waitForSelector(".btn.btn-green.backbone.pull-right", { visible: true });
    await navigatorFn(".btn.btn-green.backbone.pull-right");
}