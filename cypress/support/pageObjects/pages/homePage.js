import { PATHS } from "../../constants";

const SELECTORS = {};

class HomePage {
    load() {
        cy.visit(PATHS.HOMEPAGE);
        cy.url().should("include", PATHS.HOMEPAGE);
    }
}

export const homePage = new HomePage();
