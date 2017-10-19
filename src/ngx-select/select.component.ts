import {
    AfterViewInit, Component, ContentChildren, Inject, OnDestroy, Optional,
    QueryList
} from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';

function isUndefined(value) {
    return value === undefined;
}

@Component({
    selector: 'nb-select',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.scss'],
})
export class NbSelectComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    public isOpen = false;
    public text = '';
    private subscriptions: Subscription[] = [];
    private handler: Function;
    private actived: SelectOptionComponent;
    private searchState = {
        on: false,
        text: ''
    };
    @ContentChildren(SelectOptionComponent) selectOptions: QueryList<SelectOptionComponent>;
    constructor(
        @Inject(DOCUMENT) private document: any,
        @Optional() public _control: NgControl,
    ) {
        if (this._control) {
            this._control.valueAccessor = this;
        }
    }

    public onChange = (value: any) => {};
    public onTouched = () => {};

    ngAfterViewInit() {
        this.addWatchOptionSelect();
        this.selectOptions.changes.subscribe((res) => {
            this.addWatchOptionSelect();
        });
        this.addDocumentClick();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.removeDocumentClick();
    }

    writeValue(value) {
        if (this.selectOptions && this.selectOptions.length > 0) {
            const actived = this.selectOptions.find((item) => {
                const selectValue = isUndefined(item.value) ? item.text : item.value;
                return selectValue === value;
            });
            if (actived) {
                actived.setActive();
                this.actived = actived;
                this.text = this.actived.text;
            }
        }
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    containerClicked(event) {
        event.stopPropagation();
    }

    inputFocus(inputElem) {
        this.open();
        inputElem.select();
    }

    open() {
        this.isOpen = true;
    }

    close() {
        if (this.actived) {
            this.text = this.actived.text;
        } else {
            this.text = '';
        }
        this.searchState.on = false;
        this.searchState.text = '';
        this.isOpen = false;
    }

    onInput() {
        this.searchState.on = true;
        this.searchState.text = this.text;
    }

    getFilterString() {
        if (this.searchState.on) {
            return this.searchState.text;
        } else {
            return '';
        }
    }

    private addDocumentClick() {
        const self = this;
        this.handler = () => {
            self.close();
        };
        this.document.addEventListener('click', this.handler);
    }

    private removeDocumentClick() {
        this.document.removeEventListener('click', this.handler);
    }

    private cleanOptionWatchers() {
        this.subscriptions.forEach((item) => item.unsubscribe());
        this.subscriptions = [];
    }

    private addWatchOptionSelect() {
        this.cleanOptionWatchers();
        this.selectOptions.forEach((optionComponent) => {
            const subscribe = optionComponent.getSelect$().subscribe((selected) => {
                this.close();
                this.actived = selected;
                this.text = selected.text;
                const value = isUndefined(selected.value) ? selected.text : selected.value;
                this.onChange(value);
            });
            this.subscriptions.push(subscribe);
        });
    }
}
