import { test, expect ,chromium} from '@playwright/test';

const URL = 'https://traqr-demo.weberon.org/?s=4UTG'

// Use a campaign name which has no responses


test('checking campaign with response', async ({page}) => {
  // await page.goto('https://api.webfluence.dev/5gFPzSbQ')
//   await page.goto(URL);
  

//   await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
//   await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: 'test-campaign' }).click();

 
//   await page.waitForFunction(() => {
//     const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
//     return containers.length >= 13;
//   });

// // clicking on one of the responded contact
// await page.frameLocator('iframe[title="st_aggrid\\.agGrid"] >> nth=1').getByRole('gridcell', { name: 'Abhishek' }).click();

// await page.waitForFunction(() => {
//   const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
//   return containers.length >= 14;
// });


  
//   // Checking if Campaign Details and Responded Details are visible when any campaign is selected
//   const expectedCampaignDetailsHeader = "Contact Details"
//   const CampaignDetailsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(4).textContent();
//   expect(CampaignDetailsHeader).toBe(expectedCampaignDetailsHeader)
//   console.log("expectedCampaignDetailsHeader",expectedCampaignDetailsHeader)
//   console.log("CampaignDetailsHeader",CampaignDetailsHeader)

//   const expectedContactVisitsHeader = "Contact Visits"
//   const ContactVisitsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(5).textContent();
//   expect(ContactVisitsHeader).toBe(expectedContactVisitsHeader)
//   console.log("expectedContactVisitsHeader",expectedContactVisitsHeader)
//   console.log("ContactVisitsHeader",ContactVisitsHeader)


//     await page.locator('xpath=/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/section[2]/div[1]/div[1]/div[1]/div[1]/div[9]/div[1]/div[1]/div[1]/div[1]/div[1]/iframe[1]').click()
    
//     await page.waitForFunction(() => {
//     const containers = document.querySelectorAll('div[data-testid="stMarkdownContainer"]');
//     return containers.length >= 16;
//   });

//   const expectedVisitDetailsHeader = "Visit Details"
//   const VisitDetailsHeader = await page.locator('span.st-emotion-cache-10trblm.e1nzilvr1').nth(6).textContent();
//   expect(VisitDetailsHeader).toBe(expectedVisitDetailsHeader)
//   console.log("expectedVisitDetailsHeader",expectedVisitDetailsHeader)
//   console.log("VisitDetailsHeader",VisitDetailsHeader)
})