import {
  Component,
  ViewContainerRef,
  Input,
  OnInit
} from '@angular/core';
import { GridColumnComponent } from './grid-column.component';

/**
 * GridCell component used to render Grid cell template.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.4
 */
@Component({
  selector: 'ng-grid-cell-renderer',
  template: ''
})
export class GridCellRendererComponent implements OnInit {
  @Input() data: any;
  @Input() column: GridColumnComponent;

  /**
   * Class constructor.
   *
   * @param {ViewContainerRef} viewContainerRef
   */
  constructor(private viewContainerRef: ViewContainerRef) {}

  /**
   * Handle onInit event.
   */
  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.column.template, {
      'column': this.column,
      'data': this.data
    });
  }
}
