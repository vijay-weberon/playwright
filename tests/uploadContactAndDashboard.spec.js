import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import csv from 'csv-parser';


const URL = 'https://traqr-demo.weberon.org/?s=4UTG'

const campaign_name = 'test-campaign-05'

test('checking for navlist items', async ({page}) => {

  await page.goto(URL);
  
  // Click the link and wait for the URL to be the expected one
  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.waitForURL('https://traqr-demo.weberon.org/create_campaign?s=4UTG');
  const createCampaignURL  = await page.url()
  console.log("expected createCampaignURL - ","https://traqr-demo.weberon.org/create_campaign?s=4UTG")
  console.log("result createCampaignURL - ",createCampaignURL)
  expect(createCampaignURL).toBe('https://traqr-demo.weberon.org/create_campaign?s=4UTG');
  

  await page.getByRole('link', { name: 'Upload Contacts' }).click();
  await page.waitForURL('https://traqr-demo.weberon.org/upload_records_in_bulk?s=4UTG');
  const uploadContactsURL  = await page.url()
  expect(uploadContactsURL).toBe('https://traqr-demo.weberon.org/upload_records_in_bulk?s=4UTG');
  console.log("expected uploadContactsURL - ","https://traqr-demo.weberon.org/upload_records_in_bulk?s=4UTG")
  console.log("result uploadContactsURL - ",uploadContactsURL)

  await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
  await page.waitForURL('https://traqr-demo.weberon.org/see_statistics_for_short_url?s=4UTG');
  const campaignDashboardURL  = await page.url()
  expect(campaignDashboardURL).toBe('https://traqr-demo.weberon.org/see_statistics_for_short_url?s=4UTG');
  console.log("expected campaignDashboardURL - ","https://traqr-demo.weberon.org/see_statistics_for_short_url?s=4UTG")
  console.log("result campaignDashboardURL - ",campaignDashboardURL)
});




// Give a unique campaign name here to test the application for unique campaign name
test('submmiting the form for unique campaign name', async ({page}) => {
  const unique_campaign_name = campaign_name
  
  await page.goto(URL);

  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.getByLabel('Enter the name for the campaign').click();
  await page.getByLabel('Enter the name for the campaign').fill(unique_campaign_name);
  await page.getByLabel('Enter the name for the campaign').press('Enter');
  await page.getByLabel('Enter the URL value to redirect the user to').click();
  await page.getByLabel('Enter the URL value to redirect the user to').fill('https://www.reachpersona.com');
  await page.getByLabel('Enter the URL value to redirect the user to').press('Enter');
  await page.getByTestId('baseButton-secondary').click();
 // Wait for the message element to appear
 const message = await page.waitForSelector('.e1eexb540');
  
 // Get the text content of the message element
 const messageText = await message.textContent();
 expect(messageText).toBe(`A campaign for ${unique_campaign_name} was created successfully`)
 console.log("messageText ",messageText)
})

// Give the campaign name from the existing campaign 
test('submmiting the form for duplicate campaign name', async ({page}) => {
 
  await page.goto(URL);

  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.getByLabel('Enter the name for the campaign').click();
  await page.getByLabel('Enter the name for the campaign').fill(campaign_name);
  await page.getByLabel('Enter the name for the campaign').press('Enter');
  await page.getByLabel('Enter the URL value to redirect the user to').click();
  await page.getByLabel('Enter the URL value to redirect the user to').fill('https://www.reachpersona.com');
  await page.getByLabel('Enter the URL value to redirect the user to').press('Enter');
  await page.getByTestId('baseButton-secondary').click();
 // Wait for the message element to appear
 const message = await page.waitForSelector('.e1eexb540');
  
 // Get the text content of the message element
 const messageText = await message.textContent();
 expect(messageText).toBe(`A campaign under ${campaign_name} already exists for this user`)
})

