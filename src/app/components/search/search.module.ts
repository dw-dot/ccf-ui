import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgeSelectorModule } from '../age-selector/age-selector.module';
import { GenderSelectorModule } from '../gender-selector/gender-selector.module';
import { OntologySearchModule } from '../ontology-search/ontology-search.module';
import { OntologyTreeModule } from '../ontology-tree/ontology-tree.module';
import { SearchCategoriesModule } from '../search-categories/search-categories.module';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [
    CommonModule,
    AgeSelectorModule,
    GenderSelectorModule,
    OntologySearchModule,
    SearchCategoriesModule,
    OntologyTreeModule,
    SearchCategoriesModule,
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent]
})
export class SearchModule { }