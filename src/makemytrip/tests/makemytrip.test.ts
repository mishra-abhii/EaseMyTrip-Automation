import{test, expect, Page} from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe('Cleartrip Flight Booking Test Cases', async ()=>{
    let page: Page;
    let homePage: HomePage;
    
    test.beforeAll(async ({browser})=>{
        page = await browser.newPage();
        homePage = new HomePage(page);
        await homePage.openHomePage(process.env.HOME_PAGE_URL);
        await homePage.getDismissDialogButton.click();
    });

    test('HomePage Validation', async ()=>{
        await homePage.isHeaderTextVisible('Search flights');
    });

    test('Select To and From Destinations', async ()=>{
        await homePage.fillFlightDestinations('pune', 'mumbai');

        const fromValue = await homePage.fromInput.inputValue();
        const toValue = await homePage.toInput.inputValue();

        expect(fromValue).toBe('PNQ - Pune, IN');
        expect(toValue).toBe('BOM - Mumbai, IN');
    });
})
