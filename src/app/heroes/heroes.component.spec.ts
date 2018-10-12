import {HttpClientTestingModule} from "@angular/common/http/testing";
import {async, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {Observable, of} from "rxjs";

import {Hero} from "../hero";
import {HeroService} from "../hero.service";
import {LoaderComponent} from "../utils/loader/loader.component";

import {HeroesComponent} from "./heroes.component";

const testHeroes: Hero[] = [{id: 1, name: "Archie"}, {id: 2, name: "Marek"}];

class MockedHeroService {
    getHeroes(): Observable<Hero[]> {
        return of(testHeroes);
    }
}

describe("HeroesComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeroesComponent, LoaderComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                {
                    provide: HeroService,
                    useClass: MockedHeroService,
                },
            ],
        }).compileComponents();
    }));

    it("should create a component", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it("heroes should be an array after getHeroes() is launched", async(() => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;

        component.getHeroes();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(Array.isArray(component.heroes)).toBeTruthy();
        });
    }));

    it("should not show any list on init", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const ul = fixture.nativeElement.querySelector("ul");
        expect(ul).toBeNull();
    });

    it("should show loader on init", () => {
        // TODO: mock div "app-baner"
    });

    it("should show list if heroes is array", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        fixture.detectChanges();

        const ul = fixture.nativeElement.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    it("list should contain hero names", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;

        component.heroes = testHeroes;
        fixture.detectChanges();

        const liCollection = fixture.nativeElement.querySelectorAll("li");

        testHeroes.forEach((hero, index) => {
            expect(liCollection[index].textContent).toContain(hero.name);
        });
    });
});
