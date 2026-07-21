// @ts-check
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { blockAds } from '#utils/adBlocker';

test('register new user', async ({ page }) => {
  await blockAds(page);

  // go to page https://demoqa.com/books
  await page.goto('https://demoqa.com/books');

  // Click the Login link.
  await page.locator('#login').click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('.login-wrapper')).toBeVisible();

  page.on('request', (req) => {
    if (req.resourceType() === 'script' || req.url().includes('ad')) {
      console.log('Loaded:', req.url());
    }
  });

  // Navigate to registration
  await page.locator('#newUser').click();
  await expect(page).toHaveURL(/.*register/);
  await expect(page.locator('.register-wrapper')).toBeVisible();
  
  // Expect Page to open registration page and fill in the form
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const userName = firstname+'_'+lastname;
  const password = 'T3st@123';

  // NOTE: demoqa.com's registration form has a quirk where recaptcha's
  // background script interferes with focus/blur on whichever field is
  // interacted with first, clearing its value. This throwaway click
  // "absorbs" that interference before we do the real fill.
  page.waitForTimeout(1000);
  await page.locator('#firstname').click();

  await page.locator('#firstname').pressSequentially(firstname, { timeout: 500 });
  await expect(page.locator('#firstname')).toHaveValue(firstname);

  await page.locator('#lastname').pressSequentially(lastname, { timeout: 500 });
  await expect(page.locator('#lastname')).toHaveValue(lastname);

  await page.locator('#userName').pressSequentially(userName, { timeout: 500 });
  await expect(page.locator('#userName')).toHaveValue(userName);

  await page.locator('#password').pressSequentially(password, { timeout: 500 });
  await expect(page.locator('#password')).toHaveValue(password);

  // create a dialog listener before the register is clicked
  let dialogMessage = '';
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.locator('#register').click();

  //await page.screenshot({ path: 'screenshot.png' });
  await page.waitForTimeout(10000)
  //await expect.poll(() => dialogMessage).toContain('User Registered Successfully');


  // Popup handler after registration
  // const popupPromise = page.waitForEvent('popup');
  // const popup = await popupPromise;
  // await expect(popup.getByLabel('User Registered Successfully.'));
  // await expect(popup.getByRole('button', { name: 'OK' }).click());
});
