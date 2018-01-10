import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private appService: AppService) { }

  isLoggedIn: boolean;
  ngOnInit() {
    this.appService.loggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }
}
