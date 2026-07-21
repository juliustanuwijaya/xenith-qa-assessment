// @ts-check
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('register new user', async ({ page }) => {
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
  const username = faker.internet.username();
  const password = 'T3st@123';

  await page.locator('#firstname').fill(firstname);
  await page.locator('#lastname').fill(lastname);
  await page.locator('#userName').fill(username);
  await page.locator('#password').fill(password);

  // Verify values were entered correctly before submitting
  await expect(page.locator('#firstname')).toHaveValue(firstname);
  await expect(page.locator('#lastname')).toHaveValue(lastname);
  await expect(page.locator('#userName')).toHaveValue(username);
  // await page.click('#register');

  // Popup handler after registration
  // const popupPromise = page.waitForEvent('popup');
  // const popup = await popupPromise;
  // await expect(popup.getByLabel('User Registered Successfully.'));
  // await expect(popup.getByRole('button', { name: 'OK' }).click());

  // await expect(page.locator('register-wrapper'));

});
