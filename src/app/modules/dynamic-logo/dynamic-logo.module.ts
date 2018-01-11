import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicLogoComponent } from './dynamic-logo/dynamic-logo.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DynamicLogoComponent,
  ],
  declarations: [
    DynamicLogoComponent,
  ]
})
export class DynamicLogoModule { }
