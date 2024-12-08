import { Page, Locator, expect } from "@playwright/test";
import { locators } from "../locators/locator";

export class HomePage{

    readonly page: Page;
    constructor(page: Page){
      this.page = page;
    }
    
    async openHomePage(url: string): Promise<void>{
      await this.page.goto(url);
    }

    async isHeaderTextVisible(expectedText: string){
      await expect(this.headerText.nth(0)).toHaveText(expectedText);
    }

    // Methods related to selecting TO and FROM destinations
    async selectFromDestination(inputLocator: Locator, fillInputLocator: Locator, destination: string) {
      await inputLocator.click();
      await this.page.waitForSelector(locators.dropDownItems);
      await fillInputLocator.type(destination);

      const option = this.dropdownOptions.locator(`text=${destination}`).nth(0);
      await option.click();
    }

    async selectToDestination(inputLocator: Locator, fillInputLocator: Locator, destination: string) {
      await fillInputLocator.type(destination);
      const option = this.dropdownOptions.locator(`text=${destination}`).nth(0);
      await option.click();
    }

    async fillFlightDestinations(from: string, to: string) {
      await this.selectFromDestination(this.fromButton, this.fromInput, from);
      await this.selectToDestination(this.toButton, this.toInput, to);
    }

    // Method related to selecting date with lowest price
    async selectDateWithLowestPrice(): Promise<void> {
      await this.page.waitForSelector(locators.spanElement, {state: 'attached'});
      const dateElements = await this.page.$$(locators.dateElements);
      //console.log(dateElements);

      let lowestPrice = Number.MAX_VALUE;
      let lowestPriceElement: any = null;

      for (const dateElement of dateElements) {
        const priceSpan = await dateElement.$('span');
        if (priceSpan) {
          const priceText = await priceSpan.textContent();
          //console.log(priceText);
          if (priceText) {
            const price = parseInt(priceText.replace('₹', '').trim());
            if (!isNaN(price) && price < lowestPrice) {
              lowestPrice = price;
              lowestPriceElement = dateElement;
            }
          }
        }
      }

      if (lowestPriceElement) {
        await lowestPriceElement.click();
        console.log(`Selected date with the lowest price: ₹${lowestPrice}`);
      } else {
        throw new Error('No valid price found to select a date.');
      }
    }

    async clickOnSearchAndValidate(): Promise<void>{
      await this.page.locator(locators.searchButton).click();
      await this.page.waitForTimeout(3000);
      await this.page.waitForSelector(locators.fastestText);
      const text = await this.page.textContent(locators.fastestText);
      expect(text).toBe('Fastest');
    }    

    // ================= Methods to get the selectors ==================
    get headerText(): Locator {
      return this.page.locator(locators.homePageHeaderText); 
    }

    get fromButton(): Locator {
      return this.page.locator(locators.fromButton);
    }

    get toButton(): Locator {
      return this.page.locator(locators.toButton);
    }

    get fromInput(): Locator {
      return this.page.locator(locators.fromDestinationInput);
    }
    
    get toInput(): Locator {
      return this.page.locator(locators.toDestinationInput);
    }
    
    get dropdownOptions(): Locator {
      return this.page.locator(locators.dropDownItems);
    }

    get dateInputField(): Locator{
      return this.page.locator(locators.dateInputField).nth(0);
    }
}