import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isUndefined, slice, orderBy, get } from 'lodash';

import { Loadable } from './loadable';

/**
 * Data provider class for Grid component.
 *
 * Works with static and remote data.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.1
 */
export class GridDataProvider extends Loadable {
  static DEFAULT_PAGE_PARAM_VALUE = 'page';
  static DEFAULT_PAGE_SIZE_PARAM_VALUE = 'pageSize';
  static DEFAULT_PAGE_SIZE_VALUE = 20;
  static DEFAULT_SORT_PARAM_VALUE = 'orderBy';
  static DEFAULT_TOTAL_COUNT_HEADER_VALUE = 'X-Pagination-Total-Count';
  static SORT_ASC = 'asc';
  static SORT_DESC = 'desc';

  pageParam: string;
  pageSizeParam: string;
  pageSize: number;
  pageIndex = 1;
  requestParams: Array<any>;
  sortParam: string;
  sourceData: Array<any>;
  sourceUrl: string;
  totalCountHeader: string;
  pageByPageLoading: boolean;

  private data: Array<any> = [];
  private sortColumn: string;
  private sortType: any = GridDataProvider.SORT_ASC;
  private caseInsensitiveSort: boolean;
  private totalCount: number;

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(private http: HttpClient, params?: any) {
    super(params);
    if (isUndefined(this.sourceData)) {
      this.sourceData = [];
    }
    if (isUndefined(this.pageParam)) {
      this.pageParam = GridDataProvider.DEFAULT_PAGE_PARAM_VALUE;
    }
    if (isUndefined(this.pageSizeParam)) {
      this.pageSizeParam = GridDataProvider.DEFAULT_PAGE_SIZE_PARAM_VALUE;
    }
    if (isUndefined(this.pageSize)) {
      this.pageSize = GridDataProvider.DEFAULT_PAGE_SIZE_VALUE;
    }
    if (isUndefined(this.requestParams)) {
      this.requestParams = [];
    }
    if (isUndefined(this.sortParam)) {
      this.sortParam = GridDataProvider.DEFAULT_SORT_PARAM_VALUE;
    }
    if (isUndefined(this.totalCountHeader)) {
      this.totalCountHeader = GridDataProvider.DEFAULT_TOTAL_COUNT_HEADER_VALUE;
    }
  }

  /**
   * Return sorted data for given page.
   * If page is not specified all data would be returned.
   *
   * @returns {Array<any>}
   */
  getData(): Array<any> {
    if (!this.isDataSetAsync()) {
      this.sort();
      this.slice();
    }

    return this.data;
  }

  /**
   * Set data for current page.
   *
   * @param {Array<any>} data
   */
  setData(data: Array<any>) {
    this.data = data;
  }

  /**
   * Return number of results displayed on current page.
   *
   * @returns {number}
   */
  getCount(): number {
    return this.data.length;
  }

  /**
   * Return total number of results for all pages.
   *
   * @returns {number}
   */
  getTotalCount(): number {
    if (!this.isDataSetAsync() && !isUndefined(this.sourceData)) {
      this.totalCount = this.sourceData.length;
    }

    return this.totalCount;
  }

  /**
   * Set number of total resutls for all pages.
   *
   * @param {number} totalCount
   */
  setTotalCount(totalCount: number) {
    this.totalCount = totalCount;
  }

  /**
   * Set a sort column and sort type for the data provider.
   *
   * @param {string} sortColumn Name of grid column to be used for sorting
   * @param {string} sortType Optional, values are 'asc' or 'desc'
   * @param {boolean} caseInsensitiveSort
   */
  setSort(sortColumn: string, sortType?: string, caseInsensitiveSort?: boolean) {
    if (!isUndefined(sortType)) {
      this.sortType = sortType;
    }
    this.sortColumn = sortColumn;
    this.caseInsensitiveSort = caseInsensitiveSort;
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
   * @returns {Observable<HttpResponse<any>>}
   */
  fetch(): Observable<HttpResponse<any>> {
    let params: HttpParams = this.buildRequestParams();

    return this.http
      .get(this.sourceUrl, {observe: 'response', params: params})
      .pipe(
        map((res: HttpResponse<any>) => {
          this.setTotalCount(Number(res.headers.get(this.totalCountHeader)));
          this.setData(res.body);

          return res;
        }, (err: any) => console.log(err)));
  }

  /**
   * Build request params.
   *
   * @returns {HttpParams}
   */
  protected buildRequestParams(): HttpParams {
    let params: HttpParams = new HttpParams();

    params = params.append(this.pageParam, this.pageIndex.toString());

    if (!_.isUndefined(this.pageSize)) {
      params = params.append(this.pageSizeParam, this.pageSize.toString());
    }

    if (!isUndefined(this.sortColumn)) {
      let sortByValue: string = (this.sortType === GridDataProvider.SORT_ASC ? '' : '-')
        + this.sortColumn;
      params = params.append(this.sortParam, sortByValue);
    }

    for (let key in this.requestParams) {
      if (this.requestParams.hasOwnProperty(key)) {
        params = params.append(key, this.requestParams[key]);
      }
    }

    return params;
  }

  /**
   * Slice data to specific page.
   * If pageSize is not specified all data would be returned.
   */
  protected slice() {
    let data: Array<any> = [];

    if (!_.isUndefined(this.pageSize)) {
      let start: number = (this.pageIndex - 1) * this.pageSize;
      let end: number = start + Number(this.pageSize);

      data = slice(this.sourceData, start, end);
    } else {
      data = this.sourceData;
    }

    this.data = data;
  }

  /**
   * Sort provided static data.
   */
  protected sort() {
    if (!isUndefined(this.sortColumn)) {
      let iteratees: Array<any> = [];

      if (this.caseInsensitiveSort) {
        iteratees = [(item: any) => this.getValueString(item, this.sortColumn).toLowerCase()];
      } else {
        iteratees = [(item: any) => this.getValueString(item, this.sortColumn)];
      }

      this.sourceData = orderBy(this.sourceData, iteratees, [this.sortType]);
    }
  }

  /**
   * @param item
   * @param {string} key
   *
   * @returns {string}
   */
  private getValueString(item: any, key: string): string {
      const currentItem = get(item, this.sortColumn, null);

      return currentItem === null ? '' : currentItem;
  }

  /**
   * Checks is data loaded asynchronously
   *
   * @returns {boolean}
   */
  private isDataSetAsync(): boolean {
    return !isUndefined(this.sourceUrl) || this.pageByPageLoading;
  }
}
