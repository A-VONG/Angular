import { Component, OnInit } from '@angular/core';
import { AnyNotification } from '../../notification.model';
import { NotificationStore } from '../../notification.store';
import { NotificationService } from '../../services/notification.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.less'],
})
export class NotificationListComponent implements OnInit {
  notifications: AnyNotification[];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private notificationStore: NotificationStore,
    private notification: NzNotificationService
  ) {}

  async ngOnInit() {
    await this.notificationService.fetch();
    this.notificationStore.hasUnread$.subscribe((hasUnread) => {
      const oldNotifications = localStorage.getItem('notifications');
      const currentNotifications =
        this.notificationStore.value.notifications.map((n) => {
          if (n.subject === 'new_user') {
            n.displayMessage = 'Un nouvel utilisateur a rejoint la plateforme';
          } else if (n.subject === 'post_liked') {
            n.displayMessage = 'Un utilisateur a liké un de vos posts';
          } else if (n.subject === 'room_added') {
            n.displayMessage = 'Une nouvelle room a été créée';
          }

          return n;
        });

      if (oldNotifications) {
        console.log(JSON.parse(oldNotifications));

        if (currentNotifications.length > JSON.parse(oldNotifications).length) {
          for (
            let i = JSON.parse(oldNotifications).length;
            i < currentNotifications.length;
            i++
          ) {
            const newNotification = currentNotifications[i];

            this.notification
              .blank(
                `${newNotification.payload.user.username}`,
                `${newNotification.displayMessage}`
              )
              .onClick.subscribe(() => {
                if (newNotification.subject === 'room_added') {
                  this.router.navigate([
                    `app/${newNotification.payload.room.id}`,
                  ]);
                } else if (newNotification.subject === 'post_liked') {
                  this.router.navigate([
                    `app/${newNotification.payload.roomId}`,
                    { fragment: newNotification.payload.postId },
                  ]);
                }
              });

            const webNotification = new Notification(
              `${newNotification.payload.user.username}`,
              {
                body: `${newNotification.displayMessage}`,
                icon: `${newNotification.payload.user.photoUrl}`,
              }
            );

            document.addEventListener('visibilitychange', function () {
              if (document.visibilityState === 'visible') {
                webNotification.close();
              }
            });
          }
        }
      }

      this.notifications = currentNotifications.reverse();

      localStorage.setItem(
        'notifications',
        JSON.stringify(currentNotifications)
      );
    });
  }
}
