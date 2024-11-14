# airbnb-e2e-tests-with-cypress

### Prerequisites

- Download and install Node.js v18 or newer: https://nodejs.org/en/download/
- Set PATH variables
- Download and install Git: https://git-scm.com/downloads
---
### Installing

- Clone repository
- Install dependencies
```sh
  npm install
```
---
### Naming Conventions

Test file name and location
cypress/e2e/*.cy.js
e.g. cypress/e2e/login.cy.js

Page file name and location
cypress/support/pageObjects/pages/*Page.js
e.g. cypress/support/pageObjects/pages/LoginPage.js

---
### Open test runner
```sh
  npx cypress open
```
or
```sh
  npm run open
```

Open test runner on a specific environment (e.g. prod)

```sh
  npx cypress open --env configFile=prod
```
or
```sh
  npm run open -- --env configFile=prod
```

### Running Tests from Terminal

Run all tests in default browser (electron)

```sh
  npm run test
```
Run all tests in a specific browser (e.g., chrome, firefox, edge)

```sh
  npm run test -- --browser=chrome
```
Run all tests on a specific environment (e.g., dev, prod)

```sh
  npm run test -- --env configFile=dev
```
or
```sh
  npm run test-prod
```
Run all tests on a specific environment and browser
```sh
  npm run test -- --env configFile=prod --browser firefox
```
or
```sh
  npm run test-prod -- --browser chrome
```
Run a test on a specific environment and browser
```sh
  npm run test -- --env configFile=prod --browser chrome --spec cypress/e2e/**/<specName>.cy.js
```
or
```sh
  npm run test-dev -- --browser edge --spec cypress/e2e/**/<specName>.cy.js
```
---
### Reporting

Two different types of reporters were configured, Mochawesome for HTML reports and JUnit for XML results.

