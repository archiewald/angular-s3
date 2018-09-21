import {HttpClientTestingModule} from "@angular/common/http/testing";
import {async, inject, TestBed} from "@angular/core/testing";
import {of} from "rxjs";

import {Hero} from "./hero";
import {HeroService} from "./hero.service";
import {MessageService} from "./message.service";

describe("HeroService", () => {
    let httpClientSpy: {get: jasmine.Spy};
    let heroService: HeroService;
    let messageService: MessageService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        messageService = new MessageService();
        heroService = new HeroService(
            // tslint:disable-next-line:no-any
            httpClientSpy as any,
            messageService
        );
        TestBed.configureTestingModule({
            providers: [HeroService],
        });
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        }).compileComponents();
    }));

    it("should be created", inject([HeroService], (service: HeroService) => {
        expect(service).toBeTruthy();
    }));

    it("should return testHeroes on getHeroes()", () => {
        const testHeroes: Hero[] = [
            {id: 1, name: "Archie"},
            {id: 2, name: "Ziomek"},
        ];

        httpClientSpy.get.and.returnValue(of(testHeroes));

        heroService
            .getHeroes()
            .subscribe(heroes => expect(heroes).toEqual(testHeroes), fail);
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });
});
