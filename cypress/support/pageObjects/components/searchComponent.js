import { getDateInformation } from "../../utils";
import { i18n } from "../../constants";

const SELECTORS = {
    MAIN_COMPONENT: "#search-tabpanel",
    DESTINATIONS_INPUT: "#bigsearch-query-location-input",
    SUGGESTIONS_COMPONENT: "#bigsearch-query-location-listbox",
    SUGGESTIONS_OPTION: "[id^=bigsearch-query-location-suggestion]",
    MONTHS_CONTAINER: "[id^=panel--tabs]:not([hidden])",
    MONTH_HEADER: "div[data-visible=true] h2",
    MONTH_PANEL: "[aria-label=Calendar] div[data-visible=true]",
    NEXT_MONTH_BUTTON: "button[aria-label^='Move forward']",
    DAY_CONTAINER: "td[aria-disabled=false]",
    SEARCH_CATEGORY_BUTTON: "div[role=button]",
    ADULTS_GUESTS_HEADER: "#searchFlow-title-label-adults",
    CHILDREN_GUESTS_HEADER: "#searchFlow-title-label-children",
    INCREASE_VALUE_BUTTON: "button[aria-label='increase value']",
    ADULTS_STEPPER_COMPONENT: "#stepper-adults",
    CHILDREN_STEPPER_COMPONENT: "#stepper-children",
    GUESTS_VALUE: "div > span[aria-hidden=true]",
    SMALL_SEARCH_COMPONENT: "[aria-labelledby=littleSearchLabel]",
    SMALL_SEARCH_CRITERIA: "button",
};

class SearchComponent {
    checkSearchComponentIsDisplayed() {
        cy.get(SELECTORS.MAIN_COMPONENT).should("be.visible");
    }

    addDestination(text) {
        cy.get(SELECTORS.DESTINATIONS_INPUT).type(text);
        cy.get(SELECTORS.SUGGESTIONS_COMPONENT).should("be.visible");
        cy.contains(SELECTORS.SUGGESTIONS_OPTION, text).click();
    }

    getCheckInButton() {
        return cy.get(SELECTORS.MAIN_COMPONENT).contains(SELECTORS.SEARCH_CATEGORY_BUTTON, i18n.CHECK_IN).scrollIntoView();
    }

    addCheckInDate(date) {
        this.getCheckInButton().then((element) => {
            if (element.attr("aria-expanded") === "false") {
                cy.wrap(element).click();
            }
        });
        cy.get(SELECTORS.MONTHS_CONTAINER).should("be.visible");
        const { day, month, year } = getDateInformation(date);
        this.selectMonthAndYear(month, year).contains(SELECTORS.DAY_CONTAINER, day).click();
    }

    checkCheckInDateIsCorrect(date) {
        const { day, month } = getDateInformation(date, "D-MMM-YYYY");
        this.getCheckInButton().should("have.attr", "aria-expanded", "false").and("contain.text", `${month} ${day}`);
    }

    selectMonthAndYear(month, year) {
        const header = new RegExp(`${month} ${year}`, "i");
        let retries = 20;
        function matchMonth(header) {
            cy.get(SELECTORS.MONTHS_CONTAINER)
                .find(SELECTORS.MONTH_HEADER)
                .first()
                .invoke("text")
                .then((headerText) => {
                    if (!headerText.trim().match(header) && retries > 0) {
                        cy.get(SELECTORS.NEXT_MONTH_BUTTON).click();
                        retries--;
                        cy.wait(500).then(() => {
                            matchMonth(header);
                        });
                    }
                });
        }
        matchMonth(header);
        return cy.contains(SELECTORS.MONTH_PANEL, header).scrollIntoView();
    }

    getCheckOutButton() {
        return cy.get(SELECTORS.MAIN_COMPONENT).contains(SELECTORS.SEARCH_CATEGORY_BUTTON, i18n.CHECK_OUT).scrollIntoView();
    }

    addCheckOutDate(date) {
        this.getCheckOutButton().then((element) => {
            if (element.attr("aria-expanded") === "false") {
                cy.wrap(element).click();
            }
        });
        cy.get(SELECTORS.MONTHS_CONTAINER).should("be.visible");
        const { day, month, year } = getDateInformation(date);
        this.selectMonthAndYear(month, year).contains(SELECTORS.DAY_CONTAINER, day).click();
    }

    checkCheckOutDateIsCorrect(date) {
        const { day, month } = getDateInformation(date, "D-MMM-YYYY");
        this.getCheckOutButton().should("contain.text", `${month} ${day}`);
    }

    getGuestsButton() {
        return cy.get(SELECTORS.MAIN_COMPONENT).contains(SELECTORS.SEARCH_CATEGORY_BUTTON, i18n.ADD_GUESTS).scrollIntoView();
    }

    addGuests() {
        this.getGuestsButton().then((element) => {
            if (element.attr("aria-expanded") === "false") {
                cy.wrap(element).click();
            }
        });
        cy.get(SELECTORS.ADULTS_GUESTS_HEADER).should("be.visible");
    }

    selectAdultsNumber(value) {
        this.selectGuestsNumber(SELECTORS.ADULTS_STEPPER_COMPONENT, value);
    }

    selectChildrenNumber(value) {
        this.selectGuestsNumber(SELECTORS.CHILDREN_STEPPER_COMPONENT, value);
    }

    selectGuestsNumber(selector, value) {
        let count = 0;
        cy.get(selector)
            .find(SELECTORS.INCREASE_VALUE_BUTTON)
            .then((element) => {
                Cypress._.times(value, () => {
                    cy.wrap(element)
                        .click()
                        .then(() => {
                            count++;
                            cy.get(selector).find(SELECTORS.GUESTS_VALUE).should("have.text", count);
                        });
                });
            });
    }

    search() {
        cy.intercept("/api/v3/StaysSearch/*").as("getSearchResults");
        cy.get(SELECTORS.MAIN_COMPONENT).contains("button", i18n.SEARCH).click();
        cy.wait("@getSearchResults").its("response.statusCode").should("equal", 200);
    }

    checkSearchCriteriaAreCorrect(destination, period, guestsNumber) {
        cy.get(SELECTORS.SMALL_SEARCH_COMPONENT).within(() => {
            cy.contains(SELECTORS.SMALL_SEARCH_CRITERIA, i18n.LOCATION).should((element) => {
                expect(destination).to.contain(element.find("div").text());
            });
            cy.contains(SELECTORS.SMALL_SEARCH_CRITERIA, `${i18n.CHECK_IN} / ${i18n.CHECK_OUT}`)
                .find("div")
                .invoke("text")
                .should((text) => {
                    const normalizedText = text.replace(/\u2009/g, " ");
                    expect(normalizedText).to.equal(period);
                });
            cy.contains(SELECTORS.SMALL_SEARCH_CRITERIA, i18n.GUESTS).find("div").should("contain.text", guestsNumber);
        });
    }
}

export const searchComponent = new SearchComponent();
