const {
  asyncForEach,
  getTextContent,
  getTextFromSelectors,
} = require('./utils');

describe('utils', () => {
  let mockFn;
  beforeEach(() => {
    mockFn = jest.fn();
  });

  describe('asyncForEach', () => {
    let callback;
    beforeEach(() => {
      callback = async (value, index, array) => {
        return new Promise((res, rej) => {
          mockFn(value * 2);
          res();
        });
      };
    });

    it('iterates asynchronously', async () => {
      const array = [0, 1, 2];

      await asyncForEach(array, callback);

      expect(mockFn.mock.calls.length).toBe(3);
      expect(mockFn.mock.calls[0][0]).toBe(0);
      expect(mockFn.mock.calls[1][0]).toBe(2);
      expect(mockFn.mock.calls[2][0]).toBe(4);
    });

    it("doesn't iterate when there is no array", async () => {
      const array = [];

      await asyncForEach(array, callback);
      expect(mockFn.mock.calls.length).toBe(0);
    });
  });

  describe('getTextContent', () => {
    it('gets Text Content', () => {
      const el = {
        textContent: 'TEXT_CONTENT',
      };
      expect(getTextContent(el)).toBe('TEXT_CONTENT');
    });

    it('returns undefined for empty object', () => {
      const el = {};
      expect(getTextContent(el)).toBeUndefined();
    });
  });

  describe('getTextFromSelectors', () => {
    // mock page
    let page;
    beforeEach(() => {
      page = {
        $: async selector => {
          return {
            textContent: `${selector}-text`,
          };
        },
        evaluate: async (func, handle) => {
          return func(handle);
        },
      };
    });

    it('gets text content from a few selectors', async () => {
      const selectors = {
        mySelector: '#my-selector',
      };

      const text = await getTextFromSelectors(page, selectors);

      expect(text).toEqual({
        mySelector: '#my-selector-text',
      });
    });
  });
});
