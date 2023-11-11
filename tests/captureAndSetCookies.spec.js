import { test } from '@playwright/test';
import { chromium } from 'playwright';
import { USERNAME, PASSWORD, BASE_URL, ENTER, ENTERWITHUSERNAME } from '../constants';

test('captureAndSetCookies', async () => {
  let cookies = [];
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await page.getByText(ENTERWITHUSERNAME).click();

    await page.waitForTimeout(5000);

    const pages = context.pages();
    const newPage = pages[1];

    await newPage.fill("#authIdentity-inp", USERNAME);
    await newPage.fill("#authPassword-inp", PASSWORD);

    await newPage.getByRole("button", { name: ENTER }).click();
    await newPage.waitForTimeout(5000);

    // Get cookies from the current context
    cookies = await context.cookies();
    console.log('Cookies after logging in:', cookies);

  } catch (err) {
    await chrome.close();
    throw new Error(err.message);
  }

  return cookies;
});