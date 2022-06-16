import { ChangeDetectionStrategy, Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { SpatialSearch } from 'ccf-database';
import { OrganInfo } from 'ccf-shared';
import { Sex } from '../spatial-search-config/spatial-search-config.component';


@Component({
  selector: 'ccf-spatial-search-ui',
  templateUrl: './spatial-search-ui.component.html',
  styleUrls: ['./spatial-search-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpatialSearchUiComponent {
  @HostBinding('class') readonly className = 'ccf-spatial-search-ui';

  @Input() referenceOrgan: OrganInfo;

  @Input() sex: Sex = 'male';

  @Input() spatialSearch: SpatialSearch;

  @Output() readonly spatialSearchChange = new EventEmitter<SpatialSearch>();

  @Output() readonly editReferenceOrganClicked = new EventEmitter<OrganInfo>();

  runSpatialSearch(): void {
    const newSearch: SpatialSearch = {
      x: 0,
      y: 0,
      z: 0,
      radius: 100,
      target: this.referenceOrgan.id ?? '',
      sex: this.sex
    };
    this.spatialSearchChange.emit(newSearch);
  }

}
