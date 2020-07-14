let puppeteer = require("puppeteer");
// npm install puppeteer
let gPage, glangCodeElems;
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
}).then(function () {
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
        let newArr = [];
        for (let i = 0; i < allLinks.length; i++) {
            let fullLink = `https://www.hackerrank.com${allLinks[i]}`;
            newArr.push(fullLink);
        }

        let f1p = solveChallenge(newArr[0]);
        for (let i = 1; i < newArr.length; i++) {
            f1p = f1p.then(function () {
                let nxtfp = solveChallenge(newArr[i]);
                return nxtfp;
            })
        }

        return f1p;

    }).then(function () {
        console.log("All question submitted");
    })
    .catch(function (err) {
        console.log(err);
    })

function navgatorFn(selector) {
    return new Promise(function (resolve, reject) {
        let navigationP = Promise.all([gPage.click(selector),
        gPage.waitForNavigation({ waitUntil: "networkidle0" })]);
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
    // url
    return new Promise(function (resolve, reject) {
        let gotoQUestionPageP = gPage.goto(url);
        gotoQUestionPageP
            .then(function () {
                let wp = gPage.waitForSelector("a[data-attr2='Editorial']");
                return wp;
            }).then(function () {
                let goToEditorial = navgatorFn("a[data-attr2='Editorial']");
                return goToEditorial;
            })
            .then(function () {
                let waitForHandleLockBtn = handleLockBtn();
                return waitForHandleLockBtn;
            })
            .then(function () {
                let selectCodeP = copyCode();
                return selectCodeP;
            }).then(function (code) {
                let submitCodeP = submitCode(code);
                return submitCodeP;
            })
            .then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            })
        // goto url
        // click on editor tab
        // if lock btn => click
        // leave 
        // code copy 
        // go to proble tab 
        // paste code in vscode 
        // submit 

    })
}
function copyCode() {
    return new Promise(function (resolve, reject) {
        let waitForCode = gPage.waitForSelector(".editorial-code-box .hackdown-content .highlight",{visible:true});
        waitForCode
            .then(function () {
                let langNameP = gPage.$$(".editorial-code-box .hackdown-content h3");
                let langCodP = gPage.$$(".editorial-code-box .hackdown-content .highlight");
                let combinedP = Promise.all([langNameP, langCodP]);
                return combinedP;
            })
.then(function (combinedArr) {
            let langNamesElems = combinedArr[0];
            glangCodeElems = combinedArr[1];
            let langNamePArr = [];
            for (let i = 0; i < langNamesElems.length; i++) {
                let langNameP = gPage.evaluate(function (elem) { return elem.textContent; }, langNamesElems[i]);
                langNamePArr.push(langNameP);
            }
            return Promise.all(langNamePArr);
        })
            .then(function (langNameArr) {
                for (let i = 0; i < langNameArr.length; i++) {
                    if (langNameArr[i] == 'C++') {
                        let codePromise = gPage.evaluate(function (elem) { return elem.textContent }, glangCodeElems[i])
                        return codePromise;
                    }
                }
            })
            .then(function (code) {
                console.log(code)
                resolve(code);
            }).catch(function () {
                reject(err);
            })
    })
}

function handleLockBtn() {
    return new Promise(function (resolve, reject) {
        let waitForlockBtn = gPage.waitForSelector(".ui-tabs-wrap.left-pane .ui-btn.ui-btn-normal.ui-btn-primary");
        waitForlockBtn
            .then(function () {
                let elementClickP = gPage.click(".ui-tabs-wrap.left-pane .ui-btn.ui-btn-normal.ui-btn-primary");
                return elementClickP;
            }).catch(function (err) {
                console.log("Lock Btn not found");
                resolve();
            }).then(function () {
                resolve();
            })
    })
}

function submitCode(code) {
    return new Promise(function (resolve, reject) {
        let waitForNavigationP = navgatorFn("a[data-attr2='Problem']");
        waitForNavigationP.then(function () {
            let waitFOrGInput = gPage.waitForSelector(".custom-input-checkbox");
            return waitFOrGInput;
        })
            .then(function () {
                let inputWillBeClickedP = gPage.click(".custom-input-checkbox");
                return inputWillBeClickedP;
            }).then(function () {
                let inputP = gPage.click(".custominput");
                return inputP
            })
            .then(function () {
                let codeWillEneterdP = gPage.type(".custominput", code);
                return codeWillEneterdP;
            }).then(function () {
                let ctrlPressedP = gPage.keyboard.down("Control");
                return ctrlPressedP;
            })
            .then(function () {
                let ap = gPage.keyboard.press("a");
                return ap
            }).then(function () {
                let cp = gPage.keyboard.press("x");
                return cp;
            }).then(function () {
                let inputClickP = gPage.click(".monaco-editor.no-user-select.vs");
                return inputClickP;
            }).then(function () {
                let ca = gPage.keyboard.press("a");
                return ca;
            })
            .then(function () {
                let vp = gPage.keyboard.press("v");
                return vp;
            }).then(function () {
                let submitClickP = gPage.click(".pull-right.btn.btn-primary.hr-monaco-submit");
                return submitClickP
            }).then(function () {
                let ctrlPressedUpP = gPage.keyboard.up("Control");
                return ctrlPressedUpP;
            }).
            then(function () {
                resolve()
            }).catch(function (err) {
                reject();
            })
    })
}