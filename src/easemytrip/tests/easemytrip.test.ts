import{test, expect, Page} from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe('Easemytrip Flight Booking Test Cases', async ()=>{
    let page: Page;
    let homePage: HomePage;
    
    test.beforeAll(async ({browser})=>{
        page = await browser.newPage();
        homePage = new HomePage(page);
        await homePage.openHomePage(process.env.HOME_PAGE_URL);
    });

    test('HomePage Validation', async ()=>{
        await homePage.isHeaderTextVisible('Exclusive Offers');
    });

    test('Select To and From Destinations', async ()=>{
        await homePage.fillFlightDestinations('varanasi', 'goa');

        const fromValue = await homePage.fromButton.inputValue();
        const toValue = await homePage.toButton.inputValue();

        expect(fromValue).toBe('Varanasi');
        expect(toValue).toBe('Goa');
    });

    test('Select Date with the Lowest Price', async ()=> {
        await homePage.selectDateWithLowestPrice();
    
        const selectedDate = await homePage.dateInputField.inputValue();
        console.log('Selected date:', selectedDate);
      });

    test('Click on Search Button to Proceed Further', async ()=> {
        await homePage.clickOnSearchAndValidate();
        console.log('Searched button clicked and Navigated to next page');
    }); 

    

})
