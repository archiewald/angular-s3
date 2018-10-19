import {browser, by, element} from "protractor";

import {AppPage} from "./app.po";

describe("workspace-project App", () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it("should display a title ", () => {
        page.navigateTo();
        browser.pause();
        expect(page.getParagraphText()).toEqual("Tour of Heroes!");
    });

    it("click on heroes link should navigate to heroes list", () => {
        const heroesLink = element(by.linkText("Heroes"));
        heroesLink.click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "/heroes");
    });
});
