import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {

  }

  // html form binding variables
  email: string;
  password: string;

  // message
  error: string;

  login() {
    // clear the error
    this.error = null;

    this.appService.login(this.email, this.password).subscribe(
      success => {
        console.log('success')
        // navigate to home page
        this.router.navigate(['']);
      },
      error => {
        // show the user the error
        this.error = error.error.error_description;
      }
    )
  }
}
