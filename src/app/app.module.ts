import {HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HeroDetailComponent} from "./hero-detail/hero-detail.component";
import {HeroesComponent} from "./heroes/heroes.component";
import {InMemoryDataService} from "./in-memory-data.service";
import {MessagesComponent} from "./messages/messages.component";
import {LoaderComponent} from "./utils/loader/loader.component";

@NgModule({
    declarations: [
        AppComponent,
        HeroesComponent,
        HeroDetailComponent,
        MessagesComponent,
        DashboardComponent,
        LoaderComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
        // and returns simulated server responses.
        // Remove it when a real server is ready to receive requests.
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
            dataEncapsulation: false,
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})

// tslint:disable-next-line: no-unnecessary-class
export class AppModule {}
