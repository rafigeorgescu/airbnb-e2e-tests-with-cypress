import { i18n } from "../../constants";

const SELECTORS = {
    MAIN_COMPONENT: "header",
    FILTERS_BUTTON: "button",
    FILTERS_DIALOG: "[aria-label=Filters]",
    BEDROOMS_PANEL: "#stepper-filter-item-min_bedrooms-stepper",
    BEDROOMS_VALUE: "div > div[aria-hidden=true]",
    INCREASE_VALUE_BUTTON: "button[aria-label='increase value']",
    AMENITIES_OPTION: "[id^=filter-item-amenities]",
    APPLY_FILTERS_BUTTON: "footer a",
};

class FiltersComponent {
    openFiltersModal() {
        cy.get(SELECTORS.MAIN_COMPONENT).contains(SELECTORS.FILTERS_BUTTON, i18n.FILTERS).click();
        cy.get(SELECTORS.FILTERS_DIALOG).should("be.visible");
    }

    selectBedroomsNumber(value) {
        cy.get(SELECTORS.BEDROOMS_PANEL)
            .find(SELECTORS.INCREASE_VALUE_BUTTON)
            .then((element) => {
                let count = 0;
                Cypress._.times(value, () => {
                    cy.wrap(element).click();
                    count++;
                    cy.get(SELECTORS.BEDROOMS_PANEL).find(SELECTORS.BEDROOMS_VALUE).should("contain.text", count);
                });
            });
    }

    selectAmenity(amenity) {
        cy.contains(SELECTORS.AMENITIES_OPTION, amenity).click().should("have.attr", "aria-pressed", "true");
    }

    applyFilters() {
        cy.intercept("/api/v3/StaysSearch/*").as("getFilterResults");
        cy.get(SELECTORS.FILTERS_DIALOG)
            .find(SELECTORS.APPLY_FILTERS_BUTTON)
            .should((element) => {
                expect(element.text()).to.match(/Show (\d+) places/);
            });
        cy.get(SELECTORS.FILTERS_DIALOG).find(SELECTORS.APPLY_FILTERS_BUTTON).click();
        cy.get(SELECTORS.FILTERS_DIALOG).should("not.exist");
        cy.wait("@getFilterResults").its("response.statusCode").should("equal", 200);
    }
}

export const filtersComponent = new FiltersComponent();
