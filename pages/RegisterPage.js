export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.wrapper = page.locator('.register-wrapper');
    this.firstname = page.locator('#firstname');
    this.lastname = page.locator('#lastname');
    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.registerButton = page.locator('#register');
    this.gotoLogin = page.locator('#gotologin').click();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*register/);
    await expect(this.wrapper).toBeVisible();
    await expect(this.firstname).toBeVisible();
    await expect(this.lastname).toBeVisible();
    await expect(this.userName).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  // Fills a field and verifies the value stuck (guards against the
  // recaptcha focus-clearing bug described below).
  async #fillAndVerify(locator, value) {
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  async fillForm({ firstname, lastname, userName, password }) {
    // this to wait for all recaptcha process to be finished first so it will not mess with the input.
    await this.page.waitForLoadState('networkidle');

    await this.#fillAndVerify(this.firstname, firstname);
    await this.#fillAndVerify(this.lastname, lastname);
    await this.#fillAndVerify(this.userName, userName);
    await this.#fillAndVerify(this.password, password);
  }

  async submit() {
    let dialogMessage = '';
    this.page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await this.registerButton.click();
    await expect.poll(() => dialogMessage).toContain('User Registered Successfully');
  }

  async gotoLoginPage() {
    await this.gotoLogin.click();
  }
}