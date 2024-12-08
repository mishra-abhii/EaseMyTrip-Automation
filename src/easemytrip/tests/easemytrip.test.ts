import{test, expect, Page} from "@playwright/test";
import { FlightsPage } from "../pages/FlightsPage";

test.describe('Easemytrip Flight Booking Test Cases', async ()=>{
    let page: Page;
    let flightsPage: FlightsPage;
    
    test.beforeAll(async ({browser})=>{
        page = await browser.newPage();
        flightsPage = new FlightsPage(page);
        await flightsPage.openFlightsPage(process.env.FLIGHTS_PAGE_URL);
    });

    test('Flights Page Validation', async ()=>{
        await flightsPage.isHeaderTextVisible('Exclusive Offers');
    });

    test('Select To and From Destinations', async ()=>{
        await flightsPage.fillFlightDestinations('varanasi', 'goa');

        const fromValue = await flightsPage.fromButton.inputValue();
        const toValue = await flightsPage.toButton.inputValue();

        expect(fromValue).toBe('Varanasi');
        expect(toValue).toBe('Goa');
    });

    test('Select Date with the Lowest Price', async ()=> {
        await flightsPage.selectDateWithLowestPrice();
    
        const selectedDate = await flightsPage.dateInputField.inputValue();
        console.log('Selected date:', selectedDate);
      });

    test('Click on Search Button and Validate', async ()=> {
        await flightsPage.clickOnSearchAndValidate();
        console.log('Searched button clicked and Navigated to next page');
    }); 

    test('Click on Book Now Button and Validate', async ()=>{
        await flightsPage.clickOnBookNowAndValidate();
        console.log('Selected first flight from the list and clicked Book Now');
    });

    test('Validate Total Price After Valid Coupon is Applied', async ()=>{
        await flightsPage.validateTotalPriceWhenValidCoupon();
        console.log('Total Price validated on adding taxes and applying discount');
    });
    
    test('Validate Error Message After Applying Invalid Coupon', async ()=>{
        await flightsPage.validateInvalidCouponErrorMessage();
        console.log('Error message validated when wrong coupon applied');
    });

})
