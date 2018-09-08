
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const getTextContent = (el) => el.textContent;

const getTextFromSelectors = async (page, selectors) => {
  let text = {};
  const keys = Object.keys(selectors);
  const sels = keys.map(key => selectors[key]); 
  await asyncForEach(sels, async (selector, index) => {
    const handle = await page.$(selector);
    text[keys[index]] = await page.evaluate(getTextContent, handle);
  });
  return text;
}

module.exports = {
  asyncForEach,
  getTextContent,
  getTextFromSelectors,
}