import { test, expect ,chromium} from '@playwright/test';
import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import csv from 'csv-parser';

const URL = 'https://traqr-demo.weberon.org/?s=4UTG'
const campaign_name = 'test-campaign-04'
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
