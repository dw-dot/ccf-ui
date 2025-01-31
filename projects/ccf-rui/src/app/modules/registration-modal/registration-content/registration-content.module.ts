import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RegistrationContentComponent } from './registration-content.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NameInputModule } from '../../../shared/components/name-input/name-input.module';
import { LabeledSlideToggleModule } from '../../../shared/components/labeled-slide-toggle/labeled-slide-toggle.module';
import { OrganSelectorModule } from 'ccf-shared';


@NgModule({
  declarations: [RegistrationContentComponent],
  imports: [CommonModule, MatButtonModule, MatTooltipModule, NameInputModule, LabeledSlideToggleModule, OrganSelectorModule],
  exports: [RegistrationContentComponent]
})
export class RegistrationContentModule { }
