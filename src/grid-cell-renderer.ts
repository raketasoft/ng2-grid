import {
  Component,
  ViewContainerRef,
  Input,
  OnInit
} from '@angular/core';
import { GridColumn } from './grid-column';

/**
 * GridCell component used to render grid cell template.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.4
 */
@Component({
  selector: 'ng-grid-cell-renderer',
  template: ''
})
export class GridCellRenderer implements OnInit {
  @Input() data: any;
  @Input() column: GridColumn;

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
