import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://traqr-demo.weberon.org/?s=NPLB');
  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.getByLabel('Enter the name for the campaign').click();
  await page.getByLabel('Enter the name for the campaign').fill('test1');
  await page.getByLabel('Enter the URL value to redirect the user to').click();
  await page.getByLabel('Enter the URL value to redirect the user to').fill('https://www.google.com');
  await page.getByLabel('Enter the URL value to redirect the user to').press('Enter');
  // await page.getByTestId('baseButton-secondary').click();
  // await page.getByText('A campaign for test1 was').click();
});