export class BooksPage {
  constructor(page) {
    this.page = page;
    this.booksWrapper = page.locator('.books-wrapper');
    this.searchBox = page.locator('#searchBox');
    this.loginButton = page.locator('#login');
  }

  async expectLoaded(userName) {
    await expect(page).toHaveURL(/.*books/);
    await expect(this.booksWrapper).toBeVisible();
    await expect(this.searchBox).toBeVisible();
  }

  async searchBook(book) {
    await this.searchBox.fill(book.title);
    await expect(page.getByText(book.title)).toBeVisible();
  }

  async gotoBookDetail(book) {
    await page.getByText(book.title).click();
  }

  async gotoLogin(book) {
    await page.getByText(book.title).click();
  }
}