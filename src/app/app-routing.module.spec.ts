// tslint:disable:no-magic-numbers

import {Location} from "@angular/common";
import {fakeAsync, TestBed, tick} from "@angular/core/testing";
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

    it(
        'navigate to "" redirects you to /dashboard',
        fakeAsync(() => {
            router.navigate([""]);
            tick(50);
            expect(location.path()).toBe("/dashboard");
        })
    );

    it(
        'navigate to "heroes" redirects you to /heroes',
        fakeAsync(() => {
            router.navigate(["/heroes"]);
            tick(50);
            expect(location.path()).toBe("/heroes");
        })
    );
});
