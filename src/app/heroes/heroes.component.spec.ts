import {HttpClientTestingModule} from "@angular/common/http/testing";
import {async, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";

import {LoaderComponent} from "../utils/loader/loader.component";

import {HeroesComponent} from "./heroes.component";

describe("HeroesComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeroesComponent, LoaderComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
        }).compileComponents();
    }));

    it("should create a component", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    // it("should display Hero name", () => {});

    // it("should change Hero name on input change", () => {});
});
