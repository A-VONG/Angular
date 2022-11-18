import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationStore } from './notification.store';
import { NotificationService } from './services/notification.service';
import { NotificationQueries } from './services/notification.queries';
import { LocalNotificationQueries } from './services/platform/local/notification.queries.local';
import { HttpNotificationQueries } from './services/platform/http/notification.queries.http';
import { NotificationCommands } from './services/notification.commands';
import { HttpNotificationCommands } from './services/platform/http/notification.commands.http';
import { NotificationSocketService } from './services/notification.socket.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DateFormatPipe } from './services/date-format.pipe';

@NgModule({
  providers: [NotificationStore, NotificationService,NzNotificationService,
    {
      provide: NotificationQueries,
      useClass: HttpNotificationQueries
    }, {
      provide: NotificationCommands,
      useClass: HttpNotificationCommands
    }, NotificationSocketService],
  imports: [
    CommonModule,
    NzMessageModule
  ],
  exports:[NotificationComponent],
  declarations: [NotificationComponent, NotificationItemComponent, DateFormatPipe]
})
export class NotificationModule { }
