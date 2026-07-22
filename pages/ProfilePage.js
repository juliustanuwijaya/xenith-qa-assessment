export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.userNameValue = page.locator('#userName-value');
    this.profileWrapper = page.locator('.profile-wrapper');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.gotoBookStoreButton = page.locator('#gotoStore');
  }

  async expectLoaded(userName) {
      await expect(this.page).toHaveURL(/.*profile/);
      await expect(this.profileWrapper).toBeVisible();
      await expect(this.userNameValue).toHaveValue(userName);
      await expect(this.logoutButton).toBeVisible();
      await expect(this.gotoBookStoreButton).toBeVisible();
  }

  async gotoBookStore () {
    await this.gotoBookStoreButton.click();
  }

  async removeBook() {
    await page.locator('#delete-record-'+book.ISBN).click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}