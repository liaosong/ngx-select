import {
    AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Inject, OnDestroy, Optional,
    Output,
    QueryList
} from '@angular/core'
import { SelectOptionComponent } from './select-option/select-option.component'
import { Subscription } from 'rxjs/Subscription'
import { DOCUMENT } from '@angular/common'
import { ControlValueAccessor, NgControl } from '@angular/forms'

function isValidValue(value) {
    return value !== undefined && value !== null
}

@Component({
    selector: 'nb-select',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.scss'],
})
export class NbSelectComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    public isOpen = false
    public text = ''
    @ContentChildren(SelectOptionComponent) selectOptions: QueryList<SelectOptionComponent>
    @Output() change = new EventEmitter()
    @Output() onInit = new EventEmitter()
    private subscriptions: Subscription[] = []
    private optionChangeSub: Subscription
    private handler: Function
    private actived: SelectOptionComponent
    private searchState = {
        on: false,
        text: ''
    }
    private outerValue
    constructor(
        @Inject(DOCUMENT) private document: any,
        @Optional() public _control: NgControl,
        private cdRef: ChangeDetectorRef
    ) {
        if (this._control) {
            this._control.valueAccessor = this
        }
    }

    public onChange = (value: any) => {}
    public onTouched = () => {}

    ngAfterViewInit() {
        this.addWatchOptionSelect()
        this.optionChangeSub = this.selectOptions.changes.subscribe((res) => {
            this.addWatchOptionSelect()
        })
        this.addDocumentClick()
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe())
        this.removeDocumentClick()
        this.optionChangeSub.unsubscribe()
        this.change.complete()
    }

    writeValue(value) {
        this.outerValue = value
        const actived = this.resolveValue()
        if (actived) {
            this.actived.setActive()
        }
        if (isValidValue(value)) {
            this.onInit.emit(value)
            this.onInit.complete()
        }
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean): void {
    }

    containerClicked(event) {
        event.stopPropagation()
    }

    inputFocus(inputElem) {
        this.open()
        inputElem.select()
    }

    open() {
        this.isOpen = true
    }

    close() {
        if (this.actived) {
            this.text = this.actived.text
        } else {
            this.text = ''
        }
        this.searchState.on = false
        this.searchState.text = ''
        this.isOpen = false
    }

    onInput() {
        this.searchState.on = true
        this.searchState.text = this.text
    }

    getFilterString() {
        if (this.searchState.on) {
            return this.searchState.text
        } else {
            return ''
        }
    }

    private preChange(value) {
        this.onChange(value)
        this.change.emit(value)
    }

    private addDocumentClick() {
        const self = this
        this.handler = () => {
            self.close()
        }
        this.document.addEventListener('click', this.handler)
    }

    private removeDocumentClick() {
        this.document.removeEventListener('click', this.handler)
    }

    private cleanOptionWatchers() {
        this.subscriptions.forEach((item) => item.unsubscribe())
        this.subscriptions = []
    }

    private addWatchOptionSelect() {
        this.cleanOptionWatchers()
        this.selectOptions.forEach((optionComponent) => {
            const subscribe = optionComponent.getSelect$().subscribe((selected) => {
                this.close()
                this.actived = selected
                this.text = selected.text
                const value = isValidValue(selected.value) ? selected.value : selected.text
                this.preChange(value)
            })
            this.subscriptions.push(subscribe)
        })
        this.resolveValue()
    }

    private resolveValue() {
        if (this.selectOptions && this.selectOptions.length > 0) {
            const actived = this.selectOptions.find((item) => {
                const selectValue = isValidValue(item.value) ? item.value : item.text

                return selectValue === this.outerValue
            })
            if (actived) {
                this.actived = actived
                this.text = this.actived.text
                this.cdRef.detectChanges()

                return this.actived
            }
        }
    }
}
