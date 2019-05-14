import { browser, by, element } from "protractor";
import { LoginPage } from "./login.po";
import { DashboardPage } from './dashboard.po';

let using = require("jasmine-data-provider");
let user1 = browser.params.user1[0];

describe("login using email", () => {

  let loginPagePo: LoginPage;
  let dashboardPage: DashboardPage;
  let users = {
    user: { user: user1.email, password: user1.password }
  };

  beforeEach(async () => {
    loginPagePo = new LoginPage();
    dashboardPage = new DashboardPage();
  });

  afterEach(async () => {
  });

  using(users, function(data, description) {
    it("login using email and should see welcome and login messages" + " " + data.jiralinks + " " + description, async () => {
      await browser.get('http://localhost:4200/auth/login', 30000);
      await loginPagePo.login(data.user, data.password);
      await dashboardPage.waitUntilLoaded();
    });
  });

});
