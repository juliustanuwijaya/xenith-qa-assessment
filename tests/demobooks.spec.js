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

  // click Login page and direct to Profile page
  await page.locator('#login').click();
  await expect(page).toHaveURL(/.*profile/);
  await expect(page.locator('.profile-wrapper')).toBeVisible();
  await expect(page.locator('#userName-value')).toContainText(userName);

  //click on  Go to Book Store button and show books list
  await page.locator('#gotoStore').click();
  await expect(page).toHaveURL(/.*books/);
  await expect(page.locator('.books-wrapper')).toBeVisible();

  //search for books, open the book details and add to your collection
  const bookTitle = 'Git Pocket Guide';
  const bookISBN = '9781449325862';
  await expect(page.locator('#searchBox')).toBeVisible();
  await page.locator('#searchBox').fill(bookTitle);
  await expect(page.getByText(bookTitle)).toBeVisible();
  await page.getByText(bookTitle).click();
  await expect(page.locator('.books-wrapper')).toBeVisible();
  await expect(page.locator('#ISBN-wrapper')).toContainText(bookISBN);
  await expect(page.locator('#title-wrapper')).toContainText(bookTitle);
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Add To Your Collection' }).click();
  await expect.poll(() => dialogMessage).toContain('Book added to your collection.');

  // go to profile page and check if the added book exist in our collection
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL(/.*profile/);
  await expect(page.locator('.profile-wrapper')).toBeVisible();
  await expect(page.getByText(bookTitle)).toBeVisible();
  await expect(page.locator('#delete-record-'+bookISBN)).toBeVisible();
  await expect(page.getByText('Page 1 of 1')).toBeVisible();

  // Delete added books
  const modalDialog = page.locator('.modal-dialog')
  await page.locator('#delete-record-'+bookISBN).click();
  await expect(modalDialog).toBeVisible();
  await modalDialog.getByText('Delete Book').isVisible();
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await modalDialog.getByRole('button', { name: 'OK' }).click();
  await expect.poll(() => dialogMessage).toContain('Book deleted.');
  await expect(page.getByText('Page 1 of 0')).toBeVisible();


  // Logout from the account
  await page.getByRole('button', { name: "Logout" }).click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('.login-wrapper')).toBeVisible();

});


