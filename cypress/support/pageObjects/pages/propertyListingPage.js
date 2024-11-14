const SELECTORS = {
    PROPERTY_COMPONENT: "[itemprop=itemListElement]",
    SIMILAR_PROPERTIES_CAROUSEL: "[aria-labelledby=carousel-label]",
    PROPERTY_LINK: "a[aria-hidden=true]:first-of-type",
    PROPERTY_SUBTITLE: "[id^=title] + div",
};

class PropertyListingPage {
    checkPropertiesAreDisplayed() {
        cy.get(SELECTORS.PROPERTY_COMPONENT).should("be.visible");
    }

    openRandomProperty() {
        return cy
            .get(SELECTORS.PROPERTY_COMPONENT)
            .filter((_, element) => {
                return !Cypress.$(element).closest(SELECTORS.SIMILAR_PROPERTIES_CAROUSEL).length;
            })
            .random()
            .then((property) => {
                const propertySubtitle = Cypress.$(property).find(SELECTORS.PROPERTY_SUBTITLE).text();
                cy.wrap(property).find(SELECTORS.PROPERTY_LINK).invoke("attr", "target", "_self");
                cy.wrap(property).click();
                cy.wrap(propertySubtitle);
            });
    }
}

export const propertyListingPage = new PropertyListingPage();
