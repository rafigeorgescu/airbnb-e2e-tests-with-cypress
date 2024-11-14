const SELECTORS = {
    TITLE: "[data-section-id=TITLE_DEFAULT] h1",
    GUEST_NUMBER_COMPONENT: "[data-section-id=OVERVIEW_DEFAULT_V2] li:first-of-type",
};

class PropertyDetailsPage {
    checkTitleIsCorrect(title) {
        cy.get(SELECTORS.TITLE).should("have.text", title);
    }

    checkMaxNumberOfGuests(expectedGuestsNumber) {
        cy.get(SELECTORS.GUEST_NUMBER_COMPONENT)
            .invoke("text")
            .should((text) => {
                const guestsNumber = Number(text.match(/\d+/g));
                expect(guestsNumber).to.be.gte(expectedGuestsNumber);
            });
    }
}

export const propertyDetailsPage = new PropertyDetailsPage();
