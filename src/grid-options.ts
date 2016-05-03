import {GridColumn} from './grid-column';
import * as _ from 'lodash';

export class GridOptions {
  data: Array<any> = [];
  fields: Array<GridColumn> = [];
  height: string;
  paging: boolean;
  sorting: boolean = true;
  width: string = '100%';

  constructor(options?: any) {
    if (!_.isUndefined(options)) {
      for (let option in options) {
        this[option] = options[option];
      }
    }
  }
}