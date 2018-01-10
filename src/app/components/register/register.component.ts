import { Component, OnInit } from '@angular/core';
import { RegisterPost } from '../../models/account';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
  }

  // declare vars for the html inputs
  email: string;
  password: string;
  confirmPassword: string;

  register() {
    // create the post model
    let model = new RegisterPost();
    model.Email = this.email;
    model.Password = this.password;
    model.ConfirmPassword = this.confirmPassword;

    // call the api
    this.appService.register(model).subscribe(
      success => {
        // user is has been logged in by the app service, redirect to home page
        this.router.navigate(['']);
      },
      error => {
        // register or login failed
        // TODO show error to user
      })
  }
}
