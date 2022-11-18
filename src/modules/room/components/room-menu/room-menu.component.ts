import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomSocketService } from '../../services/room.socket.service';
@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less'],
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;

  rooms: Room[];

  constructor(
    private feedStore: FeedStore,
    private queries: RoomQueries,
    private roomSocketService: RoomSocketService,
    private router: Router
  ) {
    this.roomId$ = this.feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
    let room = localStorage.getItem('roomId');
    this.rooms = await this.queries.getAll();
    this.roomSocketService.onNewRoom((room: Room) => {
      this.rooms.push(room);
    });

    if (room) {
      this.router.navigate(['/app', room]);
    }
  }

  goToRoom(room: Room) {
    this.router.navigate(['/app', room.id]);
    localStorage.setItem('roomId', room.id);
  }
}
