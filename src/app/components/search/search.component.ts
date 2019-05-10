import { Component } from '@angular/core';
import { OntologyService } from 'src/app/shared/services/ontology/ontology.service';

/**
 * Container component for search filters.
 */
@Component({
  selector: 'ccf-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  /**
  * Available search filter categories and their values, TODO - needs to be fetched from the data
  * based on the implementation
  */
  filterCategories = new Map([
    ['Technologies', ['IMS', 'MxIF', 'AF', 'PAS', 'IHC']],
    ['TMCs', ['TMC-Vanderbilt', 'TMC-UCSD', 'TMC-Stanford', 'TMC-Florida', 'TMC-CalTech']]
  ]);

  constructor(readonly ontology: OntologyService) { }
}
