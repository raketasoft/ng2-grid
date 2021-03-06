import { HttpClient } from '@angular/common/http';
import { Loadable } from './loadable';
import * as _ from 'lodash';
import { StyleCallback } from './style-callback.interface';

/**
 * Grid options class.
 *
 * Defines all configuration options for the Grid component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.1
 */
export class GridOptions extends Loadable {
  static DEFAULT_FILTERING_VALUE = true;
  static DEFAULT_HEADING_VALUE = true;
  static DEFAULT_HEADING_FIXED_VALUE = false;
  static DEFAULT_PAGE_BUTTON_COUNT_VALUE = 5;
  static DEFAULT_PAGE_ELEMENT_POSITION_VALUE = 'left';
  static DEFAULT_PAGE_SIZE_OPTIONS_VALUE: Array<number> = [20, 50, 100];
  static DEFAULT_PAGE_SIZE_ELEMENT_POSITION_VALUE = 'right';
  static DEFAULT_PAGE_SIZE_VALUE = 20;
  static DEFAULT_PAGING_VALUE = true;
  static DEFAULT_PRESERVE_SELECTION_VALUE = false;
  static DEFAULT_REQUIRE_FILTERS = false;
  static DEFAULT_ROW_ALTERNATE_STYLE_VALUE = true;
  static DEFAULT_ROW_HOVER_STYLE_VALUE = true;
  static DEFAULT_ROW_SELECTION_STYLE_VALUE = true;
  static DEFAULT_SELECTION_VALUE = false;
  static DEFAULT_SELECTION_MULTIPLE_VALUE = true;
  static DEFAULT_SORTING_VALUE = true;
  static DEFAULT_WIDTH_VALUE = '100%';
  static DEFAULT_UNIQUE_ID_VALUE = 'id';
  static DEFAULT_STICKY_SCROLL = false;

  protected additionalRequestParams: any;
  protected bodyCssClass: string;
  protected data: Array<any>;
  protected dataItemCallback: DataItemCallback;
  protected defaultFilteringColumn: string;
  protected defaultFilteringColumnValue: string;
  protected defaultPageSize: any;
  protected defaultSortColumn: string;
  protected defaultSortType: string;
  protected heading: boolean;
  protected headingFixed: boolean;
  protected headingCssClass: string;
  protected height: string;
  protected httpService: HttpClient;
  protected pageButtonCount: number;
  protected pageElementPosition: string;
  protected pageParam: string;
  protected pageSizeOptions: any;
  protected pageSizeElementPosition: string;
  protected pageSizeParam: string;
  protected paging: boolean;
  protected preserveSelection: boolean;
  protected requireFilters: boolean;
  protected rowAlternateStyle: boolean;
  protected rowHoverStyle: boolean;
  protected rowSelectionStyle: boolean;
  protected rowStyleCallback: StyleCallback;
  protected filtering: boolean;
  protected selection: boolean;
  protected selectionMultiple: boolean;
  protected sortParam: string;
  protected sorting: boolean;
  protected stickyScroll: boolean;
  protected totalCountHeader: string;
  protected uniqueId: string;
  protected url: string;
  protected width: string;

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(params?: any) {
    super(params);
    if (_.isUndefined(this.filtering)) {
      this.filtering = GridOptions.DEFAULT_FILTERING_VALUE;
    }
    if (_.isUndefined(this.heading)) {
      this.heading = GridOptions.DEFAULT_HEADING_VALUE;
    }
    if (_.isUndefined(this.headingFixed)) {
      this.headingFixed = GridOptions.DEFAULT_HEADING_FIXED_VALUE;
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
    if (_.isUndefined(this.preserveSelection)) {
      this.preserveSelection = GridOptions.DEFAULT_PRESERVE_SELECTION_VALUE;
    }
    if (_.isUndefined(this.requireFilters)) {
      this.requireFilters = GridOptions.DEFAULT_REQUIRE_FILTERS;
    }
    if (_.isUndefined(this.rowAlternateStyle)) {
      this.rowAlternateStyle = GridOptions.DEFAULT_ROW_ALTERNATE_STYLE_VALUE;
    }
    if (_.isUndefined(this.rowHoverStyle)) {
      this.rowHoverStyle = GridOptions.DEFAULT_ROW_HOVER_STYLE_VALUE;
    }
    if (_.isUndefined(this.rowSelectionStyle)) {
      this.rowSelectionStyle = GridOptions.DEFAULT_ROW_SELECTION_STYLE_VALUE;
    }
    if (_.isUndefined(this.selection)) {
      this.selection = GridOptions.DEFAULT_SELECTION_VALUE;
    }
    if (_.isUndefined(this.selectionMultiple)) {
      this.selectionMultiple = GridOptions.DEFAULT_SELECTION_MULTIPLE_VALUE;
    }
    if (_.isUndefined(this.sorting)) {
      this.sorting = GridOptions.DEFAULT_SORTING_VALUE;
    }
    if (_.isUndefined(this.uniqueId)) {
      this.uniqueId = GridOptions.DEFAULT_UNIQUE_ID_VALUE;
    }
    if (_.isUndefined(this.width)) {
      this.width = GridOptions.DEFAULT_WIDTH_VALUE;
    }
    if (_.isUndefined(this.stickyScroll)) {
      this.stickyScroll = GridOptions.DEFAULT_STICKY_SCROLL;
    }
  }

  /**
   * Return specified param.
   *
   * @param {string} param
   * @returns {any}
   */
  get(param: string): any {
    return this[param];
  }
}

export interface DataItemCallback { (row: any): any; }
