const { user, password } = require('./secrets.json');

console.log({ user });
console.log({ password });

const puppeteer = require('puppeteer');

// Need to collect:
// usage (kWh),
// bill amount ($),
// service start date,
// service end date (a.k.a. meter read dates),
// and bill due date

(async () => {
  const browser = await puppeteer.launch();

  try {
    let response;
    const page = await LogIn(browser);

    if (!page) {
      throw new Error('No Page');
    }

    response = await scrapeHome(page);
    if (response.error) {
      throw new Error(error);
    }

    console.log(response);
    const {
      dueBy,
      billAmount,
      amountDue,
    } = response;

    response = await scrapePastBill(page);

  } catch (e) {
    console.log('error somewhere');
    console.log(e);
  }

  await browser.close();
})();

async function LogIn(browser) {
  try {
    const page = await browser.newPage();
    await page.goto('https://www.dominionenergy.com/sign-in');

    await page.click('#user');
    await page.keyboard.type(user);

    await page.click('#password');
    await page.keyboard.type(password);

    const navigate = page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    page.click('#SignIn');

    console.log('waiting for navigation');
    await navigate;

    return page;
  } catch (e) {
    console.log('error with log in');
    console.log(e);
    return false;
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const getTextContent = (el) => el.textContent;

async function scrapeHome(page) {
  try {
    console.log('scrapeHome');

    const DUE_BY =
      '#homepageContent > div:nth-child(3) > div.col-md-6.col-sm-6.col-xs-12 > p > span.bodyTextGreen';
    const BILL_AMOUNT =
      '#homepageContent > div:nth-child(7) > div:nth-child(2) > p';
    const AMOUNT_DUE =
      '#homepageContent > div:nth-child(3) > div:nth-child(2) > p > span';

    await page.waitForSelector(DUE_BY);
    await page.waitForSelector(BILL_AMOUNT);
    await page.waitForSelector(AMOUNT_DUE);
    console.log('home ready');

    const selectors = [DUE_BY, BILL_AMOUNT, AMOUNT_DUE];

    let text = [];
    await asyncForEach(selectors, async (selector, index) => {
      const handle = await page.$(selector);
      text[index] = await page.evaluate(getTextContent, handle);
    });

    const dueBy = new Date(text[0].trim());
    const billAmount = text[1].trim();
    const amountDue = text[2].trim();

    return {
      dueBy,
      billAmount,
      amountDue,
    };
  } catch (error) {
    console.log('error with scrape home');
    console.log(error);
    return { error };
  }
}

async function scrapePastBill(page) {
  try {
    const url = 'https://mya.dominionenergy.com/usage/analyzeyourenergyusage';
    await page.goto(url);

    LAST_READ = '#paymentsTable > tbody > tr:nth-child(2) > td:nth-child(1)';
    LAST_USAGE = '#paymentsTable > tbody > tr:nth-child(2) > td:nth-child(3)';
    PREV_READ = '#paymentsTable > tbody > tr:nth-child(3) > td:nth-child(1)';

    await page.waitForSelector(LAST_READ);
    await page.waitForSelector(LAST_USAGE);
    await page.waitForSelector(PREV_READ);
    console.log('past bill ready');

  } catch (error) {
    console.log('error with scrape past bill');
    console.log(error);
    return { error };
  }
}
