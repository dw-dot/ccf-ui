import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

import { DetailsLabelModule } from '../../shared/components/details-label/details-label.module';
import { ExtractionSetDropdownModule } from '../../shared/components/extraction-set-dropdown/extraction-set-dropdown.module';
import { LabeledSlideToggleModule } from '../../shared/components/labeled-slide-toggle/labeled-slide-toggle.module';
import { NameInputModule } from '../../shared/components/name-input/name-input.module';
import { OpacitySliderModule } from 'ccf-shared';
import { VisibilityMenuModule } from '../../shared/components/visibility-menu/visibility-menu.module';
import { VisibilityToggleModule } from '../../shared/components/visibility-toggle/visibility-toggle.module';
import { LeftSidebarComponent } from './left-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonFileReaderModule } from '../../shared/components/json-file-reader/json-file-reader.module';



@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,

    MatDividerModule,
    DetailsLabelModule,
    LabeledSlideToggleModule,
    NameInputModule,
    VisibilityToggleModule,
    ExtractionSetDropdownModule,
    OpacitySliderModule,
    VisibilityMenuModule,
    VisibilityToggleModule,
    JsonFileReaderModule
  ],
  declarations: [LeftSidebarComponent],
  exports: [LeftSidebarComponent]
})
export class LeftSidebarModule { }
