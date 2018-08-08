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
