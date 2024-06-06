import { test, expect ,chromium} from '@playwright/test';

const URL = 'https://traqr-demo.weberon.org/?s=4UTG'

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

// Give the campaign name from the existing campaign 
test('submmiting the form for duplicate campaign name', async ({page}) => {
 
  await page.goto(URL);

  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.getByLabel('Enter the name for the campaign').click();
  await page.getByLabel('Enter the name for the campaign').fill('test');
  await page.getByLabel('Enter the name for the campaign').press('Enter');
  await page.getByLabel('Enter the URL value to redirect the user to').click();
  await page.getByLabel('Enter the URL value to redirect the user to').fill('https://www.google.com');
  await page.getByLabel('Enter the URL value to redirect the user to').press('Enter');
  await page.getByTestId('baseButton-secondary').click();
 // Wait for the message element to appear
 const message = await page.waitForSelector('.e1eexb540');
  
 // Get the text content of the message element
 const messageText = await message.textContent();
 expect(messageText).toBe("A campaign under test already exists for this user")
})


// Give a unique campaign name here to test the application for unique campaign name
test('submmiting the form for unique campaign name', async ({page}) => {
  const unique_campaign_name = "test6"
  await page.goto(URL);

  await page.getByRole('link', { name: 'Create Campaign' }).click();
  await page.getByLabel('Enter the name for the campaign').click();
  await page.getByLabel('Enter the name for the campaign').fill(unique_campaign_name);
  await page.getByLabel('Enter the name for the campaign').press('Enter');
  await page.getByLabel('Enter the URL value to redirect the user to').click();
  await page.getByLabel('Enter the URL value to redirect the user to').fill('https://www.google.com');
  await page.getByLabel('Enter the URL value to redirect the user to').press('Enter');
  await page.getByTestId('baseButton-secondary').click();
 // Wait for the message element to appear
 const message = await page.waitForSelector('.e1eexb540');
  
 // Get the text content of the message element
 const messageText = await message.textContent();
 expect(messageText).toBe(`A campaign for ${unique_campaign_name} was created successfully`)
 console.log("messageText ",messageText)
})

