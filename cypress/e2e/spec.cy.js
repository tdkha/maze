const { describe } = require("mocha");
require("cypress-wait-until");
// No need to require chromedriver for Cypress
const URL = "http://localhost:5173/";
const MAX_LEVEL = 3;
const TIME_OUT = 6000;

describe('Maze', () => {
    let CURRENT_LEVEL = 0;
     function drag (drag , drop) {
        cy.get(drag).trigger('dragstart');
        cy.get(drop).trigger('drop');
      }


    describe('General test', () => {
        beforeEach(() => {
            cy.visit(URL);
        });

        it('Level test', () => {
            cy.window().then(win => {
                const curLevel = win.localStorage.getItem('level');
                const result = curLevel >= 0 && curLevel < MAX_LEVEL - 1;
                expect(result).to.equal(true);
            });
        });
    });

    describe('Functionality test 1', () => {
        //-----------------------------------
        // MOVING FORWARD TWICE
        //-----------------------------------
        it('Failed case 1', () => {
            cy.visit(URL);

            drag('#up-command', '#function-slot-1-1');
            drag('#up-command', '#function-slot-1-2');
            cy.get('button[type="submit"]').click();

            // Wait until the error message is displayed (timeout: 6000ms)
            cy.get('#msg')
            .should('be.visible')
            .and('have.class', 'err-msg');
        });

        //-----------------------------------
        // Moving with color
        //-----------------------------------
        it('Failed case 2', () => {
            cy.visit(URL);

            drag('#up-command','#function-slot-1-1');
            drag('#green-command','#function-slot-1-1 #up-command-function');
            drag('#f0-command','#function-slot-1-2');
            cy.get('button[type="submit"]').click();

            // Wait until the error message is displayed (timeout: 6000ms)
            cy.wait(TIME_OUT);
            cy.get('#msg')
            .should('be.visible')
            .and('have.class', 'err-msg');
        });

        //-----------------------------------
        // Infinite rotation
        //-----------------------------------
        it('Failed case 3', () => {
            cy.visit(URL);

            drag('#left-command','#function-slot-1-1');
            drag('#f0-command','#function-slot-1-2');

            cy.get('button[type="submit"]').click();

            // Wait until the error message is displayed (timeout: 6000ms)
            cy.wait(TIME_OUT);
            cy.get('#msg')
            .should('be.visible')
            .and('have.class', 'err-msg')
            .and('have.text', 'Too many iterations');
        });

        //-----------------------------------
        // Success
        //-----------------------------------
        it('Call stack test', () => {
            cy.visit(URL);

            drag('#up-command','#function-slot-1-1');
            drag('#yellow-command','#function-slot-1-1 #up-command-function');
            drag('#up-command','#function-slot-1-2');

            cy.get('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 6000ms)
            cy.get('#pointer').parent().should('have.attr', 'id', 'cell-0-1');
            cy.get('#msg').should('be.visible');
        });

        //-----------------------------------
        // Success
        //-----------------------------------
        it('Passed case', () => {
            cy.visit(URL);

            drag('#up-command','#function-slot-1-1');
            drag('#f0-command','#function-slot-1-2');

            cy.get('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 8000ms)
            if(cy.get('#overlay').should('have.class', 'success-msg')){
                cy.get('#next-button').click(); // Next button
            }
        });
    });
    
    describe('Functionality test 2', () => {
        //-----------------------------------
        // Success
        //-----------------------------------
        before(() => {
            CURRENT_LEVEL++;
            window.localStorage.setItem('level', CURRENT_LEVEL);
          })
        it('Passed case', () => {
            cy.visit(URL);

            drag('#up-command', '#function-slot-1-1')
            drag('#left-command', '#function-slot-1-2');
            drag('#up-command', '#function-slot-1-3');
            drag('#right-command', '#function-slot-1-4');
            drag('#f0-command', '#function-slot-1-5');

            cy.get('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 6000ms)
            if(cy.get('#overlay').should('have.class', 'success-msg')){
                cy.get('#next-button').click(); // Next button
            }
        });
    });
    
    describe('Functionality test 3', () => {
        //-----------------------------------
        // Success
        //-----------------------------------
        before(() => {
            CURRENT_LEVEL++;
            window.localStorage.setItem('level', CURRENT_LEVEL);
          })
        it('Passed case', () => {
            cy.visit(URL);

            drag('#up-command', '#function-slot-1-1');
            drag('#f0-command' , '#function-slot-1-2');
            drag('#blue-command', '#function-slot-1-2 #f0-command-function');
            drag('#f1-command','#function-slot-1-3' );
            drag('#up-command','#function-slot-2-1' );
            drag('#right-command', '#function-slot-2-2');
            drag('#blue-command', '#function-slot-2-2 #right-command-function');
            drag('#f1-command', '#function-slot-2-3');

            cy.get('button[type="submit"]').click();

            // Wait until the overlay is displayed (timeout: 6000ms) 
            if(cy.get('#overlay').should('have.class', 'end-msg')){
                cy.get('.end-button').click(); // Next button
            }      
        });
    });
});
