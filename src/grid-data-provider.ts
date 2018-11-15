import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Loadable } from './loadable';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/Rx';

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

  private data: Array<any> = [];
  private sortColumn: string;
  private sortType: string = GridDataProvider.SORT_ASC;
  private totalCount: number;

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(private http: HttpClient, params?: any) {
    super(params);
    if (_.isUndefined(this.sourceData)) {
      this.sourceData = [];
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
    if (_.isUndefined(this.requestParams)) {
      this.requestParams = [];
    }
    if (_.isUndefined(this.sortParam)) {
      this.sortParam = GridDataProvider.DEFAULT_SORT_PARAM_VALUE;
    }
    if (_.isUndefined(this.totalCountHeader)) {
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
    if (_.isUndefined(this.sourceUrl)) {
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
    if (_.isUndefined(this.sourceUrl) && !_.isUndefined(this.sourceData)) {
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
   * @returns {Observable<HttpResponse<any>>}
   */
  fetch(): Observable<HttpResponse<any>> {
    let params: HttpParams = this.buildRequestParams();

    return this.http
      .get(this.sourceUrl, {observe: 'response', params: params})
      .map((res: HttpResponse<any>) => {
        this.setTotalCount(Number(res.headers.get(this.totalCountHeader)));
        this.setData(res.body);

        return res;
      }, (err: any) => console.log(err));
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

    if (!_.isUndefined(this.sortColumn)) {
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

      data = _.slice(this.sourceData, start, end);
    } else {
      data = this.sourceData;
    }

    this.data = data;
  }

  /**
   * Sort provided static data.
   */
  protected sort() {
    if (!_.isUndefined(this.sortColumn)) {
      this.sourceData = _.orderBy(this.sourceData, [this.sortColumn], [this.sortType]);
    }
  }
}
