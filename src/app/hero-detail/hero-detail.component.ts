import {Component, OnInit} from "@angular/core";

import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

import {Hero} from "../hero";
import {HeroService} from "../hero.service";

@Component({
    selector: "app-hero-detail",
    templateUrl: "./hero-detail.component.html",
    styleUrls: ["./hero-detail.component.css"],
})
export class HeroDetailComponent implements OnInit {
    hero?: Hero;
    showLoader = false;

    constructor(
        private route: ActivatedRoute,
        private heroService: HeroService,
        private location: Location
    ) {}

    ngOnInit() {
        this.getHero();
    }

    getHero(): void {
        this.showLoader = true;
        // tslint:disable-next-line:no-non-null-assertion
        const id = +this.route.snapshot.paramMap.get("id")!;
        this.heroService.getHero(id).subscribe(hero => {
            this.hero = hero;
            this.showLoader = false;
        });
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        // tslint:disable-next-line:no-non-null-assertion
        this.heroService.updateHero(this.hero!).subscribe(() => this.goBack());
    }
}
