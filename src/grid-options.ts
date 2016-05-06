import {GridColumn} from './grid-column';
import * as _ from 'lodash';

/**
 * Grid options class.
 * Defines all configuration options for the grid component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridOptions {
  columns: Array<GridColumn> = [];
  data: Array<any> = [];
  heading: boolean = true;
  height: string;
  pageSize: number = 20;
  pageButtonCount: number = 5;
  paging: boolean = true;
  filtering: boolean = true;
  sorting: boolean = true;
  width: string = '100%';

  /**
   * Class constructor.
   *
   * @param {any} options Optional, if given options would be assigned as properties
   */
  constructor(options?: any) {
    if (!_.isUndefined(options)) {
      for (let option in options) {
        this[option] = options[option];
      }
    }
  }
}