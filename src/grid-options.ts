import {Object} from './object';
import {GridColumn} from './grid-column';
import * as _ from 'lodash';

/**
 * Grid options class.
 * Defines all configuration options for the grid component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridOptions extends Object {
  columns: Array<GridColumn>;
  data: Array<any>;
  heading: boolean = true;
  height: string;
  paging: boolean = true;
  pageButtonCount: number = 5;
  pageElementPosition: string = 'left';
  pageSize: number = 20;
  pageSizeOptions: Array<number> = [20, 50, 100];
  pageSizeElementPosition: string = 'right';
  filtering: boolean = true;
  sorting: boolean = true;
  width: string = '100%';

  constructor(params?: any) {
    super(params);

    if (_.isUndefined(this.columns)) {
      this.columns = [];
    }
    if (_.isUndefined(this.data)) {
      this.data = [];
    }
  }
}