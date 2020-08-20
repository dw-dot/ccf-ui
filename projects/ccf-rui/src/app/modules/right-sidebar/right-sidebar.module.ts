import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlockSizeInputModule } from '../../shared/components/block-size-input/block-size-input.module';
import { RotationSliderModule } from '../../shared/components/rotation-slider/rotation-slider.module';
import { SlicesInputModule } from '../../shared/components/slices-input/slices-input.module';
import { RightSidebarComponent } from './right-sidebar.component';


@NgModule({
  imports: [CommonModule, BlockSizeInputModule, RotationSliderModule, SlicesInputModule],
  declarations: [RightSidebarComponent],
  exports: [RightSidebarComponent]
})
export class RightSidebarModule { }