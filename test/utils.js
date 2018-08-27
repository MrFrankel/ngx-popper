module.exports = {
  curPage: {},
  getPopperText: async (page, parent) => {
    let popper = await page.$(parent || 'popper-content');
    let popperInner = await popper.$('.ngxp__inner');
    let popperText = await popperInner.getProperty('innerText');
    return await popperText.jsonValue();
  },
  getPopperBoundingBox: async (page, parent) => {
    let popper = await page.$(parent || 'popper-content');
    let popperContainer = await popper.$('.ngxp__container');
    return await popperContainer.boundingBox();
  },
  getTargetBoundingBox: async (page) => {
    let popperTarget = await page.$('.popperTarget');
    return await popperTarget.boundingBox();
  },
  pause: async (page) => {
    jest.setTimeout(500000);
    return await page.evaluate(() => {
      debugger;
    });
  }

};