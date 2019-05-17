import { Component, Output, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NavigationService } from '../../shared/services/navigation/navigation.service';

/**
 * A sidebar component with buttons for navigating between different views.
 */
@Component({
  selector: 'ccf-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  /**
   * Indicates whether the search icon is considered active or not.
   */
  @Input() searchActive = false;

  /**
   * Emits whenever the search icon is activated/deactivated.
   */
  @Output() searchActiveChange: Observable<boolean>;

  /**
   * Indicates whether the comment item is currenlty being hovered over.
   */
  isCommentItemHovered = false;

  /**
   * Internal subject for `searchActive`.
   */
  private readonly searchActiveSubject = new Subject<boolean>();

  /**
   * Creates an instance of leftbar component.
   *
   * @param navigator The service used to get correct url paths.
   */
  constructor(readonly navigator: NavigationService) {
    this.searchActiveChange = this.searchActiveSubject.asObservable();
  }

  /**
   * Toggles the state of the search.
   * Also emits the new state to `searchActive`.
   */
  toggleSearchActive(): void {
    this.searchActive = !this.searchActive;
    this.searchActiveSubject.next(this.searchActive);
  }
}