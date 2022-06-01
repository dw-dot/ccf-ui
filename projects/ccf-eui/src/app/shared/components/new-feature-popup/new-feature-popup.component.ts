import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';


@Component({
  selector: 'ccf-new-feature-popup',
  templateUrl: './new-feature-popup.component.html',
  styleUrls: ['./new-feature-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFeaturePopupComponent {
  @HostBinding('class') readonly className = 'ccf-new-feature-popup';

  @Output() readonly moreClick = new EventEmitter();

  @Output() readonly closeDialog = new EventEmitter();

}