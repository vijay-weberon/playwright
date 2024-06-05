import { test, expect } from '@playwright/test';


const path = require('path');
test('uploading correct csv file', async ({ page }) => {
  const filePath = "/Users/Vijay/Downloads/nskope_first_5_records_refactored_regex.csv"

  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');

  await page.getByRole('link', { name: 'Upload Contacts' }).click();
  await page.locator('[data-testid="stFileUploaderDropzoneInput"]').setInputFiles(filePath);

})