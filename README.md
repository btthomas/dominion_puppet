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
```
node index.js [showBrowser]
```

There is one optional command line argument. If you include *any* argument, puppeter will NOT run in headless mode and you will be able to see the scraping happen live.  

## Tests
Tests are run using jest
```
npm test
```
