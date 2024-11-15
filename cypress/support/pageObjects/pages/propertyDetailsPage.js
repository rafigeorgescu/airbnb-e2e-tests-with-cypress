import { i18n, PATHS } from "../../constants";

const SELECTORS = {
    MAIN_COMPONENT: "body",
    TITLE: "[data-section-id=TITLE_DEFAULT] h1",
    GUEST_NUMBER_COMPONENT: "[data-section-id=OVERVIEW_DEFAULT_V2] li:first-of-type",
    SHOW_ALL_AMENITIES_BUTTON: "[data-section-id=AMENITIES_DEFAULT] button",
    AMENITIES_MODAL: "div[role=dialog][aria-modal=true]",
    AMENITIES_OPTION: "[id^=pdp_v3_parking_facilities][id$=row-title]",
    TRANSLATION_MODAL: "[aria-label='Translation on']",
    CLOSE_TRANSLATION_MODAL_BUTTON: "[aria-label=Close]",
};

class PropertyDetailsPage {
    checkPageIsDisplayed() {
        cy.url().should("include", PATHS.PROPERTY_DETAILS);
    }

    checkTitleIsCorrect(title) {
        cy.get(SELECTORS.TITLE).should("have.text", title);
    }

    closeTranslationModalIfPresent() {
        cy.wait(5000);
        cy.get(SELECTORS.MAIN_COMPONENT).then((body) => {
            const translationModal = Cypress.$(body).find(SELECTORS.TRANSLATION_MODAL).length;
            if (translationModal) {
                cy.get(SELECTORS.CLOSE_TRANSLATION_MODAL_BUTTON).click();
                cy.get(SELECTORS.TRANSLATION_MODAL).should("not.exist");
            }
        });
    }

    checkMaxNumberOfGuests(expectedGuestsNumber) {
        cy.get(SELECTORS.GUEST_NUMBER_COMPONENT)
            .invoke("text")
            .should((text) => {
                const guestsNumber = Number(text.match(/\d+/g));
                expect(guestsNumber).to.be.gte(expectedGuestsNumber);
            });
    }

    showAllAmenities() {
        cy.get(SELECTORS.SHOW_ALL_AMENITIES_BUTTON).click();
        cy.get(SELECTORS.AMENITIES_MODAL).should("be.visible");
    }

    checkAmenityIsAvailable(amenity) {
        cy.contains(SELECTORS.AMENITIES_OPTION, new RegExp(amenity, "i"))
            .scrollIntoView()
            .should("be.visible")
            .and("not.contain.text", i18n.UNAVAILABLE);
    }
}

export const propertyDetailsPage = new PropertyDetailsPage();
