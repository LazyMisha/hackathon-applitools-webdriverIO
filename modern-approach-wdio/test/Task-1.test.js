'use strict';

const url = 'https://demo.applitools.com/' + process.env.VERSION;

const {remote} = require('webdriverio');
const {
    VisualGridRunner,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo,
    BrowserType,
    DeviceName,
    ScreenOrientation
} = require('@applitools/eyes-webdriverio');

let browser;
let eyes;

describe('Task 1 – Cross-Device Elements Test', function () {
    let runner;

    before(async () => {
        const chrome = {
            capabilities: {
                browserName: 'chrome'
            },
            logLevel: 'silent',
        };
        // Create a new chrome web driver
        browser = await remote(chrome);

        // Create a runner with concurrency of 1
        runner = new VisualGridRunner(1);

        // Create Eyes object with the runner, meaning it'll be a Visual Grid eyes.
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        const configuration = new Configuration();

        // You can get your api key from the Applitools dashboard
        configuration.setApiKey('I6IHp96nah6OiHzMae4FqDveWhY4CrPLcLqJjcBCl54110');

        // create a new batch info instance and set it to the configuration
        configuration.setBatch(new BatchInfo('Ultrafast Batch'));

        // Add browsers with different viewports
        configuration.addBrowser(800, 600, BrowserType.CHROME);
        configuration.addBrowser(700, 500, BrowserType.FIREFOX);
        configuration.addBrowser(1600, 1200, BrowserType.IE_11);
        configuration.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
        configuration.addBrowser(800, 600, BrowserType.SAFARI);

        // Add mobile emulation devices in Portrait mode
        configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
        configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);

        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });


    it('Search input field should be displayed', async () => {

        await browser.url(url);

        // Call Open on eyes to initialize a test session
        await eyes.open(browser, 'gridHackathonV1', 'Ultrafast grid gridHackathonV1', new RectangleSize(800, 600));

        // check the page with fluent api, see more info here
        // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html
        await eyes.check('Search input field should be displayed', Target.window().fully());

        // Call Close on eyes to let the server know it should display the results
        await eyes.closeAsync();
    });

    after(async () => {
        // Close the browser
        await browser.deleteSession();

        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abortAsync();

        // we pass false to this method to suppress the exception that is thrown if we
        // find visual differences
        const results = await runner.getAllTestResults(false);
        console.log(results);
    });

});