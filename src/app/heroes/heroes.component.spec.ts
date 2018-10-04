import {HttpClientTestingModule} from "@angular/common/http/testing";
import {async, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";

import {Hero} from "../hero";
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

    it("heroes should be an array after getHeroes() is launched", () => {
        // TODO: 🤷‍♂️
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;
        component.getHeroes();
        expect(typeof component.heroes).toBe("Array");
    });

    it("should not show any list on init", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        // const component = fixture.componentInstance;
        const ul = fixture.nativeElement.querySelector("ul");
        expect(ul).toBeNull();
    });

    it("should show loader on init", () => {
        // TODO
    });

    it("should show list if heroes is array", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;

        component.heroes = [];
        fixture.detectChanges();

        const ul = fixture.nativeElement.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    it("list should contain hero names", () => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const component = fixture.componentInstance;
        const testHeroes: Hero[] = [
            {id: 1, name: "Archie"},
            {id: 2, name: "Marek"},
        ];

        component.heroes = testHeroes;
        fixture.detectChanges();

        const liCollection = fixture.nativeElement.querySelectorAll("li");

        testHeroes.forEach((hero, index) => {
            expect(liCollection[index].textContent).toContain(hero.name);
        });
    });
});
