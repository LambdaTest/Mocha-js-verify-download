var assert = require("assert"),
  webdriver = require("selenium-webdriver"),
  conf_file = process.argv[3] || "conf/single.conf.js";

var caps = require("../" + conf_file).capabilities;

var buildDriver = function(caps) {
  return new webdriver.Builder()
    .usingServer(
      "http://" +
      LT_USERNAME +
      ":" +
      LT_ACCESS_KEY +
      "@hub.lambdatest.com/wd/hub"
    )
    .withCapabilities(caps)
    .build();
};

describe("Mocha Todo Test " + caps.browserName, function() {
  var driver;
  this.timeout(0);

  beforeEach(function(done) {
    caps.name = this.currentTest.title;
    driver = buildDriver(caps);
    done();
  });

    it("verify download", function(done) {
        driver.get("'https://chromedriver.storage.googleapis.com/index.html?path=79.0.3945.36/'").then(function() {
            driver.findElement(webdriver.By.xpath('/html/body/table/tbody/tr[]/td[2]/a')).click().then(function(){  
                if (driver.executeScript("lambda-file-exists=chromedriver_win32.zip")){
                    driver.executeScript("lambda-status=passed");
                }
                else
                {
                    driver.executeScript("lambda-status=failed");
                } 
            });
        });
    });

  afterEach(function(done) {
    if (this.currentTest.isPassed()) {
      driver.executeScript("lambda-status=passed");
    } else {
      driver.executeScript("lambda-status=failed");
    }
    driver.quit().then(function() {
      done();
    });
  });
});
