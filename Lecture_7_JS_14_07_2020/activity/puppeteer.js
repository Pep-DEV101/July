let puppeteer = require("puppeteer");
// npm install puppeteer
let gPage, glangCodeElems;
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
        gPage=page
        await page.goto("https://www.hackerrank.com/auth/login");
        await page.type("#input-1", email);
        await page.type("#input-2", password);
        await navigatorFn("button[data-analytics='LoginPassword']");
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