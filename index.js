const puppeteer = require('puppeteer');
const { scrapeHome, scrapePastBill } = require('./scrape');
const { login } = require('./login');

const showBrowser = !!process.argv[2];
const options = showBrowser
  ? {
      headless: false,
      slowMo: 1,
    }
  : {};

// Need to collect:
// usage (kWh),
// bill amount ($),
// service start date,
// service end date (a.k.a. meter read dates),
// and bill due date

const init = async () => {
  const browser = await puppeteer.launch(options);

  try {
    let response;

    const page = await browser.newPage();
    await page.goto('https://www.dominionenergy.com/sign-in');

    response = await login(page);
    if (response.error) {
      throw new Error(response.error);
    }

    response = await scrapeHome(page);
    if (response.error) {
      throw new Error(response.error);
    }
    const { dueBy, billAmount, amountDue } = response;

    const url = 'https://mya.dominionenergy.com/usage/analyzeyourenergyusage';
    await page.goto(url);

    response = await scrapePastBill(page);
    if (response.error) {
      throw new Error(response.error);
    }
    const { lastRead, lastUsage, prevRead } = response;

    console.log({
      amountDue,
      billAmount,
      dueBy,
      lastUsage,
      lastRead,
      prevRead,
    });
    console.log('DONE!');
  } catch (e) {
    console.log('error somewhere');
    console.log(e);
  }

  await browser.close();
};

init();
