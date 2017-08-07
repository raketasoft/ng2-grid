import { browser, by, element } from 'protractor';

describe('Demo E2E Tests', function () {

  let expectedMsg = 'Demo';

  beforeEach(function () {
    browser.get('');
  });

  it('should display: ' + expectedMsg, async () => {
    let headerText = await element(by.css('h1')).getText();
    expect(headerText).toEqual(expectedMsg);
  });

});
