import { NotifInfo, PostLikedNotification } from './../../notification.model';
import { NotificationStore } from './../../notification.store';
import { NotificationState } from './../../notification.state';
import { Component, OnInit } from '@angular/core';
import { AnyNotification } from '../../notification.model';
import { RoomType } from '../../../room/room.model';
import { NotificationService } from '../../services/notification.service';
import { NotificationQueries } from '../../services/notification.queries';
import { NotificationSocketService } from '../../services/notification.socket.service';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less']
})
export class NotificationComponent implements OnInit {

  isVisible: boolean = false;

  notifications: AnyNotification[]
  notifications$: Observable<AnyNotification[]>;
  dataToShow: NotifInfo

  constructor(private notificationService: NotificationService, private notificatStore: NotificationStore,private notificationSocketService:NotificationSocketService, private notification: NzNotificationService) {
    this.notifications$ = this.notificatStore.get(s=>s.notifications)
   }

  async webNotification(notification : AnyNotification) {
    if(notification.viewedAt) return;

    let subject = notification.subject;
    let username = notification.payload.user.username;

    Notification.requestPermission().then(function(result) {
      let img  = ''
      let message = ''
      if (subject === "post_liked") {
        img = 'https://image.shutterstock.com/image-vector/counter-notification-icon-social-media-260nw-1340641793.jpg'
        message = 'Your post has been liked'
      } else if (subject === "new_user") {
        img = 'https://cdn3.iconfinder.com/data/icons/basicolor-essentials/24/055_add_new_user-512.png'
        message = "There is a new user in the commun'iti !"
      } else {
        img = 'https://image.shutterstock.com/image-vector/add-users-icon-group-people-260nw-1536547337.jpg'
        message = 'A new room has been created'
      }
      const text = message;
      const notification = new Notification(username, { body: text, icon: img });

      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          notification.close();
        }
      });
    });
  }

  async ngOnInit() {
    let shouldShowNotif = true;
    Notification.requestPermission();
    this.notificationSocketService.onNewNotification(async notif => {
      this.notificatStore.appendNotification(notif)
      this.dataToShow = this.getNotifInfo(notif)
      this.notification.create(
        'info',
        this.dataToShow.subject,
        this.dataToShow.message
      );
      this.notificatStore.appendNotification(notif);
      if(shouldShowNotif) {
        this.webNotification(notif);
      }
    })
    document.addEventListener("visibilitychange", function() {
      shouldShowNotif = document.visibilityState !== 'visible';
    });
    
    await this.notificationService.fetch()  
  }

  
    open(event:Event) {
      this.isVisible = false;
      
    }

    onCancel() {
      this.close();
    }

    close() {
      this.isVisible = false;
    }

    getNotifInfo(notif:AnyNotification):NotifInfo{
    
      let data:NotifInfo = {
        subject: "",
        message: "",
        photoUser: "",
        link: ""
      }
      if (notif) {
        switch (notif.subject) {
          case 'room_added':
            data.subject = 'Room Added'
            data.message = 'A Room was added by '+notif.payload.user.username
            data.photoUser=notif.payload.user.photoUrl
            data.link = "room" in notif.payload ? notif.payload.room.id : "#"
            return data;
          case 'post_liked':
            data.subject = 'Post Liked'
            data.message = 'Your post was liked by '+notif.payload.user.username
            data.photoUser= notif.payload.user.photoUrl
            data.link = "postId" in notif.payload ? notif.payload.postId : "#"
            return data;
          case 'new_user':
            data.subject = 'Room Added'
            data.message = 'A Room was added by '+ notif.payload.user.username
            data.photoUser= notif.payload.user.photoUrl
            data.link = notif.payload.user.id
            return data;
        
          default:
            data.subject = 'No Subject Found'
            data.message = 'No message'
            data.photoUser= '#'
            return data;
            
        } 
      } 
      return data
    }
  

}
