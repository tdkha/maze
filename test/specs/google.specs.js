const puppeteer = require('puppeteer');
const chai = require('chai');

const URL = "http://localhost:5173/";
const MAX_LEVEL = 3;
let LEVEL = 0;

describe('Maze', () => {
    let browser;
    let page;

    before(async () => {
        const browser = await puppeteer.launch({headless: true});
        page = await browser.newPage();
        await page.goto(URL);
    });

    after(async () => {
        await browser.close();
    });

    describe('General test', () => {
        it('Level test', async () => {
            const curLevel = await page.evaluate(() => localStorage.getItem('level'));
            const result = curLevel >= 0 && curLevel < MAX_LEVEL - 1;
            if (result) LEVEL = curLevel;
            chai.expect(result).to.equal(true);
        });
    });

    describe('Functionality test 1', () => {
        //-----------------------------------
        // MOVING FORWARD TWICE
        //-----------------------------------
        it('Failed case 1', async () => {
            await page.goto(URL);

            await page.dragAndDrop('#up-command', '#function-slot-1-1');
            await page.dragAndDrop('#up-command', '#function-slot-1-2');
            await page.click('button[type="submit"]');

            // Wait until the error message is displayed (timeout: 8000ms)
            await page.waitForSelector('#msg', { timeout: 8000 });
            const errMsgClass = await page.$eval('#msg', (el) => el.getAttribute('class'));
            chai.expect(errMsgClass).to.equal('err-msg');
        });

        // ... other test cases ...
    });

    // ... other describe blocks ...

});
