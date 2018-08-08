import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

import {Hero} from "./hero";
import {MessageService} from "./message.service";
import {HEROES} from "./mock-heroes";

@Injectable({
    providedIn: "root",
})
export class HeroService {
    constructor(private messageService: MessageService) {}

    getHeroes(): Observable<Hero[]> {
        this.messageService.add("HeroService: fetched heroes");
        // tslint:disable-next-line:no-magic-numbers
        return of(HEROES).pipe(delay(1000));
    }

    getHero(id: number): Observable<Hero | undefined> {
        // TODO: send the message _after_ fetching the hero
        this.messageService.add(`HeroService: fetched hero id=${id}`);
        // tslint:disable-next-line:no-magic-numbers
        return of(HEROES.find(hero => hero.id === id)).pipe(delay(1000));
    }
}

// foo() {
//     this.getHeroes().subscribe((data) => {
//         console.log(data);
//     })
// }

// async function wait(timeInMs: number): Promise<void> {
//     setTimeout(() => {
//         return;
//     }, timeInMs);
// }
