import { AnyNotification, NotifInfo } from './../../notification.model';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.less']
})
export class NotificationItemComponent implements OnInit {
  @Input()
  notif: AnyNotification;
  notifInfo: NotifInfo;
  constructor(private notificationService:NotificationService, private router: Router) {
    this.notifInfo = this.getNotifInfo(this.notif)
   }

  ngOnInit(): void {
    this.notifInfo = this.getNotifInfo(this.notif)
    //console.log(this.notif);
    
    
    
    
  }

  getNotifInfo(notif:AnyNotification):NotifInfo{
    
    let data:NotifInfo = {
      subject: "",
      message: "",
      photoUser: "",
      link: ""
    }
    if (this.notif) {
      let dateString = this.notif.timestamp / 1000
      switch (this.notif.subject) {
        case 'room_added':
          data.subject = 'Room Added'
          data.message = 'A Room was added by '+this.notif.payload.user.username
          data.photoUser=this.notif.payload.user.photoUrl
          data.link = "room" in this.notif.payload ? "app/"+this.notif.payload.room.id : "#"
          data.date = dateString
          data.viewed = this.notif.viewedAt
          return data;
        case 'post_liked':
          data.subject = 'Post Liked'
          data.message = 'Your post was liked by '+this.notif.payload.user.username
          data.photoUser=this.notif.payload.user.photoUrl
          data.link = "postId" in this.notif.payload ? "app/"+this.notif.payload.roomId : "#"
          data.date = dateString
          data.viewed = this.notif.viewedAt
          return data;
        case 'new_user':
          data.subject = 'User Added'
          data.message = 'Say Hello To  '+this.notif.payload.user.username
          data.photoUser=this.notif.payload.user.photoUrl
          data.link = this.notif.payload.user.id
          data.date = dateString
          data.viewed = this.notif.viewedAt
          return data;
      
        default:
          data.subject = 'No Subject Found'
          data.message = 'No message'
          data.photoUser= '#'
          data.date = dateString
          return data;
          
      } 
    } 
    return data
  }

  viewNotif(){
    

   this.notificationService.markAsViewed().then((result) => {
     
     this.router.navigateByUrl(this.notifInfo.link)
   }).catch((err) => {
     console.log(err);
     
   });
  }

}
