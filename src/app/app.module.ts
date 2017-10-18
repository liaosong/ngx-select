import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SelectModule} from '../ngx-select/select.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
