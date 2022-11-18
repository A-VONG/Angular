import { DateTime } from 'luxon';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatPipe'
})
export class DateFormatPipePipe implements PipeTransform {

  transform(value: number) {
    let date = DateTime.fromSeconds(value/1000)
    return date.setLocale('fr').toLocaleString({
           year: 'numeric',
           month: 'long',
           day: 'numeric',
           hour: 'numeric',
           minute: '2-digit',
           //timeZoneName: 'short'
         });
  }


}
