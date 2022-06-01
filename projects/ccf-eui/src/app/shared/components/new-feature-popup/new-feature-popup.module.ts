import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NewFeaturePopupComponent } from './new-feature-popup.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [NewFeaturePopupComponent],
  exports: [NewFeaturePopupComponent]
})
export class NewFeaturePopupModule { }