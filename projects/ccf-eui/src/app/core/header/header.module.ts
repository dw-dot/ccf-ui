import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InfoButtonModule } from '../../modules/info/info-button/info-button.module';
import { HeaderComponent } from './header.component';


@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MatTooltipModule, InfoButtonModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }