import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://traqr-demo.weberon.org/?s=4UTG');
//   await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
//   await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: 'test5' }).click();
//   await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: 'campaign-01' }).click();
//   await page.locator('pre').click();
// });


test('test', async ({ page }) => {


  // Navigate to the Streamlit app
  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');  // Update with your Streamlit app URL

  await page.getByRole('link', { name: 'Campaign Dashboard' }).click();


  // Wait for the table to be rendered
  await page.waitForSelector('table');

  // Locate the table
  const table = await page.$('table');

  // Get all rows of the table
  const rows = await table.$$('tr');

  // Iterate through the rows and print their text content
  for (let i = 0; i < rows.length; i++) {
    const cells = await rows[i].$$('td');
    const cellTexts = await Promise.all(cells.map(cell => cell.innerText()));
    console.log(`Row ${i}: ${cellTexts.join(', ')}`);
  }

  // Example assertion to check specific cell content
  const firstCellText = await rows[1].$$('td')[0].innerText();
  if (firstCellText !== 'Expected Value') {
    console.error(`Test failed: Expected 'Expected Value' but got '${firstCellText}'`);
  } else {
    console.log('Test passed: First cell content is correct.');
  }

  // Close the browser
  await browser.close();
})
