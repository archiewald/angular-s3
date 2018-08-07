import {TestBed} from "@angular/core/testing";

import {HeroesComponent} from "./heroes.component";

describe("HeroesComponent", () => {
    it("should create a component", () => {
        TestBed.configureTestingModule({
            declarations: [HeroesComponent],
        });
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    // it("should display Hero name", () => {});

    // it("should change Hero name on input change", () => {});
});
