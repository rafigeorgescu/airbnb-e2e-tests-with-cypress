declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Select random element(s) from the list
         * @param size {number}
         * @example
         * cy.get("option").random().click()
         * @example
         * cy.get("li").random(3).click({multiple: true})
         * @returns {Chainable<any>}
         */
        random(size?: number): Chainable<Subject>;
    }
}
