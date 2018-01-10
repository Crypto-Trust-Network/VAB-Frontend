import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() {

  }

  // html form binding variables
  email: string;
  password: string;

  loggin() {
    this.appService.login(this.email, this.password).subscribe(
      success => {

      },
      error => {

      }
    )
  }
}
