import { homePage } from "../support/pageObjects/pages/homePage";
import { searchComponent } from "../support/pageObjects/components/searchComponent";
import { calculatePeriod, getFutureDate } from "../support/utils";
import { propertyListingPage } from "../support/pageObjects/pages/propertyListingPage";
import { propertyDetailsPage } from "../support/pageObjects/pages/propertyDetailsPage";

describe("Search criteria", () => {
    const destination = "Rome, Italy";
    const checkInDate = getFutureDate("1", "month");
    const checkOutDate = getFutureDate("3", "week", checkInDate);
    const period = calculatePeriod(checkInDate, checkOutDate);
    const guests = {
        adults: 2,
        children: 1,
    };

    it("Verify that the results match the search criteria", () => {
        cy.intercept("/api/v2/user_markets*").as("getUserMarkets");
        homePage.load();
        cy.wait("@getUserMarkets").its("response.statusCode").should("equal", 200);
        cy.get("@getUserMarkets").then((interception) => {
            console.log(interception.response.body);
        });
        searchComponent.checkSearchComponentIsDisplayed();
        searchComponent.addDestination(destination);
        searchComponent.addCheckInDate(checkInDate);
        searchComponent.checkCheckInDateIsCorrect(checkInDate);
        searchComponent.addCheckOutDate(checkOutDate);
        searchComponent.checkCheckOutDateIsCorrect(checkOutDate);
        searchComponent.addGuests();
        searchComponent.selectAdultsNumber(guests.adults);
        searchComponent.selectChildrenNumber(guests.children);
        cy.intercept("/api/v3/StaysSearch/*").as("getSearchResults");
        searchComponent.search();
        cy.wait("@getSearchResults").its("response.statusCode").should("equal", 200);
        searchComponent.checkSearchCriteriaAreCorrect(destination, period, guests.adults + guests.children);
        propertyListingPage.checkPropertiesAreDisplayed();
        Cypress._.times(5, () => {
            propertyListingPage.openRandomProperty().then((subtitle) => {
                propertyDetailsPage.checkTitleIsCorrect(subtitle);
            });
            propertyDetailsPage.checkMaxNumberOfGuests(guests.adults + guests.children);
            cy.go("back");
            propertyListingPage.checkPropertiesAreDisplayed();
        });
    });
});
