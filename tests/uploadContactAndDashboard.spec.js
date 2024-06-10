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

  // Wait for all the messages appears on screen 
  await page.waitForFunction(() => {
    const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
    return containers.length >= 18;
  }, { timeout: 30000 });

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
await page.getByTestId('stFullScreenFrame').nth(2).click();

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

// Wait for all the messages appears on screen
  await page.waitForFunction(() => {
    const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
    return containers.length >= 17;
  }, { timeout: 30000 });

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
  await page.getByTestId('stNotification').nth(2).click();
})
})

// Checking campaign dashboard for no resonse campaigns
test('checking campaign which has no response', async ({page}) => {
  const expectedMsg = "No responses to this campaign yet"
  await page.goto(URL);
  await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
  await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: 'test5' }).click();
 
  await page.waitForFunction(() => {
    const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
    return containers.length >= 15;
  }, { timeout: 30000 });

  const responseMsg = await page.evaluate(() => {
    const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
    console.log("containers.length ",containers.length)
    if (containers.length >= 14) {
      const pTag = containers[14].querySelector('p');
      return pTag ? pTag.textContent : null;
    }
    return null;
  });
  expect(responseMsg).toBe(expectedMsg)

  // Checking if Campaign Details and Responded Details are visible when any campaign is selected
  const expectedCampaignDetailsHeader = "Campaign Details"
  const CampaignDetailsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(2).textContent();
  expect(CampaignDetailsHeader).toBe(expectedCampaignDetailsHeader)

  const expectedRespondedContactsHeader = "Responded Contacts"
  const RespondedContactsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(3).textContent();
  expect(RespondedContactsHeader).toBe(expectedRespondedContactsHeader)
})

test('checking for campaign dashboard with responses', async ({ page }) => {
  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');
  await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
  await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: 'test-campaign-' }).click();

  await page.frameLocator('iframe[title="st_aggrid\\.agGrid"] >> nth=1').getByRole('gridcell', { name: 'Abhishek' }).click();

  await page.frameLocator('iframe[title="st_aggrid\\.agGrid"] >> nth=2').getByRole('gridcell', { name: 'test-campaign-' }).first().click();


    // Checking if Campaign Details and Responded Details are visible when any campaign is selected
    const expectedCampaignDetailsHeader = "Contact Details"
    const CampaignDetailsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(4).textContent();
    expect(CampaignDetailsHeader).toBe(expectedCampaignDetailsHeader)
    console.log("expectedCampaignDetailsHeader",expectedCampaignDetailsHeader)
    console.log("CampaignDetailsHeader",CampaignDetailsHeader)
  
    const expectedContactVisitsHeader = "Contact Visits"
    const ContactVisitsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(5).textContent();
    expect(ContactVisitsHeader).toBe(expectedContactVisitsHeader)
    console.log("expectedContactVisitsHeader",expectedContactVisitsHeader)
    console.log("ContactVisitsHeader",ContactVisitsHeader)

    

  const expectedVisitDetailsHeader = "Visit Details"
  const VisitDetailsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(6).textContent();
  expect(VisitDetailsHeader).toBe(expectedVisitDetailsHeader)
  console.log("expectedVisitDetailsHeader",expectedVisitDetailsHeader)
  console.log("VisitDetailsHeader",VisitDetailsHeader)
});