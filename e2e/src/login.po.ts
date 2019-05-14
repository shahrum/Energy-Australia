import { browser, by, element, protractor } from "protractor";
import { HttpClient } from "@angular/common/http";

export class LoginPage {
  public usernameInput = element(by.css("[placeholder=E-Mail]"));
  public passwordInput = element(by.css("[placeholder=Password]"));
  public loginButton = element(by.css(".login-button"));

  constructor() {}

  public async login(username: string, password?: string) {
    let EC = protractor.ExpectedConditions;
    await browser.wait(EC.presenceOf(this.loginButton), 10000, "salam");
    await this.usernameInput.clear();
    await this.usernameInput.sendKeys(username);
    await this.passwordInput.clear();
    await this.passwordInput.sendKeys(password);
    await browser.wait(EC.elementToBeClickable(this.loginButton), 10000, 'salam2');
    return this.loginButton.click();
  }

  public async checkLoggedOut() {
    let EC = protractor.ExpectedConditions;
    await browser.wait(
      EC.presenceOf(this.passwordInput),
      30000,
      "logout has not redirected to login page"
    );
    expect(this.passwordInput.isPresent()).toEqual(
      true,
      "logout has not redirected to login page"
    );
  }

}
