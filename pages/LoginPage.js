export class LoginPage {
  constructor(page) {
    this.page = page;
    this.newUserButton = page.locator('#newUser');
    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.wrapper = page.locator('.login-wrapper');
  }

  async goto() {
    await this.loginButton.toBeVisible();
    await this.loginLink.click();
    await this.expectLoaded();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*login/);
    await expect(this.wrapper).toBeVisible();
  }

  async goToRegister() {
    await this.newUserButton.click();
  }

  async login(userName, password) {
    await this.userName.fill(userName);
    await expect(this.userName).toHaveValue(userName);

    await this.password.fill(password);
    await expect(this.password).toHaveValue(password);

    await this.loginButton.click();
  }
}