import {Location} from "@angular/common";
import {TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

import {AppRoutingModule, routes} from "./app-routing.module";

import {AppModule} from "./app.module";

describe("AppRoutingModule", () => {
    let appRoutingModule: AppRoutingModule;

    beforeEach(() => {
        appRoutingModule = new AppRoutingModule();
    });

    it("should create an instance", () => {
        expect(appRoutingModule).toBeTruthy();
    });
});

describe("AppRoutingModule with AppModule", () => {
    let router: Router;
    let location: Location;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule.withRoutes(routes)],
        });

        router = TestBed.get(Router);
        location = TestBed.get(Location);

        router.initialNavigation();
    });

    it('navigate to "" redirects you to /dashboard', () => {
        router.navigate([""]).then(() => {
            expect(location.path()).toBe("/dashboard");
        });
    });

    it('navigate to "heroes" takes you to /heroes', () => {
        router.navigate(["/heroes"]).then(() => {
            expect(location.path()).toBe("/heroes");
        });
    });

    it('navigate to "detail/1" takes you to /detail/1', () => {
        router.navigate(["/detail/1"]).then(() => {
            expect(location.path()).toBe("/detail/1");
        });
    });
});
