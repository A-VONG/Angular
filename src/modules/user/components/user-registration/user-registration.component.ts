import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserQueries } from '../../services/user.queries';
import { UserService } from '../../services/user.service';

class UserRegistrationFormModel {
  username = "";
  password = "";
  confirmPassword = "";
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild("f")
  form: NgForm;

  model = new UserRegistrationFormModel();

  constructor(
    private router: Router,
    private userService: UserService,
    private userQueries: UserQueries,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  async submit() {

    // TODO  Vérifier que la confirmation de mot de passe correspond au mot de passe
    if (this.form.form.invalid || this.model.password !== this.model.confirmPassword) {
      this.nzMessageService.error("password should be confirmed")
      return
    }

    let exists = await this.userQueries.exists(this.model.username)
    
    exists ? this.nzMessageService.warning("Username already used") : 
    
    this.userService.register(this.model.username,this.model.password).then((result) => {
          
           this.goToLogin();
        }).catch((err) => {
          console.log(err);
          
        });

   

    

    
  }

  goToLogin() {
    this.router.navigateByUrl('/splash/login')
    // TODO rediriger l'utilisateur sur "/splash/login"
  }
}
