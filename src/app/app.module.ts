import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TokenService } from './services/token.service';
import { HomeComponent } from './components/home/home.component';
import { GuardService } from './services/guard.service';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppService } from './app.service';
import { RequestInterceptor } from './interceptor';
import { Injector } from '@angular/core';
import { DynamicLogoModule } from './modules/dynamic-logo/dynamic-logo.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    DynamicLogoModule
  ],
  providers: [
    TokenService,
    GuardService,
    AppService,
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
      deps: [TokenService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