// checking for the reachpersona logo and the navbar collapse and expand functionality
test('checking for the reachpersona logo and the navbar collapse and expand functionality', async ({page}) => {
  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');
  await page.getByRole('img', { name: '0' }).click();
  await page.getByText('© 2024 ReachPersona.com. All rights reserved.').click();
  await page.screenshot({ path: 'playwright-report/data/screenshot0.png', fullPage: true });
  await page.getByTestId('stSidebarContent').click();
  await page.getByTestId('stSidebarContent').getByTestId('baseButton-header').click();
  await page.screenshot({ path: 'playwright-report/data/screenshot1.png', fullPage: true });
  await page.getByTestId('collapsedControl').getByTestId('baseButton-headerNoPadding').click();
  await page.getByTestId('stSidebarContent').click();
})

// Checking for dropdown works if there are existing campaigns
test('checking for dropdown works for already existing campaigns', async ({ page }) => {
  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');
  
  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.locator('summary').click();
  await page.getByTestId('stExpanderDetails').getByTestId('stFullScreenFrame').click();
});





const downloadDirectory = path.join(__dirname, '../downloads');
let trackableUrl =""


test('uploading csv file with all mandatory fields', async ({ page }) => {
  const downloadPath = path.join(__dirname, '../downloads');  // Define your download folder path
  const filePath = "/vijay/playwright/Assests/nskope_records_with_all_mandatory_fields.csv";
  const expectedCSVUploadMsg = "CSV uploaded successfully!";
  const expectedAPIResponseMsg = "Data fetched from API successfully!";
  const expectedDownloadBtnText = "Download CSV and QR Codes";

    // Ensure the download directory exists
    if (!fs.existsSync(downloadDirectory)) {
      fs.mkdirSync(downloadDirectory, { recursive: true });
    }


  await page.goto(URL);

  await page.getByRole('link', { name: 'Upload Contacts' }).click();

  await page.getByTestId('stSelectbox').locator('div').nth(2).click();
  await page.getByLabel('Select a').fill(campaign_name);
  await page.getByRole('option', { name: campaign_name }).click();


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
      const pTag = containers[15].querySelector('p');
      return pTag ? pTag.textContent : null;
    }
    return null;
  });
expect(CSVUploadMsg).toBe(expectedCSVUploadMsg)


