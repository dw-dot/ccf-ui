import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AggregateResult, Filter } from 'ccf-database';
import { ALL_ORGANS } from 'ccf-shared';
import { Observable, of } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

import { DataSourceService } from './core/services/data-source/data-source.service';


@Component({
  selector: 'ccf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @Input() organIri = 'http://purl.obolibrary.org/obo/UBERON_0002097';
  @Input() sex: 'Both' | 'Male' | 'Female' = 'Female';
  @Input() side?: 'Left' | 'Right' = 'Left';

  statsLabel = 'Loading...';
  stats$: Observable<AggregateResult[]>;

  private readonly referenceOrgans$ = this.source.getReferenceOrgans().pipe(shareReplay(1));

  constructor(readonly source: DataSourceService) {
    this.updateData();
  }

  updateData(): void {
    this.referenceOrgans$.pipe(take(1)).subscribe((_referenceOrgans) => {
      let organ = ALL_ORGANS.find(o => o.id === this.organIri);
      if (organ) {
        if (organ.side && organ.side !== this.side?.toLowerCase()) {
          const otherSideOrgan = ALL_ORGANS.find(o => o.organ === organ?.organ && o.side === this.side?.toLowerCase());
          if (otherSideOrgan) {
            organ = otherSideOrgan;
            this.organIri = otherSideOrgan.id as string;
          }
        }
        this.statsLabel = [this.sex, organ.organ, this.side].filter(n => !!n).join(', ');
        this.stats$ = this.source.getAggregateResults(
          { sex: this.sex, ontologyTerms: [ organ.id ] } as Filter
        );
      } else {
        this.statsLabel = `Unknown IRI: ${this.organIri}`;
        this.stats$ = of([]);
      }
    });
  }

  updateSex(sex: 'Both' | 'Male' | 'Female'): void {
    this.sex = sex;
    this.updateData();
  }

  updateSide(side: 'Left' | 'Right'): void {
    this.side = side;
    this.updateData();
  }
}
