import { test, expect } from '@playwright/test';

const URL = "https://traqr-demo.weberon.org/?s=4UTG"

test('uploading csv file with all mandatory fields', async ({ page }) => {
  const filePath = "/vijay/playwright/Assests/nskope_records_with_all_mandatory_fields.csv";
  const expectedCSVUploadMsg = "CSV uploaded successfully!";
  const expectedAPIResponseMsg = "Data fetched from API successfully!";
  const expectedDownloadBtnText = "Download CSV and QR Codes";

  await page.goto(URL);

  await page.getByRole('link', { name: 'Upload Contacts' }).click();
  await page.locator('[data-testid="stFileUploaderDropzoneInput"]').setInputFiles(filePath);

  await page.waitForTimeout(8000);
  // checking for csv uplaod success message
 const CSVUploadMsg = await page.evaluate(() => {
  const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
  if (containers.length >= 15) {
    const pTag = containers[14].querySelector('p');
    return pTag ? pTag.textContent : null;
  }
  return null;
});
expect(CSVUploadMsg).toBe(expectedCSVUploadMsg)


// checking for API response sucess message
const APIResponseMsg = await page.evaluate(() => {
  const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
  if (containers.length >= 15) {
    const pTag = containers[16].querySelector('p');
    return pTag ? pTag.textContent : null;
  }
  return null;
});
expect(APIResponseMsg).toBe(expectedAPIResponseMsg)



const DownloadBtn = await page.getByTestId('stDownloadButton').getByTestId('baseButton-secondary')
const DownloadBtnContent = await DownloadBtn.textContent()
expect(DownloadBtnContent).toBe(expectedDownloadBtnText)

})

const mandatoryFields = [
  'envelope_name',
  'greeting_name',
  'ma-addr_line1',
  'ma-city',
  'ma-state',
  'ma-zip'
];
mandatoryFields.forEach((field) => {
test(`uploading csv file without mandatory field: ${field}`, async ({ page }) => {
 
  const filePath = `/vijay/playwright/Assests/nskope_records_without_${field}.csv`;
  const expectedCSVUploadMsg = "CSV uploaded successfully!";
  const expectedAPIResponseMsg = `'${field}' is not in list`;

  await page.goto(URL);

  await page.getByRole('link', { name: 'Upload Contacts' }).click();
  await page.locator('[data-testid="stFileUploaderDropzoneInput"]').setInputFiles(filePath);
  await page.waitForTimeout(8000);
  await page.waitForSelector('[data-testid="stMarkdownContainer"]');

  // checking for csv uplaod success message
  const CSVUploadMsg = await page.evaluate(() => {
    const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
    if (containers.length >= 15) {
      const pTag = containers[14].querySelector('p');
      return pTag ? pTag.textContent : null;
    }
    return null;
  });
  expect(CSVUploadMsg).toBe(expectedCSVUploadMsg)

  // checking for API response sucess message
  const APIResponseMsg = await page.evaluate(() => {
    const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
    if (containers.length >= 15) {
      const pTag = containers[16].querySelector('p');
      return pTag ? pTag.textContent : null;
    }
    return null;
  });
  expect(APIResponseMsg).toBe(expectedAPIResponseMsg)
  console.log("APIResponseMsg ",APIResponseMsg)
  console.log("expectedAPIResponseMsg ",expectedAPIResponseMsg)
})
})