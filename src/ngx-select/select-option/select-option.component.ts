import {
    ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, OnInit,
    Output
} from '@angular/core'

@Component({
    selector: 'select-option',
    template: '<div class="option-item"><ng-content></ng-content></div>',
    styleUrls: ['select-option.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SelectOptionComponent implements OnInit {
    @Output() select$ = new EventEmitter<SelectOptionComponent>()
    @Input() text: string
    @Input() value: any
    @HostBinding('class.active') isActive = false

    constructor() {
    }

    @HostListener('click')
    optionClicked() {
        this.select$.emit(this)
        this.isActive = true
    }

    ngOnInit() {
    }

    getSelect$() {
        return this.select$
    }

    setActive() {
        this.isActive = true
    }
}
