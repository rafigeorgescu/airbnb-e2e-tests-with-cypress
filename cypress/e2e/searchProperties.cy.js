import { homePage } from "../support/pageObjects/pages/homePage";
import { searchComponent } from "../support/pageObjects/components/searchComponent";
import { propertyListingPage } from "../support/pageObjects/pages/propertyListingPage";
import { propertyDetailsPage } from "../support/pageObjects/pages/propertyDetailsPage";
import { filtersComponent } from "../support/pageObjects/components/filtersComponent";
import { calculatePeriod, getFutureDate } from "../support/utils";

describe("Search criteria", () => {
    const destination = "Rome, Italy";
    const checkInDate = getFutureDate("1", "week");
    const checkOutDate = getFutureDate("1", "week", checkInDate);
    const period = calculatePeriod(checkInDate, checkOutDate);
    const guests = {
        adults: 2,
        children: 1,
    };
    const bedrooms = 5;
    const amenity = "Pool";

    it("Verify that the results match the search criteria", () => {
        homePage.load();
        searchComponent.checkSearchComponentIsDisplayed();
        searchComponent.addDestination(destination);
        searchComponent.addCheckInDate(checkInDate);
        searchComponent.checkCheckInDateIsCorrect(checkInDate);
        searchComponent.addCheckOutDate(checkOutDate);
        searchComponent.checkCheckOutDateIsCorrect(checkOutDate);
        searchComponent.addGuests();
        searchComponent.selectAdultsNumber(guests.adults);
        searchComponent.selectChildrenNumber(guests.children);

        searchComponent.search();
        searchComponent.checkSearchCriteriaAreCorrect(destination, period, guests.adults + guests.children);
        propertyListingPage.checkPageIsDisplayed();
        propertyListingPage.checkPropertiesAreDisplayed();
        Cypress._.times(5, () => {
            propertyListingPage.openRandomProperty().then((subtitle) => {
                propertyDetailsPage.checkPageIsDisplayed();
                propertyDetailsPage.checkTitleIsCorrect(subtitle);
            });
            propertyDetailsPage.checkMaxNumberOfGuests(guests.adults + guests.children);
            cy.go("back");
            propertyListingPage.checkPropertiesAreDisplayed();
        });
    });

    it("Verify that the results and details page match the extra filters", () => {
        //changed the date because Pool facility is not available for the available properties
        const newCheckoutDate = getFutureDate("2", "week", checkInDate);
        const newPeriod = calculatePeriod(checkInDate, newCheckoutDate);
        homePage.load();
        searchComponent.checkSearchComponentIsDisplayed();
        searchComponent.addDestination(destination);
        searchComponent.addCheckInDate(checkInDate);
        searchComponent.addCheckOutDate(newCheckoutDate);
        searchComponent.addGuests();
        searchComponent.selectAdultsNumber(guests.adults);
        searchComponent.selectChildrenNumber(guests.children);
        searchComponent.search();
        searchComponent.checkSearchCriteriaAreCorrect(destination, newPeriod, guests.adults + guests.children);
        propertyListingPage.checkPageIsDisplayed();
        propertyListingPage.checkPropertiesAreDisplayed();
        filtersComponent.openFiltersModal();
        filtersComponent.selectBedroomsNumber(bedrooms);
        filtersComponent.selectAmenity(amenity);
        filtersComponent.applyFilters();
        propertyListingPage.checkPropertiesAreDisplayed();
        propertyListingPage.checkMaxNumberOfBedrooms(bedrooms);
        propertyListingPage.openFirstProperty().then((subtitle) => {
            propertyDetailsPage.checkPageIsDisplayed();
            propertyDetailsPage.checkTitleIsCorrect(subtitle);
        });
        propertyDetailsPage.closeTranslationModalIfPresent();
        propertyDetailsPage.showAllAmenities();
        propertyDetailsPage.checkAmenityIsAvailable(amenity);
    });

    it("Verify that a property is displayed on the map correctly", () => {
        homePage.load();
        searchComponent.checkSearchComponentIsDisplayed();
        searchComponent.addDestination(destination);
        searchComponent.addCheckInDate(checkInDate);
        searchComponent.addCheckOutDate(checkOutDate);
        searchComponent.addGuests();
        searchComponent.selectAdultsNumber(guests.adults);
        searchComponent.selectChildrenNumber(guests.children);
        searchComponent.search();
        searchComponent.checkSearchCriteriaAreCorrect(destination, period, guests.adults + guests.children);
        propertyListingPage.checkPageIsDisplayed();
        propertyListingPage.checkPropertiesAreDisplayed();
        propertyListingPage.checkPinsAreNotHighlighted();
        propertyListingPage.hoverOnFirstProperty().then((propertyDetails) => {
            propertyListingPage.checkMapPinIsHighlighted(propertyDetails["title"]);
            propertyListingPage.showPropertyDetailsOnMap(propertyDetails["title"]);
            propertyListingPage.checkPropertyDetailsAreCorrect(propertyDetails);
        });
    });
});
