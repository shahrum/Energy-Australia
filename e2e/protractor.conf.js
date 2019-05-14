require("ts-node/register");
var jasmineReporters = require("jasmine-reporters");
var HtmlReporter = require("protractor-beautiful-reporter"); // The collection of results currently assumes only one continuous run.

exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  // needed for stability issues when using async and await according to https://www.protractortest.org/#/async-await
  // but all e2e tests not using await will fail unless you set

  baseUrl: "http://localhost:4200/auth/login",

  //https://github.com/angular/protractor/blob/master/docs/timeouts.md
  getPageTimeout: 30000,

  exclude: [],

  suites: {
    login: ["./src/login.e2e.ts"],

  },


  framework: "jasmine2",
  directConnect: true,
  capabilities: {
    browserName: "chrome",
    // chromeOptions: {
    //   args: ["--headless", "--incognito", "--start-maximized", "--window-size=1280,1696"]
    // },
  },

  allScriptsTimeout: 600000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: true,
    defaultTimeoutInterval: 600000
  },


  params: {
    root: "/",
    user1: [
      {
        userid: "Shha268@gmail.com",
        email: "Shha268@gmail.com",
        password: "123456"
      },

    ]
  },

  // runs x1 and and before onPrepare
  beforeLaunch: function() {
    const fse = require("fs-extra");
    let testdir = "./test";
    let screenshotdir = "./test/e2e/screenshots";
    try {
      fse.removeSync(testdir); // remove all files in / test dir
      console.log("success!");
    } catch (err) {
      console.error(err);
    }

    try {
      fse.mkdirpSync(testdir);
      console.log("success! " + testdir);
    } catch (err) {
      console.error(err);
    }

    try {
      fse.mkdirpSync(screenshotdir);
      console.log("success! " + screenshotdir);
    } catch (err) {
      console.error(err);
    }
  },

  onPrepare: function() {
    require("ts-node").register({
      project: "e2e/tsconfig.e2e.json"
    });

    // see https://github.com/larrymyers/jasmine-reporters
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: false, // sep xml file per spec file ( do not use true if shard )
        savePath: "test",
        // NOTE without prefix file pattern is junitresults-specname.xml
        filePrefix: (new Date().getTime()) + "_" // i.e. timestamp + _ + spec name + xml ( see consolidateAll )
      })
    );

    // HACK to access currentSpec description in afterEach ( Jasmine 2.0 vs Jasmine 1.0 )
    jasmine.getEnv().addReporter({
      specStarted(result) {
        jasmine.getEnv().currentSpec = result;
      },
      specDone() {
        jasmine.getEnv().currentSpec = null;
      }
    });

    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "test/e2e",
        preserveDirectory: true, // if false this would delete any dirs setup in beforeLaunch
        screenshotsSubfolder: "images",
        cleanDestination: false
      }).getJasmine2Reporter()
    );

    browser.driver
      .manage()
      .window()
      .maximize();
  },

  // run x1 see oncleanup-vs-oncomplete-vs-afterlaunch
  afterLaunch: function(exitCode) {
    // TODO if not using a reporter that supports shard out of the box  ( e.g. pretty html reporter )
    // then here is where 1. merge junit files into a single xml file 2. run reporter gen with file as input
  }
};

