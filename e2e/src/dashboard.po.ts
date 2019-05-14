import { browser, by, element, protractor, ExpectedConditions } from "protractor";

export class DashboardPage {
  public EC = protractor.ExpectedConditions;
  public newCarsLink = element(by.css("new-cars"));
  constructor() {}

  public async waitUntilLoaded() {
    await browser.wait(this.EC.presenceOf(this.newCarsLink), 5000, 'failed to login');
  }

}
