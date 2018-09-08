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

    const dueByText = await page.evaluate(
      (DUE_BY) => document.querySelector(DUE_BY).textContent,
      DUE_BY
    );
    const dueBy = new Date(dueByText.trim());

    const billAmountText = await page.evaluate(
      (BILL_AMOUNT) => document.querySelector(BILL_AMOUNT).textContent,
      BILL_AMOUNT
    );
    const billAmount = billAmountText.trim();

    const amountDueText = await page.evaluate(
      (AMOUNT_DUE) => document.querySelector(AMOUNT_DUE).textContent,
      AMOUNT_DUE
    );
    const amountDue = amountDueText.trim();

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
  const url = 'https://mya.dominionenergy.com/usage/analyzeyourenergyusage';
  await page.goto(url);

  
}
