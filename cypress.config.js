const { defineConfig } = require("cypress");
const { afterRunHook } = require("cypress-mochawesome-reporter/lib");
const path = require("path");
const exec = require("child_process").execSync;

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            require("cypress-mochawesome-reporter/plugin")(on);

            /**
             * Creates the XML report by merging all the junit reports created for each spec at runtime.
             */
            on("after:run", async () => {
                console.log(`Read and merge XMLs from "${path.resolve("cypress/results/junit")}"`);
                await exec("jrm cypress/results/junitreport.xml cypress/results/junit/*.xml");
                await afterRunHook();
            });

            /**
             * Sets the configuration file based on the environment sent from the command line
             * If no configuration fileName is sent, then it will set "dev" as configuration file
             * @param {string} file
             */
            const getConfigurationByFile = (file) => {
                const pathToConfigFile = path.resolve("cypress/config", `${file}.json`);

                return require(pathToConfigFile);
            };

            const fileName = config.env.configFile || "dev";
            return getConfigurationByFile(fileName);
        },
        watchForFileChanges: false,
        viewportWidth: 1920,
        viewportHeight: 1080,
        defaultCommandTimeout: 10000,
        execTimeout: 30000,
        pageLoadTimeout: 30000,
        requestTimeout: 15000,
        responseTimeout: 15000,
        video: true,
        scrollBehavior: "center",
        reporter: "cypress-multi-reporters",
        reporterOptions: {
            reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
            cypressMochawesomeReporterReporterOptions: {
                reportDir: "cypress/results",
                charts: true,
                reportPageTitle: "Airbnb e2e Cypress Report",
                embeddedScreenshots: true,
                inlineAssets: true,
            },
            mochaJunitReporterReporterOptions: {
                mochaFile: "cypress/results/junit/results-[hash].xml",
            },
            video: false,
        },
        experimentalRunAllSpecs: true,
    },
});
