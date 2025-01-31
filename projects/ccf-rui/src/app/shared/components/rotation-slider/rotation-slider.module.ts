import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RotationSliderComponent } from './rotation-slider.component';

import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [RotationSliderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatSliderModule,
    MatRippleModule,
    MatTooltipModule
  ],
  exports: [RotationSliderComponent]
})
export class RotationSliderModule { }
