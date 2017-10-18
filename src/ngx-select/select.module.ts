import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbSelectComponent} from './select.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NbSelectComponent
    ],
    exports: [
        NbSelectComponent
    ]
})
export class SelectModule {
}
