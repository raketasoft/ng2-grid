import {
  Component,
  TemplateRef,
  Input,
  ContentChild,
  OnInit
} from '@angular/core';
import * as _ from 'lodash';

/**
 * Grid column class.
 * Defines a single grid column with its properties and methods. Use to define
 * the 'columns' property in the grid options configuration.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
@Component({
  'selector': 'ng-grid-column',
  'template': ''
})
export class GridColumn implements OnInit {
  static DEFAULT_FILTERING_VALUE: boolean = true;
  static DEFAULT_SORTING_VALUE: boolean = true;

  @Input() heading: string;
  @Input() name: string;
  @Input() filtering: boolean;
  @Input() sorting: boolean;
  @Input() width: string;
  @Input() textAlign: string;
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  /**
   * Handle OnInit event.
   */
  ngOnInit() {
    if (_.isUndefined(this.filtering)) {
      this.filtering = GridColumn.DEFAULT_FILTERING_VALUE;
    }
    if (_.isUndefined(this.sorting)) {
      this.sorting = GridColumn.DEFAULT_SORTING_VALUE;
    }
  }

  /**
   * Resolve grid heading value for this column.
   *
   * @returns {string}
   */
  resolveHeading(): string {
    return this.heading ? this.heading : this.name;
  }

  /**
   * Resolve grid cell value for given column name and data row.
   *
   * @param {any} data
   * @param {string} columnName
   *
   * @returns {string}
   */
  resolveCell(data: any, columnName: string = this.name): string {
      return _.get(data, columnName) as string;
  }
}
