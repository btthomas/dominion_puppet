# Scraping Dominion Energy Bills
This app can log in to dominionenergy.com and will collect the following datums:
- Amount Due
- Current Bill Amount
- Current Bill Due Date
- Current Bill Usage
- Current Bill's Meter Read Date
- Previous Bill's Meter Read Date

## Installation
This app works with node version 10.7 and npm version 6.1
```
git clone
```
```
npm i
```

## Usage
Put credentials in secrets.json in the following format:
```json
{
  "user": "example",
  "password": "example"
}
```
```
node index.js [showBrowser]
```

There is one optional command line argument. If you include *any* argument, puppeter will NOT run in headless mode and you will be able to see the scraping happen live.  

## Tests
Tests are run using jest
```
npm test
```

## Documentation

### index.js

This is the main.

#### init
This script launches puppeteer and drives the scraper to the correct pages.

### login.js

#### login
This function logs into Dominion Energy's website with the credentials stored in secrets.json

### scrape.js 

#### scrapeHome
This function scrapes the user's Dominion Energy home page to collect three data points:
- Bill Amount
- Amount Due
- Due By Date

#### scrapePastBill
This function scrapes the user's past bills to collect three data points:
- Usage (kWh)
- Last Meter Read Date
- Previous Meter Read Date

### utils

#### asyncForEach(array, callback)
This function awaits the callback for each (value, index) of an array

#### getTextContent(element)
This function extracts the text content of a DOM element

#### getTextFromSelectors(page, selectors)
This function uses the puppeteer page API to scrape a page for given selectors.
selectors has the following shape:
```javascript
{
  mySelectorName: '#my-selector'
}
```
It will return an object of the same shape as selectors. The keys of the object will be the same. The value of each key will be text content of the first DOM node that matches the selector.

### secrets.json

Store the credentials here in the following format:
```json
{
  "user": "example",
  "password": "example"
}
```