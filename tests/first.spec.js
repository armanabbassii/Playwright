const playwright = require("playwright");
import { USERNAME,PASSWORD,dev_baseUrl, Enter, EnterWithUsername } from "../constans";

module.exports = {
  async captureAndSetCookies() {
    let cookies = [];
    const chrome = await playwright.chromium.launch({ headless: false });
    const context = await chrome.newContext();
    try {
      const page = await context.newPage();
      await page.goto(dev_baseUrl);
      await page.getByText(EnterWithUsername).click();
      await page.waitForTimeout(5000);

      const pages = context.pages();
      const newPage = pages[1];

      await newPage.type("#authIdentity-inp", USERNAME);
      await newPage.type("#authPassword-inp", PASSWORD);

      await newPage.getByRole("button", { name: Enter }).click();
      await newPage.getByRole("button", { name: Enter }).click();

      await newPage.waitForTimeout(10_000);

      // Get cookies from the current context
      cookies = await page.context().cookies();
      // await chrome.close();
    } catch (err) {
      await chrome.close();
      throw new Error(err.message);
    }

    return cookies;
  },
};