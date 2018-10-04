import {HttpClientTestingModule} from "@angular/common/http/testing";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";

import {LoaderComponent} from "../utils/loader/loader.component";

import {HeroDetailComponent} from "./hero-detail.component";

describe("HeroDetailComponent", () => {
    let component: HeroDetailComponent;
    let fixture: ComponentFixture<HeroDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeroDetailComponent, LoaderComponent],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                RouterTestingModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render hero name in uppercase in title", () => {
        const testHero = {id: 1, name: "Archie"};
        component.hero = testHero;
        fixture.detectChanges();
        const title = fixture.nativeElement.querySelector("h2");

        expect(title.textContent).toContain(testHero.name.toUpperCase());
    });

    it("should navigate back on goBack()", () => {
        const location = jasmine.createSpyObj("location", ["back"]);

        component.goBack();

        expect(location.back.calls.any()).toBe(true);
    });

    it("should call updateHero on save()", () => {});
});
