import {Loadable} from './loadable';
import {GridSort} from './grid-sort';
import * as _ from 'lodash';

/**
 * Data provider for grid component.
 * Works with static and remote data.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridDataProvider extends Loadable {
  data: Array<any>;
  pageSize: number;
  useRemoteData: boolean;

  private _filterData: Array<any>;
  private _filters: Object = new Object();
  private _pageData: Array<any>;
  private _sortColumn: string;
  private _sortType: string = GridSort.TYPE_ASC;

  static DEFAULT_PAGE_SIZE_VALUE: number = 20;
  static DEFAULT_USE_REMOTE_DATA_VALUE: boolean = false;

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(params?: any) {
    super(params);
    if (_.isUndefined(this.data)) {
      this.data = [];
    }
    if (_.isUndefined(this.pageSize)) {
      this.pageSize = GridDataProvider.DEFAULT_PAGE_SIZE_VALUE;
    }
    if (_.isUndefined(this.useRemoteData)) {
      this.useRemoteData = GridDataProvider.DEFAULT_USE_REMOTE_DATA_VALUE;
    }
    this._filterData = this.data;
  }

  /**
   * Return filtered and sorted data for given page.
   * If page is not specified all filtered data would be returned for all pages.
   *
   * @returns {Array<any>}
   */
  getData(page?: number): Array<any> {
    if (!this.useRemoteData) {
      this._filter();
      this._sort();
      this._slice(page);
    } else {
      this._fetch(page);
    }

    return this._pageData;
  }

  /**
   * Return number of results displayed on current page.
   *
   * @returns {number}
   */
  getCount(): number {
    return this._pageData.length;
  }

  /**
   * Return total number of results found after filters are applied for all pages.
   *
   * @returns {number}
   */
  getTotalCount(): number {
    if (!this.useRemoteData) {
      return this._filterData.length;
    }
  }

  /**
   * Set a filter value for specific column.
   *
   * @param {string} columnName
   * @param {string} value Keyword to be used as filter for the column
   */
  setFilter(columnName: string, value: string) {
    if (!_.isEmpty(value)) {
      this._filters[columnName] = value;
    } else if (!_.isEmpty(this._filters[columnName])) {
      delete this._filters[columnName];
    }
  }

  /**
   * Set a sort column and sort type for the data provider.
   *
   * @param {string} sortColumn Name of grid column to be used for sorting
   * @param {string} sortType Optional, values are 'asc' or 'desc'
   */
  setSort(sortColumn: string, sortType?: string) {
    if (!_.isUndefined(sortType)) {
      this._sortType = sortType;
    }
    this._sortColumn = sortColumn;
  }

  /**
   * Getter for {{_sortColumn}} property.
   */
  getSortColumn(): string {
    return this._sortColumn;
  }

  /**
   * Getter for {{_sortType}} property.
   */
  getSortType(): string {
    return this._sortType;
  }

  /**
   * Fetch data from remote service for given page.
   * If page is not specified all data would be returned.
   *
   * @param {number} page
   */
  private _fetch(page?: number) {
  }

  /**
   * Slice filtered static data to specific page.
   * If page is not specified all filtered data would be returned.
   *
   * @param {number} page
   */
  private _slice(page?: number) {
    if (!_.isUndefined(page)) {
      let start: number = (page - 1) * this.pageSize
      let end: number = start + this.pageSize;

      this._pageData = _.slice(this._filterData, start, end);
    } else {
      this._pageData = this._filterData;
    }
  }

  /**
   * Filter provided static data.
   */
  private _filter() {
    var self = this;

    this._filterData = _.filter(this.data, function(item) {
      var match: boolean = true;
      for (let filter in self._filters) {
        let value: string = _.get(item, filter).toString();

        match = match &&
          (value.match(new RegExp(self._filters[filter], 'i')) !== null);
      }

      return match;
    });
  }

  /**
   * Sort provided static data.
   */
  private _sort() {
    if (!_.isUndefined(this._sortColumn)) {
      this._filterData = _.orderBy(this._filterData, [this._sortColumn], [this._sortType]);
    }
  }
}


