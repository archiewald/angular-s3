import {browser} from "protractor";

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
});
