import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private appService: AppService, private router: Router) { }

  isLoggedIn: boolean;
  ngOnInit() {
    this.appService.loggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  logout() {
    this.appService.logout();

    this.router.navigate(['']);
  }

  login() {
    this.router.navigate(['login']);
  }
}
