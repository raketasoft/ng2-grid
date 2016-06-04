import { Loadable } from './loadable';
import * as _ from 'lodash';

/**
 * Grid column class.
 * Defines a single grid column with its properties and methods. Use to define
 * the 'columns' property in the grid options configuration.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridColumn extends Loadable {
  static DEFAULT_FILTERING_VALUE: boolean = true;
  static DEFAULT_SORTING_VALUE: boolean = true;

  heading: string;
  name: string;
  filtering: boolean;
  sorting: boolean;
  width: string;
  template: string;
  templateDirectives: Array<any>;

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(params?: any) {
    super(params);
    if (_.isUndefined(this.filtering)) {
      this.filtering = GridColumn.DEFAULT_FILTERING_VALUE;
    }
    if (_.isUndefined(this.sorting)) {
      this.sorting = GridColumn.DEFAULT_SORTING_VALUE;
    }
    if (_.isUndefined(this.template)) {
      this.template = '{{' + this.name + '}}';
    }
    if (_.isUndefined(this.templateDirectives)) {
      this.templateDirectives = [];
    }
  }

  /**
   * Render grid heading for this column.
   *
   * @returns {string}
   */
  renderHeading(): string {
    return this.heading ? this.heading : this.name;
  }
}
