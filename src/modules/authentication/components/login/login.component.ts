import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../../services/authentication.service';

class LoginFormModel {
  username = '';
  password = '';
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  @ViewChild(NgForm, { static: false })
  ngForm: NgForm;

  model = new LoginFormModel();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {}

  goToRegistration() {
    this.router.navigate(['/splash/register']);
    // TODO naviguer vers "/splash/register"
  }

  submit() {
    this.login();
  }

  async login() {
    console.log(this.model.username, this.model.password);
    if (this.ngForm.form.invalid) {
      return;
    }

    try {
      // TODO vérifier le résultat de l'authentification. Rediriger sur "/" en cas de succès ou afficher une erreur en cas d'échec
      let result = await this.authService.authenticate(this.model.username, this.model.password)
      if(result.success) {
        this.router.navigate(['/']);
      } else {
        this.nzMessageService.error("Username ou mot de passe incorrect.");
      }

    } catch (e) {
      this.nzMessageService.error("Une erreur est survenue. Veuillez réessayer plus tard");
    }
  }
}
