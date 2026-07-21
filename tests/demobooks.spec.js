// @ts-check
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { blockAds } from '#utils/adBlocker';
import { generateTestUser } from '#utils/testData';

test('register new user', async ({ page }) => {
  await blockAds(page);

  // go to page https://demoqa.com/books
  await page.goto('https://demoqa.com/books');

  // Click the Login link.
  await page.locator('#login').click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('.login-wrapper')).toBeVisible();

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
  await page.waitForLoadState('networkidle');
  await page.locator('#firstname').click();

  await page.locator('#firstname').fill(firstname);
  await expect(page.locator('#firstname')).toHaveValue(firstname);

  await page.locator('#lastname').fill(lastname);
  await expect(page.locator('#lastname')).toHaveValue(lastname);

  await page.locator('#userName').fill(userName);
  await expect(page.locator('#userName')).toHaveValue(userName);

  await page.locator('#password').fill(password);
  await expect(page.locator('#password')).toHaveValue(password);

  // create a dialog listener before the register is clicked
  let dialogMessage = '';
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.locator('#register').click();
  await expect.poll(() => dialogMessage).toContain('User Registered Successfully');

  await page.locator('#gotologin').click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('.login-wrapper')).toBeVisible();

  // fill in the login credentials
  await page.locator('#userName').fill(userName);
  await expect(page.locator('#userName')).toHaveValue(userName);

  await page.locator('#password').fill(password);
  await expect(page.locator('#password')).toHaveValue(password);

  await page.locator('#login').click();
  await expect(page).toHaveURL(/.*profile/);
  await expect(page.locator('.profile-wrapper')).toBeVisible();
  await expect(page.locator('#userName-value')).toContainText(userName);

  // Logout from the account
  await page.getByRole('button', { name: "Logout" }).click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('.login-wrapper')).toBeVisible();

});


