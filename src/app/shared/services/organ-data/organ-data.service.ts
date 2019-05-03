import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PropertyPath } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, share, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { TissueSample } from '../../state/database/database.models';
import { NavigationState } from '../../state/navigation/navigation.state';
import { FilterBuilder, SearchState } from '../../state/search/search.state';
import { LocalDatabaseService } from '../database/local/local-database.service';

/**
 * A collection of counts for different objects.
 */
export interface CountMetadata {
  /**
   * The number of patients.
   */
  patients: number;

  /**
   * The number of tissue samples.
   */
  tissueSamples: number;

  /**
   * The number of tissue slices.
   */
  tissueSlices: number;

  /**
   * The number of tissue images.
   */
  tissueImages: number;

  /**
   * The number of cells.
   */
  cells: number;
}

/**
 * Injectable organ data service talks to local database.
 */
@Injectable()
export class OrganDataService {
  /**
   * Base path to images of tissues - TODO - this will come from a json file eventually
   */
  private readonly basePath = environment.ccfAssetUrl + '/organ';

  /**
   * Mapping from a tissue sample to an observable emitting counts.
   * Used to prevent the creation of new observables and the subsequent multiple queries.
   */
  private readonly countObservableMap = new WeakMap<TissueSample, Observable<CountMetadata>>();

  /**
   * Emits the currently active organ.
   */
  @Select(NavigationState.activeOrgan)
  private activeOrgan: Observable<{ id: string }>; // FIXME: Update with proper organ object

  /**
   * Emits the path for currently active organ's image.
   */
  readonly organImagePath = this.activeOrgan.pipe(
    pluck('id'),
    map(id => id && `${this.basePath}/${id}/organ.svg#organ`)
  );

  /**
   * Emits the overlay objects for currently active organ.
   */
  readonly organOverlays = this.activeOrgan.pipe(
    pluck('id'),
    switchMap(id => this.localDatabase.getTissueSamples(sample => sample.patient.anatomicalLocations[0] === id))
  );

  /**
   * Creates an instance of organ data service.
   *
   * @param localDatabase Database from which organ and related data is fetched.
   * @param store The global store.
   */
  constructor(
    private readonly localDatabase: LocalDatabaseService,
    private readonly store: Store
  ) { }

  /**
   * Queries the number of slices, images, etc. that exists for a sample.
   *
   * @param sample The tissue sample for which to count objects.
   * @returns The counts of the different objects.
   */
  getCounts(sample: TissueSample): Observable<CountMetadata> {
    if (this.countObservableMap.has(sample)) {
      return this.countObservableMap.get(sample);
    }

    const result = this.createCountsObservable(sample.id);
    this.countObservableMap.set(sample, result);
    return result;
  }

  /**
   * Creates an observable returning counts for the specified tissue sample id.
   *
   * @param sampleId The indetifier.
   * @returns An observable emitting the counts.
   */
  private createCountsObservable(sampleId: string): Observable<CountMetadata> {
    const sliceCountObservable = this.getCountsFor('getTissueSlices', SearchState.tissueSliceFilterBuilder, 'sample.id', sampleId);
    const imageCountObservable = this.getCountsFor('getTissueImages', SearchState.tissueFilterBuilder, 'slice.sample.id', sampleId);
    const counts = combineLatest(sliceCountObservable, imageCountObservable).pipe(
      map(([sliceCount, imageCount]) => ({
        patients: 1,
        tissueSamples: 1,
        tissueSlices: sliceCount,
        tissueImages: imageCount,
        cells: 0
      })),
      share()
    );

    return counts;
  }

  /**
   * Queries the number of items exists of a specific object type.
   *
   * @param method The database method used to query items.
   * @param selector The filter builder selector for the associated object type.
   * @param path Path which's value must match the provided value.
   * @param value A value to match against (usually an identifier)
   * @returns An observable emitting a count of the objects.
   */
  private getCountsFor<T>(
    method: keyof LocalDatabaseService,
    selector: (state: any) => FilterBuilder<T>,
    path: PropertyPath,
    value: string
  ): Observable<number> {
    const { localDatabase: db, store } = this;
    const queryFun = db[method].bind(db) as (filter: (obj: T) => boolean) => Observable<T[]>;
    return store.select(selector).pipe(
      map(builder => builder.addMatches(path, value)),
      map(builder => builder.toFilter()),
      switchMap(queryFun),
      map(items => items.length)
    );
  }
}