// checking for API response sucess message
  const APIResponseMsg = await page.evaluate(() => {
    const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
    if (containers.length >= 18) {
      const pTag = containers[17].querySelector('p');
      return pTag ? pTag.textContent : null;
    }
    return null;
  });
  expect(APIResponseMsg).toBe(expectedAPIResponseMsg)

  const DownloadBtn = await page.getByTestId('stDownloadButton').getByTestId('baseButton-secondary')
  const DownloadBtnContent = await DownloadBtn.textContent()
  expect(DownloadBtnContent).toBe(expectedDownloadBtnText)
  // await page.getByTestId('stFullScreenFrame').nth(2).click();

 // Set up the download event listener
 const downloadPromise = page.waitForEvent('download');
 await DownloadBtn.click();
 const download = await downloadPromise;

 // Define the path to save the file
 const filePathToSave = path.join(downloadDirectory, 'downloaded_file.zip');

 // Save the file
 await download.saveAs(filePathToSave);
 console.log(`File downloaded and saved to: ${filePathToSave}`);

 // Verify the file existence
 const fileExists = fs.existsSync(filePathToSave);
 expect(fileExists).toBe(true);
 console.log(`File exists: ${fileExists}`);

 // Check if the file is a ZIP archive and extract its contents
 const fileBuffer = fs.readFileSync(filePathToSave);
 if (fileBuffer.slice(0, 2).toString('hex') === '504b') { // Check for ZIP file signature
   console.log('The file is a ZIP archive. Extracting contents...');

   // Create a directory for the extracted contents
   const extractedPath = path.join(downloadDirectory, 'extracted');
   if (!fs.existsSync(extractedPath)) {
     fs.mkdirSync(extractedPath, { recursive: true });
   }

   // Extract the ZIP archive
   await new Promise((resolve, reject) => {
     fs.createReadStream(filePathToSave)
       .pipe(unzipper.Extract({ path: extractedPath }))
       .on('close', resolve)
       .on('error', reject);
   });

   console.log(`Contents extracted to: ${extractedPath}`);

       // Read and process the extracted files
       const extractedFiles = fs.readdirSync(extractedPath);
       for (const file of extractedFiles) {
         const extractedFilePath = path.join(extractedPath, file);
         if (path.extname(file) === '.csv' && file === 'processed_contacts.csv') {
           // Read and process the CSV file
           const csvContent = fs.readFileSync(extractedFilePath, 'utf8');
          //  console.log('CSV File Content:', csvContent);
   
           // Extract the first row value of the column 'o.rp.trackableurl'
            trackableUrl = await new Promise((resolve, reject) => {
             const results = [];
             fs.createReadStream(extractedFilePath)
               .pipe(csv())
               .on('data', (data) => results.push(data))
               .on('end', () => {
                 if (results.length > 0 && results[0]['o.rp.trackableurl']) {
                   resolve(results[0]['o.rp.trackableurl']);
                 } else {
                   reject(new Error('Column or data not found'));
                 }
               });
           });
           console.log('First Row Value of o.rp.trackableurl:', trackableUrl);

         }
       }
     } else {
       console.log('The file is not a ZIP archive. Processing as CSV...');
     }

    

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

  await page.getByTestId('stSelectbox').locator('div').nth(2).click();
  await page.getByLabel('Select a').fill(campaign_name);
  await page.getByRole('option', { name: campaign_name }).click();


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
      const pTag = containers[15].querySelector('p');
      return pTag ? pTag.textContent : null;
    }
    return null;
  });
  expect(CSVUploadMsg).toBe(expectedCSVUploadMsg)

  // checking for API response sucess message
  const APIResponseMsg = await page.evaluate(() => {
    const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
    if (containers.length >= 18) {
      const pTag = containers[17].querySelector('p');
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
  await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: campaign_name }).click();
 
  await page.waitForFunction(() => {
    const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
    return containers.length >= 16;
  }, { timeout: 30000 });

  const responseMsg = await page.evaluate(() => {
    const containers = document.querySelectorAll('[data-testid="stMarkdownContainer"]');
    console.log("containers.length ",containers.length)
    if (containers.length >= 16) {
      const pTag = containers[15].querySelector('p');
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

    await page.goto(trackableUrl);

    await page.goto(URL);
    await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
    await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: campaign_name }).click();

    await page.frameLocator('iframe[title="st_aggrid\\.agGrid"] >> nth=1').getByRole('gridcell', { name: 'Abhishek' }).click();

    await page.frameLocator('iframe[title="st_aggrid\\.agGrid"] >> nth=2').getByRole('gridcell', { name: campaign_name}).first().click();
  
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
   
   
   
   
    await page.waitForTimeout(30000);
    await page.locator('table'); // adjust the selector based on the actual table element
  
    // Extract data from the table
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tr');
      return Array.from(rows, row => {
        const columns = row.querySelectorAll('td, th');
        return Array.from(columns, column => column.innerText);
      });
    });
  
    console.log("data ",data);
    const expectedKeys = ['campaign', 'destination_url', 'contacts', 'timestamp'];

    const validValueCheck = (value) => {
      return value && value.trim() !== '';
    };
  
    // Check if specific keys have valid values
    data.forEach(row => {
      for (let i = 0; i < row.length; i++) {
        const key = row[i];
        if (expectedKeys.includes(key)) {
          const correspondingValue = row[i + 1];
          if (correspondingValue !== undefined) {
            const isValid = validValueCheck(correspondingValue);
            console.log(`Checking key: ${key}, value: ${correspondingValue}, isValid: ${isValid}`);
            expect(isValid).toBe(true);
          } else {
            console.log(`Value for key: ${key} is undefined`);
            expect(correspondingValue).toBeDefined();
          }
        }
      }
    });
    console.log("All the checks have passed")
  });