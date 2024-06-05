import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');
  await page.getByRole('link', { name: 'Upload Contacts' }).click();
  await page.getByTestId('baseButton-secondary').click();
  await page.getByTestId('baseButton-secondary').setInputFiles('nskope_first_5_records_refactored_regex.csv');
  await page.getByTestId('stNotification').nth(1).click();
  await page.getByTestId('stNotification').nth(2).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('stDownloadButton').getByTestId('baseButton-secondary').click();
  const download = await downloadPromise;
});