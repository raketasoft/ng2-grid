import { Http } from '@angular/http';
import { Loadable } from './loadable';
import * as _ from 'lodash';

/**
 * Grid options class.
 * Defines all configuration options for the grid component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridOptions extends Loadable {
  additionalRequestParams: any;
  columns: Array<any>;
  data: Array<any>;
  defaultPageSize: any;
  defaultSortColumn: string;
  defaultSortType: string;
  heading: boolean;
  height: string;
  httpService: Http;
  pageButtonCount: number;
  pageElementPosition: string;
  pageParam: string;
  pageSizeOptions: any;
  pageSizeElementPosition: string;
  pageSizeParam: string;
  paging: boolean;
  filtering: boolean;
  sortParam: string;
  sorting: boolean;
  url: string;
  width: string;

  static DEFAULT_HEADING_VALUE: boolean = true;
  static DEFAULT_PAGE_BUTTON_COUNT_VALUE: number = 5;
  static DEFAULT_PAGE_ELEMENT_POSITION_VALUE: string = 'left';
  static DEFAULT_PAGE_SIZE_OPTIONS_VALUE: Array<number> = [20, 50, 100];
  static DEFAULT_PAGE_SIZE_ELEMENT_POSITION_VALUE: string = 'right';
  static DEFAULT_PAGE_SIZE_VALUE: number = 20;
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
    if (_.isUndefined(this.heading)) {
      this.heading = GridOptions.DEFAULT_HEADING_VALUE;
    }
    if (_.isUndefined(this.defaultPageSize)) {
      this.defaultPageSize = GridOptions.DEFAULT_PAGE_SIZE_VALUE;
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
  }
}