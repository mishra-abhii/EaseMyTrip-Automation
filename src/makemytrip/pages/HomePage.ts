import { Page, Locator, expect } from "@playwright/test";
import { locators } from "../locators/locator";

export class HomePage{

    readonly page: Page;
    constructor(page: Page){
        this.page = page;
    }

    // PageObject Methods
    async openHomePage(url: string): Promise<void>{
        await this.page.goto(url);
    }

    async isHeaderTextVisible(expectedText: string){
        await expect(this.headerText).toHaveText(expectedText);
    }

    async selectDestination(inputLocator: Locator, destination: string) {
      await inputLocator.click();
      await inputLocator.fill(destination);
    
      await this.page.waitForSelector(locators.dropDownItems);
      const option = this.dropdownOptions.locator(`text=${destination}`);
      await option.click();
    }
    
    async fillFlightDestinations(from: string, to: string) {
      await this.selectDestination(this.fromInput, from);
      await this.selectDestination(this.toInput, to);
    }


    // Methods to get the selectors
    get headerText(): Locator {
      return this.page.locator(locators.homePageHeaderText); 
    }

    get getDismissDialogButton(): Locator {
      return this.page.locator(locators.homePageDismissDialogButton);
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
    
}