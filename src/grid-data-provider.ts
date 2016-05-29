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
  static DEFAULT_PAGE_PARAM_VALUE: string = 'page';
  static DEFAULT_PAGE_SIZE_PARAM_VALUE: string = 'pageSize';
  static DEFAULT_PAGE_SIZE_VALUE: number = 20;
  static DEFAULT_SORT_PARAM_VALUE: string = 'orderBy';

  additionalRequestParams: any;
  data: Array<any>;
  pageParam: string;
  pageSizeParam: string;
  pageSize: any;
  page: number = 1;
  sortParam: string;
  url: string;

  private filterData: any[];
  private filters: Object = new Object();
  private pageData: Array<any>;
  private sortColumn: string;
  private sortType: string = GridSort.TYPE_ASC;
  private totalCount: number;

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
    if (_.isUndefined(this.pageSize)) {
      this.pageSize = GridDataProvider.DEFAULT_PAGE_SIZE_VALUE;
    }
    if (_.isUndefined(this.sortParam)) {
      this.sortParam = GridDataProvider.DEFAULT_SORT_PARAM_VALUE;
    }
    this.filterData = this.data;
  }

  /**
   * Return filtered and sorted data for given page.
   * If page is not specified all filtered data would be returned for all pages.
   *
   * @returns {Array<any>}
   */
  getData(): Array<any> {
    if (_.isUndefined(this.url)) {
      this.filter();
      this.sort();
      this.slice();
    }

    return this.pageData;
  }

  /**
   * Return number of results displayed on current page.
   *
   * @returns {number}
   */
  getCount(): number {
    return this.pageData.length;
  }

  /**
   * Return total number of results found after filters are applied for all pages.
   *
   * @returns {number}
   */
  getTotalCount(): number {
    if (_.isUndefined(this.url)) {
      this.totalCount = this.filterData.length;
    }

    return this.totalCount;
  }

  /**
   * Set a filter value for specific column.
   *
   * @param {string} columnName
   * @param {string} value Keyword to be used as filter for the column
   */
  setFilter(columnName: string, value: string) {
    if (!_.isEmpty(value)) {
      this.filters[columnName] = value;
    } else if (!_.isEmpty(this.filters[columnName])) {
      delete this.filters[columnName];
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
      this.sortType = sortType;
    }
    this.sortColumn = sortColumn;
  }

  /**
   * Getter for {{sortColumn}} property.
   */
  getSortColumn(): string {
    return this.sortColumn;
  }

  /**
   * Getter for {{sortType}} property.
   */
  getSortType(): string {
    return this.sortType;
  }

  /**
   * Fetch data from remote service for current page.
   *
   * @param {number} page
   * @returns {Observable<Response>}
   */
  fetch(): Observable<Response> {
    var params: URLSearchParams = this.buildRequestParams();

    var response: Observable<Response> = this._http
        .get(this.url, {search: params})
        .share();

    response
      .subscribe(
        (res: Response) => {
          this.totalCount = Number(res.headers.get('X-Pagination-Total-Count'));
          this.pageData = res.json();
        },
        (err: any) => console.log(err)
      );

    return response;
  }

  /**
   * Build request params.
   *
   * @returns {URLSearchParams}
   */
  protected buildRequestParams(): URLSearchParams {
    var params: URLSearchParams = new URLSearchParams();

    params.set(this.pageParam, this.page.toString());

    if (this.pageSize !== false) {
      params.set(this.pageSizeParam, this.pageSize.toString());
    }

    if (!_.isUndefined(this.sortColumn)) {
      let sortByValue: string = (this.sortType === GridSort.TYPE_ASC ? '' : '-')
        + this.sortColumn;
      params.set(this.sortParam, sortByValue);
    }

    for (let key in this.filters) {
      params.set(key, this.filters[key]);
    }

    for (let key in this.additionalRequestParams) {
      params.set(key, this.additionalRequestParams[key]);
    }

    return params;
  }

  /**
   * Slice filtered static data to specific page.
   * If pageSize is not specified all filtered data would be returned.
   */
  protected slice() {
    var data: Array<any> = [];
    if (this.pageSize !== false) {
      let start: number = (this.page - 1) * this.pageSize;
      let end: number = start + this.pageSize;

      data = _.slice(this.filterData, start, end);
    } else {
      data = this.filterData;
    }

    this.pageData = data;
  }

  /**
   * Filter provided static data.
   */
  protected filter() {
    var self: GridDataProvider = this;

    this.filterData = _.filter(this.data, function(item: any) {
      var match: boolean = true;
      for (let filter in self.filters) {
        let value: string = _.get(item, filter).toString();

        match = match &&
          !_.isEmpty(value.match(new RegExp(self.filters[filter], 'i')));
      }

      return match;
    });
  }

  /**
   * Sort provided static data.
   */
  protected sort() {
    if (!_.isUndefined(this.sortColumn)) {
      this.filterData = _.orderBy(this.filterData, [this.sortColumn], [this.sortType]);
    }
  }
}
