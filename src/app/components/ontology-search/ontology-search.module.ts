import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PopoverModule } from 'ngx-smart-popover';

import { OntologySearchComponent } from './ontology-search.component';

@NgModule({
  declarations: [OntologySearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    PopoverModule
  ],
  exports: [OntologySearchComponent]
})
export class OntologySearchModule { }