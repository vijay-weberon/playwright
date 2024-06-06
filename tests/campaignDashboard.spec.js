import { test, expect ,chromium} from '@playwright/test';

const URL = 'https://traqr-demo.weberon.org/?s=4UTG'

test('checking campaign which has no response', async ({page}) => {

  await page.goto(URL);
  await page.goto('https://traqr-demo.weberon.org/?s=4UTG');
  await page.getByRole('link', { name: 'Campaign Dashboard' }).click();
  await page.frameLocator('iframe[title="st_aggrid\\.agGrid"]').getByRole('gridcell', { name: 'test5' }).click();
  await page.getByTestId('stNotification').click();
})