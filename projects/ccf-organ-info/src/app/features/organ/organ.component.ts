import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild,
} from '@angular/core';
import { SpatialSceneNode } from 'ccf-body-ui';
import { SpatialEntity } from 'ccf-database';
import { BodyUiComponent } from 'ccf-shared';
import { GoogleAnalyticsService } from 'ngx-google-analytics';


@Component({
  selector: 'ccf-organ',
  templateUrl: './organ.component.html',
  styleUrls: ['./organ.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganComponent implements OnInit, OnChanges {
  @Input() organ: SpatialEntity | undefined;
  @Input() scene: SpatialSceneNode[];
  @Input() organIri: string;
  @Input() sex: 'Male' | 'Female' | 'Both';
  @Input() side?: 'Left' | 'Right';

  @Output() readonly sexChange = new EventEmitter<'Male' | 'Female'>();
  @Output() readonly sideChange = new EventEmitter<'Left' | 'Right'>();

  @ViewChild('bodyUI', { static: true }) readonly bodyUI!: BodyUiComponent;

  constructor(readonly ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
    this.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bodyUI && 'organ' in changes) {
      this.reset();
    }
  }

  updateSex(selection: 'Male' | 'Female'): void {
    this.sex = selection;
    this.sexChange.emit(this.sex);
  }

  updateSide(selection: 'Left' | 'Right'): void {
    this.side = selection;
    this.sideChange.emit(this.side);
  }

  private reset(): void {
    const { bodyUI, organ } = this;
    if (organ) {
      if (!organ.side) {
        this.side = undefined;
      }

      const { x_dimension: x, y_dimension: y, z_dimension: z } = organ;
      bodyUI.rotation = bodyUI.rotationX = 0;
      bodyUI.bounds = { x: 1.25 * x / 1000, y: 1.25 * y / 1000, z: 1.25 * z / 1000 };
      bodyUI.target = [x / 1000 / 2, y / 1000 / 2, z / 1000 / 2];
    }
  }
}