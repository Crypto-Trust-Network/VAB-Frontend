import { Component } from '@angular/core';
import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { HttpRequest, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private appService: AppService, private http: HttpClient) {


    this.http.get(environment.base_endpoint + '/api/account/test').subscribe(r => {
      console.log(r);
    })
  }
}
