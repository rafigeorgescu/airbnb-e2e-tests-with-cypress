import { HIGHLIGHTED_COLOR, i18n, PATHS } from "../../constants";

const SELECTORS = {
    PROPERTY_COMPONENT: "[itemprop=itemListElement]",
    SIMILAR_PROPERTIES_CAROUSEL: "[aria-labelledby=carousel-label]",
    PROPERTY_LINK: "a[aria-hidden=true]:first-of-type",
    PROPERTY_TITLE: "[id^=title]",
    PROPERTY_SUBTITLE: "[id^=title] + div",
    PROPERTY_BEDROOMS_COMPONENT: "[id^=title] ~ div:nth-child(3) > span:last-child > span:first-child",
    MAP_COMPONENT: "[aria-roledescription=map][role=region]",
    MAP_PROPERTY_POPUP: "[aria-labelledby^=title]",
    MAP_PIN: "[data-veloute='map/markers/BasePillMarker'] > div > div",
};

class PropertyListingPage {
    checkPageIsDisplayed() {
        cy.url().should("include", PATHS.SEARCH_RESULTS);
    }

    checkPropertiesAreDisplayed() {
        cy.get(SELECTORS.PROPERTY_COMPONENT).should("be.visible");
    }

    getFilteredPropertiesList() {
        return cy.get(SELECTORS.PROPERTY_COMPONENT).filter((_, element) => {
            return !Cypress.$(element).closest(SELECTORS.SIMILAR_PROPERTIES_CAROUSEL).length;
        });
    }

    openRandomProperty() {
        return this.getFilteredPropertiesList()
            .random()
            .then((property) => {
                const propertySubtitle = Cypress.$(property).find(SELECTORS.PROPERTY_SUBTITLE).text();
                cy.wrap(property).find(SELECTORS.PROPERTY_LINK).invoke("attr", "target", "_self");
                cy.wrap(property).click();
                cy.wrap(propertySubtitle);
            });
    }

    selectFirstProperty() {
        return this.getFilteredPropertiesList().first();
    }

    openFirstProperty() {
        return this.selectFirstProperty().then((property) => {
            const propertySubtitle = Cypress.$(property).find(SELECTORS.PROPERTY_SUBTITLE).text();
            cy.wrap(property).find(SELECTORS.PROPERTY_LINK).invoke("attr", "target", "_self");
            cy.wrap(property).click();
            cy.wrap(propertySubtitle);
        });
    }

    hoverOnFirstProperty() {
        return this.selectFirstProperty()
            .trigger("mouseover")
            .then((property) => {
                const propertyTitle = Cypress.$(property).find(SELECTORS.PROPERTY_TITLE).text();
                const propertySubtitle = Cypress.$(property).find(SELECTORS.PROPERTY_SUBTITLE).text();
                const propertyBedroomsNumber = Cypress.$(property).find(SELECTORS.PROPERTY_BEDROOMS_COMPONENT).text();
                cy.wrap({ title: propertyTitle, subtitle: propertySubtitle, bedroomsNumber: propertyBedroomsNumber });
            });
    }

    checkMaxNumberOfBedrooms(expectedBedroomsNumber) {
        this.getFilteredPropertiesList().each((property) => {
            cy.wrap(property)
                .find(SELECTORS.PROPERTY_BEDROOMS_COMPONENT)
                .each((element) => {
                    const text = element.text();
                    const bedroomsNumber = text !== i18n.FREE_CANCELLATION ? Number(text.match(/\d+/g)) : undefined;
                    console.log(bedroomsNumber);
                    if (bedroomsNumber) {
                        expect(bedroomsNumber).to.be.gte(expectedBedroomsNumber);
                    } else {
                        console.log("Number of bedrooms not displayed on the Property listing page");
                    }
                });
        });
    }

    checkPinsAreNotHighlighted() {
        cy.get(SELECTORS.MAP_PIN).should("not.have.css", "background-color", HIGHLIGHTED_COLOR);
    }

    checkMapPinIsHighlighted(propertyTitle) {
        cy.contains(`${SELECTORS.MAP_PIN} > div`, propertyTitle).should("have.css", "background-color", HIGHLIGHTED_COLOR);
    }

    showPropertyDetailsOnMap(propertyTitle) {
        cy.contains(SELECTORS.MAP_PIN, propertyTitle).click();
        cy.get(SELECTORS.MAP_COMPONENT).find(SELECTORS.MAP_PROPERTY_POPUP).should("be.visible");
    }

    checkPropertyDetailsAreCorrect(propertyDetails) {
        cy.get(SELECTORS.MAP_COMPONENT).within(() => {
            cy.get(SELECTORS.MAP_PROPERTY_POPUP).should("be.visible");
            cy.get(SELECTORS.PROPERTY_TITLE).should("have.text", propertyDetails["title"]);
            cy.get(SELECTORS.PROPERTY_SUBTITLE).should("have.text", propertyDetails["subtitle"]);
            cy.get(SELECTORS.PROPERTY_BEDROOMS_COMPONENT).should("have.text", propertyDetails["bedroomsNumber"]);
        });
    }
}

export const propertyListingPage = new PropertyListingPage();
