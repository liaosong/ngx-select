import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NbSelectComponent } from './select.component'
import { FormsModule } from '@angular/forms'
import { SelectOptionComponent } from './select-option/select-option.component'
import { SelectFilterPipe } from './select.pipe'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        NbSelectComponent,
        SelectOptionComponent,
        SelectFilterPipe,
    ],
    exports: [
        NbSelectComponent,
        SelectOptionComponent,
        SelectFilterPipe,
    ]
})
export class NgxSelectModule {
}
