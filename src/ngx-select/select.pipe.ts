import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'selectFilter'
})
export class SelectFilterPipe implements PipeTransform {
    constructor() {}
    transform(list: any[], text: string, propName?: string): any {
        if (!text) {
            return list
        }

        if (propName) {
            return list.filter((item) => {
                return item[propName].toLowerCase().findIndex(text.toLowerCase()) > -1
            })
        } else {
            return list.filter((item) => {
                return item.toLowerCase().indexOf(text.toLowerCase()) > -1
            })
        }
    }
}
