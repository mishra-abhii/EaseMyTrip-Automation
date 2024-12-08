import { Page, Locator, expect } from "@playwright/test";
import { locators } from "../locators/locator";

export class FlightsPage{

    readonly page: Page;
    constructor(page: Page){
      this.page = page;
    }
    
    async openFlightsPage(url: string): Promise<void>{
      await this.page.goto(url);
    }

    async isHeaderTextVisible(expectedText: string){
      await expect(this.headerText.nth(0)).toHaveText(expectedText);
    }

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

    // Method for selecting date with lowest price
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
      //console.log(text);
      expect(text).toBe('Fastest');
    }    

    async clickOnBookNowAndValidate(): Promise<void>{
      await this.page.locator(locators.bookNowButton).nth(0).click();
      await this.page.waitForTimeout(2000);
      const text = await this.page.textContent(locators.priceSummary);
      //console.log(text);
      expect(text).toBe('Price Summary');
    }

    async validateTotalPriceWhenValidCoupon(): Promise<void>{
      await this.page.waitForTimeout(3000);
      const priceSummary = await this.page.locator(locators.priceSplitting).allTextContents();
      //console.log(priceSummary);

      const pricePlusTax = parseInt(priceSummary[0]) + parseInt(priceSummary[1]);
      //console.log(pricePlusTax);
      const grandTotal = await this.page.locator(locators.totalPrice).nth(0).textContent();
      if(grandTotal){
        const totalPrice = parseInt(grandTotal.replace(',', '').trim());
        expect(pricePlusTax - parseInt(priceSummary[2])).toBe(totalPrice);
      }
    }

    async validateInvalidCouponErrorMessage(): Promise<void>{
      await this.page.locator(locators.cancelButtonToRemoveCoupon).click();
      const invalidCode = 'DAJHFD';
      await this.page.locator(locators.inputCouponCode).fill(invalidCode);
      await this.page.locator(locators.applyCouponCode).click();
      await this.page.waitForTimeout(2000);

      const errorMessage = await this.page.locator(locators.errorMessageInvalidCoupon).textContent();
      //console.log(errorMessage);
      expect(errorMessage).toBe('Invalid Coupon');
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