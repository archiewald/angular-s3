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
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
