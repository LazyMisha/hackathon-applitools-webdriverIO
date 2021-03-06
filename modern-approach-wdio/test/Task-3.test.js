'use strict';

const url = `https://demo.applitools.com/gridHackathon${process.env.VERSION}.html`;

const { remote } = require('webdriverio');
const {
  VisualGridRunner,
  Eyes,
  Target,
  Configuration,
  RectangleSize,
  BatchInfo,
  BrowserType,
  DeviceName,
  ScreenOrientation,
} = require('@applitools/eyes-webdriverio');

let browser;
let eyes;

describe('Task 3', function () {
  let runner;

  before(async () => {
    const chrome = {
      capabilities: {
        browserName: 'chrome',
      },
      logLevel: 'silent',
    };
    // Create a new chrome web driver
    browser = await remote(chrome);

    // Create a runner with concurrency of 10
    runner = new VisualGridRunner(10);

    // Create Eyes object with the runner, meaning it'll be a Visual Grid eyes.
    eyes = new Eyes(runner);

    // Initialize the eyes configuration
    const configuration = new Configuration();

    // You can get your api key from the Applitools dashboard
    configuration.setApiKey('I6IHp96nah6OiHzMae4FqDveWhY4CrPLcLqJjcBCl54110');

    // create a new batch info instance and set it to the configuration
    configuration.setBatch(new BatchInfo('UFG Hackathon'));

    // Add browsers with different viewports
    configuration.addBrowser(1200, 700, BrowserType.CHROME);
    configuration.addBrowser(1200, 700, BrowserType.FIREFOX);
    configuration.addBrowser(1200, 700, BrowserType.EDGE_CHROMIUM);
    configuration.addBrowser(768, 700, BrowserType.CHROME);
    configuration.addBrowser(768, 700, BrowserType.FIREFOX);
    configuration.addBrowser(768, 700, BrowserType.EDGE_CHROMIUM);

    // Add mobile emulation devices in Portrait mode
    configuration.addDeviceEmulation(
      DeviceName.iPhone_X,
      ScreenOrientation.PORTRAIT
    );

    // Set the configuration to eyes
    eyes.setConfiguration(configuration);
  });

  it('Product Details test', async () => {
    await browser.url(url);

    const blackCheckBox = await browser.$('#SPAN__checkmark__107');
    const filterButton = await browser.$('#filterBtn');
    const firstPairOfShoes = await browser.$('#product_1');

    await blackCheckBox.click();
    await filterButton.click();
    await firstPairOfShoes.click();

    // Call Open on eyes to initialize a test session
    await eyes.open(
      browser,
      'Ultrafast grid gridHackathon',
      'Task 3 - Product Details test',
      new RectangleSize(800, 600)
    );

    await eyes.check(
      'Product Details test',
      Target.window().fully()
    );

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
