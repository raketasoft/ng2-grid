import {Loadable} from './loadable';
import {GridColumn} from './grid-column';
import {GridDataProvider} from './grid-data-provider';
import * as _ from 'lodash';

/**
 * Grid options class.
 * Defines all configuration options for the grid component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridOptions extends Loadable {
  columns: Array<GridColumn>;
  dataProvider: GridDataProvider;
  defaultPageSize: number;
  heading: boolean;
  height: string;
  pageButtonCount: number;
  pageElementPosition: string;
  pageSizeOptions: Array<number>
  pageSizeElementPosition: string;
  paging: boolean;
  filtering: boolean;
  sorting: boolean;
  width: string;

  static DEFAULT_PAGE_SIZE_VALUE: number = 20;
  static DEFAULT_HEADING_VALUE: boolean = true;
  static DEFAULT_PAGE_BUTTON_COUNT_VALUE: number = 5;
  static DEFAULT_PAGE_ELEMENT_POSITION_VALUE: string = 'left';
  static DEFAULT_PAGE_SIZE_OPTIONS_VALUE: Array<number> = [20, 50, 100];
  static DEFAULT_PAGE_SIZE_ELEMENT_POSITION_VALUE: string = 'right';
  static DEFAULT_PAGING_VALUE: boolean = true;
  static DEFAULT_FILTERING_VALUE: boolean = true;
  static DEFAULT_SORTING_VALUE: boolean = true;
  static DEFAULT_WIDTH_VALUE: string = '100%';

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(params?: any) {
    super(params);
    if (_.isUndefined(this.columns)) {
      this.columns = [];
    }
    if (_.isUndefined(this.dataProvider)) {
      this.dataProvider = new GridDataProvider();
    }
    if (_.isUndefined(this.defaultPageSize)) {
      this.defaultPageSize = GridOptions.DEFAULT_PAGE_SIZE_VALUE;
    }
    if (_.isUndefined(this.heading)) {
      this.heading = GridOptions.DEFAULT_HEADING_VALUE;
    }
    if (_.isUndefined(this.pageButtonCount)) {
      this.pageButtonCount = GridOptions.DEFAULT_PAGE_BUTTON_COUNT_VALUE;
    }
    if (_.isUndefined(this.pageElementPosition)) {
      this.pageElementPosition = GridOptions.DEFAULT_PAGE_ELEMENT_POSITION_VALUE;
    }
    if (_.isUndefined(this.pageSizeOptions)) {
      this.pageSizeOptions = GridOptions.DEFAULT_PAGE_SIZE_OPTIONS_VALUE;
    }
    if (_.isUndefined(this.pageSizeElementPosition)) {
      this.pageSizeElementPosition = GridOptions.DEFAULT_PAGE_SIZE_ELEMENT_POSITION_VALUE;
    }
    if (_.isUndefined(this.paging)) {
      this.paging = GridOptions.DEFAULT_PAGING_VALUE;
    }
    if (_.isUndefined(this.filtering)) {
      this.filtering = GridOptions.DEFAULT_FILTERING_VALUE;
    }
    if (_.isUndefined(this.sorting)) {
      this.sorting = GridOptions.DEFAULT_SORTING_VALUE;
    }
    if (_.isUndefined(this.width)) {
      this.width = GridOptions.DEFAULT_WIDTH_VALUE;
    }
    this.dataProvider.pageSize = this.defaultPageSize;
  }
}