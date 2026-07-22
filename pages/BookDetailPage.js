export class BookDetailPage {
  constructor(page) {
    this.page = page;
    this.booksWrapper = page.locator('.books-wrapper');
    this.bookISBNWrapper = page.locator('#ISBN-wrapper');
    this.bookTitleWrapper = page.locator('#title-wrapper');
    this.addToCollectionButton = page.getByRole('button', { name: 'Add To Your Collection' });
  }

  async expectLoaded(book) {
    // URL: https://demoqa.com/books?search=9781449325862
    await expect(page).toHaveURL(/.*books/);
    await expect(this.booksWrapper).toBeVisible();
    await expect(this.bookISBNWrapper).toContainText(book.ISBN);
    await expect(this.bookTitleWrapper).toContainText(book.title);
    await expect(this.addToCollectionButton).toBeVisible();
    await expect(this.addToCollectionButton).toBeVisible();
  }

  async addBookToCollection() {
    let dialogMessage = ''
    page.once('dialog', async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
    });
    await addToCollectionButton.click();
    await expect.poll(() => dialogMessage).toContain('Book added to your collection.');
  }
}