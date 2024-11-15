import { PATHS } from "../../constants";

class HomePage {
    load() {
        cy.intercept("/api/v2/user_markets*").as("getUserMarkets");
        cy.visit(PATHS.HOMEPAGE);
        cy.url().should("include", PATHS.HOMEPAGE);
        cy.wait("@getUserMarkets").its("response.statusCode").should("equal", 200);
    }
}

export const homePage = new HomePage();
