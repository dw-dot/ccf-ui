import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';


import { BlockSizeInputComponent } from './block-size-input.component';


@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule
  ],
  declarations: [BlockSizeInputComponent],
  exports: [BlockSizeInputComponent]
})
export class BlockSizeInputModule { }
