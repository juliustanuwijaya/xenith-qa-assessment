// @ts-check
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('register new user', async ({ page }) => {
  // go to page https://demoqa.com/books
  await page.goto('https://demoqa.com/books');

  // Click the Login link.
  await page.getByRole('link', { name: 'Login' }).click();

  // Expects page to have a Login Form and click on New User button to register
  await expect(page.locator('login-wrapper'));
  await page.getByRole('button', {name: 'New User'}).click;
  
  // Expect Page to open registration page and fill in the form
  const firstname = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username();
  
  await expect(page.locator('register-wrapper'));
  await expect(page.getByRole('textbox', {name: 'firstname'}).fill(firstname));
  await expect(page.getByRole('textbox', {name: 'lastname'}).fill(lastName));
  await expect(page.getByRole('textbox', {name: 'username'}).fill(username));
  await expect(page.getByRole('textbox', {name: 'password'}).fill('T3st@123'));
  await expect(page.getByRole('button', {name: 'Register'}).click());

  // Popup handler after registration
  const popupPromise = page.waitForEvent('popup');
  const popup = await popupPromise;
  await expect(popup.getByLabel('User Registered Successfully.'));
  await expect(popup.getByRole('button', { name: 'OK' }).click());

  await expect(page.locator('register-wrapper'));

});
