import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SpatialSearch } from 'ccf-database';
import { DataState } from '../../../core/store/data/data.state';
import { SpatialSearchUiComponent } from '../spatial-search-ui/spatial-search-ui.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SpatialSearchUiSelectors } from '../../../core/store/spatial-search-ui/spatial-search-ui.selectors';
import { OrganInfo } from 'ccf-shared';
import { Sex } from '../spatial-search-config/spatial-search-config.component';


@Component({
  selector: 'ccf-spatial-search-ui-behavior',
  templateUrl: './spatial-search-ui-behavior.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpatialSearchUiBehaviorComponent {
  @Select(SpatialSearchUiSelectors.sex)
  readonly sex$: Observable<Sex>;

  @Select(SpatialSearchUiSelectors.organ)
  readonly selectedOrgan$: Observable<OrganInfo | undefined>;

  constructor(
    private readonly dialogRef: MatDialogRef<SpatialSearchUiComponent>,
    private readonly data: DataState
  ) { }

  buttonClicked(search: SpatialSearch): void {
    const spatialSearchList = this.data.snapshot.filter.spatialSearches;
    const newList = [...spatialSearchList];
    newList.push(search);
    this.data.updateFilter({
      spatialSearches: newList
    });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
