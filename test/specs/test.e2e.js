require("chromedriver");
const { expect, browser, $, } = require('@wdio/globals');
const chai = require('chai');

const URL = "http://localhost:5173/";
const MAX_LEVEL = 3;
let LEVEL = 0;

describe('Maze', () => {
    
    describe('General test', () => {
        before(async () => {
            await browser.url(URL);
        });
        it('Level test', async () => {
            const curLevel = await  browser.execute(() => localStorage.getItem('level'))
            const result = (curLevel >= 0 && curLevel < MAX_LEVEL - 1) ? true : false;
            if(result) LEVEL = curLevel;
            chai.expect(result).to.equal(true);
        });
    });

    describe('Functionality test 1', () => {
        //-----------------------------------
        // MOVING FORWARD TWICE
        //-----------------------------------
        it('Failed case 1', async () => {
            await browser.url(URL);

            let source, target;
            source = await $('#up-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);

            source = await $('#up-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);

            await $('button[type="submit"]').click();

            
            // Wait until the error message is displayed (timeout: 8000ms)
            await browser.waitUntil(
                async () => await $('#msg').isDisplayed(),
                { timeout: 8000, timeoutMsg: 'Error message  did not appear' }
            );
            const errMsgClass = await $('#msg').getAttribute('class');
            expect(errMsgClass).toEqual('err-msg');
        });
        //-----------------------------------
        // Moving with color
        //-----------------------------------
        it('Failed case 2', async () => {
            await browser.url(URL);
            let source, target;
            source = await $('#up-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);

            source = await $('#green-command');
            target = await $('#function-slot-1-1 #up-command-function');
            await $(source).dragAndDrop(target);

            source = await $('#f0-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);

            await $('button[type="submit"]').click();

            
            // Wait until the error message is displayed (timeout: 8000ms)
            await browser.waitUntil(
                async () => await $('#msg').isDisplayed(),
                { timeout: 8000, timeoutMsg: 'Error message  did not appear' }
            );
            const errMsgClass = await $('#msg').getAttribute('class');
            expect(errMsgClass).toEqual('err-msg')

            
        });
        //-----------------------------------
        // Infinite rotation
        //-----------------------------------
        it('Failed case 3', async () => {
            await browser.url(URL);

            let source, target;
            source = await $('#left-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);

            source = await $('#f0-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);

            await $('button[type="submit"]').click();

            
            // Wait until the error message is displayed (timeout: 8000ms)
            await browser.waitUntil(
                async () => await $('#msg').isDisplayed(),
                { timeout: 8000, timeoutMsg: 'Error message  did not appear' }
            );
            const errMsgClass = await $('#msg').getAttribute('class');
            const errMsgText = await (await $('#msg')).getText();
            const result = ( errMsgClass == 'err-msg' && errMsgText == "Too many iterations") ? true : false;
            expect(result).toEqual(true)
            
        });
        
        //-----------------------------------
        // Success
        //-----------------------------------
        it('Call stack test', async () => {
            await browser.url(URL);
            let source, target;
            source = await $('#up-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);
        
            source = await $('#yellow-command');
            target = await $('#function-slot-1-1 #up-command-function');
            await $(source).dragAndDrop(target);
        
            source = await $('#up-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);
        
            await $('button[type="submit"]').click();
        
            // Wait until the overlay is displayed (timeout: 8000ms)
            const pointerOK = await browser.waitUntil(
                async () => {
                    const pointerDOM = await $('#pointer');
                    const parentDOM = await pointerDOM.parentElement();
                    const location = await parentDOM.getAttribute('id');
                    return location == 'cell-0-1';
                },
                { timeout: 5000, timeoutMsg: 'Pointer does not reach' }
            );
        
            // Check if the message is displayed
            const errMsgOK = await browser.waitUntil(
                async () => await $('#msg').isDisplayed(),
                { timeout: 8000, timeoutMsg: 'Error message  did not appear' }
            );

            expect(pointerOK).toEqual(true) &&
            expect(errMsgOK).toEqual(true);
        });
        
        //-----------------------------------
        // Success
        //-----------------------------------
        it('Passed case', async () => {
            await browser.url(URL);

            let source, target;
            source = await $('#up-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);

            source = await $('#f0-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);

            await $('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 8000ms)
            await browser.waitUntil(
                async () => await $('#overlay').isDisplayed(),
                { timeout: 8000, timeoutMsg: 'Overlay did not appear' }
            );
            const overlayClass = await $('#overlay').getAttribute('class');
            if(expect(overlayClass).toEqual('success-msg')){
                await $('button[type="submit"]').click();
            }
        });
    });
    
    describe('Functionality test 2', () => {
        //-----------------------------------
        // Success
        //-----------------------------------
        it('Passed case', async () => {
            await browser.url(URL);
            let source, target;
            source = await $('#up-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);

            source = await $('#left-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);

            source = await $('#up-command');
            target = await $('#function-slot-1-3');
            await $(source).dragAndDrop(target);

            source = await $('#right-command');
            target = await $('#function-slot-1-4');
            await $(source).dragAndDrop(target);

            source = await $('#f0-command');
            target = await $('#function-slot-1-5');
            await $(source).dragAndDrop(target);

            await $('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 8000ms)
            await browser.waitUntil(
                async () => await $('#overlay').isDisplayed(),
                { timeout: 5000, timeoutMsg: 'Overlay did not appear' }
            );
            const overlayClass = await $('#overlay').getAttribute('class');
            expect(overlayClass).toEqual('success-msg');
        });
    });
    
    describe('Functionality test 3', () => {
        //-----------------------------------
        // Success
        //-----------------------------------
        it('Passed case', async () => {
            await browser.url(URL);
            let source, target;
            source = await $('#up-command');
            target = await $('#function-slot-1-1');
            await $(source).dragAndDrop(target);

            source = await $('#f0-command');
            target = await $('#function-slot-1-2');
            await $(source).dragAndDrop(target);

            source = await $('#blue-command');
            target = await $('#function-slot-1-2 #f0-command-function');
            await $(source).dragAndDrop(target);

            source = await $('#f1-command');
            target = await $('#function-slot-1-3');
            await $(source).dragAndDrop(target);

            source = await $('#up-command');
            target = await $('#function-slot-2-1');
            await $(source).dragAndDrop(target);

            source = await $('#right-command');
            target = await $('#function-slot-2-2');
            await $(source).dragAndDrop(target);

            source = await $('#blue-command');
            target = await $('#function-slot-2-2 #right-command-function');
            await $(source).dragAndDrop(target);

            source = await $('#f1-command');
            target = await $('#function-slot-2-3');
            await $(source).dragAndDrop(target);

            await $('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 8000ms)
            await browser.waitUntil(
                async () => await $('#overlay').isDisplayed(),
                { timeout: 5000, timeoutMsg: 'Overlay did not appear' }
            );
            const overlayClass = await $('#overlay').getAttribute('class');
            expect(overlayClass).toEqual('end-msg');
        });
    });
});
