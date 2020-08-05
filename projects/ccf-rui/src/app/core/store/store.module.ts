import { NgModule } from '@angular/core';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../../../environments/environment';


/**
 * States shared across the entire app.
 */
export const ROOT_STATES = [
];

@NgModule({
  imports: [
    // For some strange reason the data plugin is not happy being placed after the store module!?
    NgxsDataPluginModule.forRoot(),

    NgxsModule.forRoot(ROOT_STATES, {
      developmentMode: !environment.production
      // Consider setting compatibility and executionStrategy
      // https://www.ngxs.io/advanced/options
    }),
  ]
})
export class StoreModule { }