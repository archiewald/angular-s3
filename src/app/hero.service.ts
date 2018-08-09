import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";

import {Hero} from "./hero";
import {MessageService} from "./message.service";

@Injectable({
    providedIn: "root",
})
export class HeroService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    private heroesUrl = "api/heroes";

    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = "operation", result?: T) {
        // tslint:disable-next-line:no-any
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            // tslint:disable-next-line:no-console
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** GET heroes from the server */
    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl).pipe(
            tap(() => this.log("fetched heroes")),
            catchError(this.handleError("getHeroes", []))
        );
    }

    /** GET hero by id. Will 404 if id not found */
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(() => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }
}
