import { Http, Response, URLSearchParams } from '@angular/http';
import { Loadable } from './loadable';
import { GridSort } from './grid-sort';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/Rx';

/**
 * Data provider for grid component.
 * Works with static and remote data.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class GridDataProvider extends Loadable {
  data: Array<any>;
  pageParam: string;
  pageSize: number;
  pageSizeParam: string;
  page: number = 1;
  sortParam: string;
  url: string;

  private _filterData: any[];
  private _filters: Object = new Object();
  private _pageData: Array<any>;
  private _sortColumn: string;
  private _sortType: string = GridSort.TYPE_ASC;
  private _totalCount: number;

  static DEFAULT_PAGE_PARAM_VALUE: string = 'page';
  static DEFAULT_PAGE_SIZE_PARAM_VALUE: string = 'pageSize';
  static DEFAULT_SORT_PARAM_VALUE: string = 'orderBy';

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(private _http: Http, params?: any) {
    super(params);
    if (_.isUndefined(this.data)) {
      this.data = [];
    }
    if (_.isUndefined(this.pageParam)) {
      this.pageParam = GridDataProvider.DEFAULT_PAGE_PARAM_VALUE;
    }
    if (_.isUndefined(this.pageSizeParam)) {
      this.pageSizeParam = GridDataProvider.DEFAULT_PAGE_SIZE_PARAM_VALUE;
    }
    if (_.isUndefined(this.sortParam)) {
      this.sortParam = GridDataProvider.DEFAULT_SORT_PARAM_VALUE;
    }
    this._filterData = this.data;
  }

  /**
   * Return filtered and sorted data for given page.
   * If page is not specified all filtered data would be returned for all pages.
   *
   * @returns {Array<any>}
   */
  getData(): Array<any> {
    if (_.isUndefined(this.url)) {
      this._filter();
      this._sort();
      this._slice();
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
    if (_.isUndefined(this.url)) {
      this._totalCount = this._filterData.length;
    }

    return this._totalCount;
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
   * Fetch data from remote service for current page.
   *
   * @param {number} page
   * @returns {Observable<Response>}
   */
  fetch(): Observable<Response> {
    let params:URLSearchParams = new URLSearchParams();

    params.set(this.pageParam, this.page.toString());

    if (!_.isUndefined(this.pageSize)) {
      params.set(this.pageSizeParam, this.pageSize.toString());
    }

    if (!_.isUndefined(this._sortColumn)) {
      let sortByValue: string = (this._sortType == GridSort.TYPE_ASC ? '' : '-')
        + this._sortColumn;
      params.set(this.sortParam, sortByValue);
    }

    for (let key in this._filters) {
      params.set(key, this._filters[key]);
    }

    let response:Observable<Response> = this._http
        .get(this.url, {search: params})
        .share();

    response
      .subscribe(
        (res: Response) => {
          this._totalCount = Number(res.headers.get('X-Pagination-Total-Count'));
          this._pageData = res.json();
        },
        (err: any) => console.log(err)
      );

    return response;
  }

  /**
   * Slice filtered static data to specific page.
   * If pageSize is not specified all filtered data would be returned.
   */
  private _slice() {
    var data = [];
    if (!_.isUndefined(this.pageSize)) {
      let start: number = (this.page - 1) * this.pageSize
      let end: number = start + this.pageSize;

      data = _.slice(this._filterData, start, end);
    } else {
      data = this._filterData;
    }

    this._pageData = data;
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


