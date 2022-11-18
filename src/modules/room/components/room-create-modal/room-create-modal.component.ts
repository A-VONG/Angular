import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RoomType } from '../../room.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoomService } from '../../services/room.service';

export class CreateRoomFormModel {
  name: string = '';
  type: RoomType = RoomType.Text;
}

@Component({
  selector: 'app-room-create-modal',
  templateUrl: './room-create-modal.component.html',
  styleUrls: ['./room-create-modal.component.less'],
})
export class RoomCreateModalComponent implements OnInit {
  @ViewChild('f')
  form: NgForm;

  isVisible: boolean = false;
  model = new CreateRoomFormModel();

  constructor(
    private roomService: RoomService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {}

  async onOk() {
    if (this.form.form.valid) {
      this.roomService
        .create(this.model.name, this.model.type)
        .then(async (result) => {
          await this.roomService.fetch();
          this.close();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.nzMessageService.error('Nom de la room obligatoire');
    }
  }

  onCancel() {
    this.close();
  }

  open() {
    this.form.resetForm(new CreateRoomFormModel());
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
