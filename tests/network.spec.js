const { chromium } = require('playwright');
import test from '@playwright/test';

test('checking for network traffic', async ({}) => {
  // Launch the browser
  const browser = await chromium.launch();

  // Create a new browser context with network emulation enabled
  const context = await browser.newContext({
    recordHar: { path: 'request_waterfall.har' } // Specify the path where the HAR file will be saved
  });

 // Create a page within the context
  const page = await context.newPage();

  // Navigate to the URL
  await page.goto('https://developer16.prsnl.ink/wB41xWUL?verify=1719579400-Oz%2BsyQDlFxQHVsDPZg8HufQWA1UVtR5AAn47uRT6o6U%3D');

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(5000)
  // Close the page and context
  await page.close();
  await context.close();

  // Close the browser
  await browser.close();
})
