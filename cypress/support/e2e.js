import "./commands";

Cypress.on("uncaught:exception", (err) => {
    return !err.message.includes("Minified React error #424");
});
