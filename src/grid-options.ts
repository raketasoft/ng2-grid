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
  static DEFAULT_HEADING_VALUE: boolean = true;
  static DEFAULT_PAGE_BUTTON_COUNT_VALUE: number = 5;
  static DEFAULT_PAGE_ELEMENT_POSITION_VALUE: string = 'left';
  static DEFAULT_PAGE_SIZE_OPTIONS_VALUE: Array<number> = [20, 50, 100];
  static DEFAULT_PAGE_SIZE_ELEMENT_POSITION_VALUE: string = 'right';
  static DEFAULT_PAGE_SIZE_VALUE: number = 20;
  static DEFAULT_PAGING_VALUE: boolean = true;
  static DEFAULT_FILTERING_VALUE: boolean = true;
  static DEFAULT_SELECTION_VALUE: boolean = false;
  static DEFAULT_SORTING_VALUE: boolean = true;
  static DEFAULT_WIDTH_VALUE: string = '100%';

  private additionalRequestParams: any;
  private columns: Array<any>;
  private data: Array<any>;
  private defaultPageSize: any;
  private defaultSortColumn: string;
  private defaultSortType: string;
  private heading: boolean;
  private height: string;
  private httpService: Http;
  private pageButtonCount: number;
  private pageElementPosition: string;
  private pageParam: string;
  private pageSizeOptions: any;
  private pageSizeElementPosition: string;
  private pageSizeParam: string;
  private paging: boolean;
  private filtering: boolean;
  private selection: boolean;
  private sortParam: string;
  private sorting: boolean;
  private url: string;
  private width: string;

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
    if (_.isUndefined(this.selection)) {
      this.selection = GridOptions.DEFAULT_SELECTION_VALUE;
    }
    if (_.isUndefined(this.sorting)) {
      this.sorting = GridOptions.DEFAULT_SORTING_VALUE;
    }
    if (_.isUndefined(this.width)) {
      this.width = GridOptions.DEFAULT_WIDTH_VALUE;
    }
  }
}
