import {HttpClientTestingModule} from "@angular/common/http/testing";
import {async, inject, TestBed} from "@angular/core/testing";

import {HeroService} from "./hero.service";

describe("HeroService", () => {
    beforeEach(() => {
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
});
