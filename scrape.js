const {
  asyncForEach,
  getTextContent,
  getTextFromSelectors
} = require('./utils');

const scrapeHome = async (page) => {
  try {
    const DUE_BY =
      '#homepageContent > div:nth-child(3) > div.col-md-6.col-sm-6.col-xs-12 > p > span.bodyTextGreen';
    const BILL_AMOUNT =
      '#homepageContent > div:nth-child(7) > div:nth-child(2) > p';
    const AMOUNT_DUE =
      '#homepageContent > div:nth-child(3) > div:nth-child(2) > p > span';

    await page.waitForSelector(DUE_BY);
    await page.waitForSelector(BILL_AMOUNT);
    await page.waitForSelector(AMOUNT_DUE);

    const selectors = {
      dueBy: DUE_BY,
      billAmount: BILL_AMOUNT,
      amountDue: AMOUNT_DUE
    };
    const text = await getTextFromSelectors(page, selectors);

    const dueBy = new Date(text.dueBy.trim());
    const billAmount = text.billAmount.trim();
    const amountDue = text.amountDue.trim();

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

const scrapePastBill = async (page) => {
  try {
    LAST_READ = '#paymentsTable > tbody > tr:nth-child(2) > td:nth-child(1)';
    LAST_USAGE = '#paymentsTable > tbody > tr:nth-child(2) > td:nth-child(3)';
    PREV_READ = '#paymentsTable > tbody > tr:nth-child(3) > td:nth-child(1)';

    await page.waitForSelector(LAST_READ);
    await page.waitForSelector(LAST_USAGE);
    await page.waitForSelector(PREV_READ);

    const selectors = {
      lastRead: LAST_READ,
      lastUsage: LAST_USAGE,
      prevRead: PREV_READ,
    };
    const text = await getTextFromSelectors(page, selectors);

    const lastRead = new Date(text.lastRead.trim());
    const lastUsage = text.lastUsage.trim();
    const prevRead = new Date(text.prevRead.trim());

    return {
      lastRead,
      lastUsage,
      prevRead
    };

  } catch (error) {
    console.log('error with scrape past bill');
    console.log(error);
    return { error };
  }
}

module.exports = {
  scrapeHome,
  scrapePastBill
}
