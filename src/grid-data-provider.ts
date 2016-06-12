import { Http, Response, URLSearchParams } from '@angular/http';
import { Loadable } from './loadable';
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
  static DEFAULT_TOTAL_COUNT_HEADER_VALUE: string = 'X-Pagination-Total-Count';
  static SORT_ASC: string = 'asc';
  static SORT_DESC: string = 'desc';

  allData: Array<any>;
  requestParams: Array<any>;
  pageParam: string;
  pageSizeParam: string;
  pageSize: any;
  pageIndex: number = 1;
  sortParam: string;
  totalCountHeader: string;
  url: string;

  private data: Array<any>;
  private sortColumn: string;
  private sortType: string = GridDataProvider.SORT_ASC;
  private totalCount: number;

  /**
   * Class constructor.
   * Set default values for properties if not specified in params.
   */
  constructor(private http: Http, params?: any) {
    super(params);
    if (_.isUndefined(this.allData)) {
      this.allData = [];
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
    if (_.isUndefined(this.url)) {
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
    if (_.isUndefined(this.url)) {
      this.totalCount = this.allData.length;
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
   * @param {number} page
   * @returns {Observable<Response>}
   */
  fetch(): Observable<Response> {
    var params: URLSearchParams = this.buildRequestParams();

    var response: Observable<Response> = this.http
        .get(this.url, {search: params})
        .share();

    response
      .subscribe(
        (res: Response) => {
          this.setTotalCount(Number(res.headers.get(this.totalCountHeader)));
          this.setData(res.json());
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

    params.set(this.pageParam, this.pageIndex.toString());

    if (this.pageSize !== false) {
      params.set(this.pageSizeParam, this.pageSize as string);
    }

    if (!_.isUndefined(this.sortColumn)) {
      let sortByValue: string = (this.sortType === GridDataProvider.SORT_ASC ? '' : '-')
        + this.sortColumn;
      params.set(this.sortParam, sortByValue);
    }

    for (let key in this.requestParams) {
      params.set(key, this.requestParams[key]);
    }

    return params;
  }

  /**
   * Slice data to specific page.
   * If pageSize is not specified all data would be returned.
   */
  protected slice() {
    var data: Array<any> = [];
    if (this.pageSize !== false) {
      let start: number = (this.pageIndex - 1) * this.pageSize;
      let end: number = start + this.pageSize;

      data = _.slice(this.allData, start, end);
    } else {
      data = this.allData;
    }

    this.data = data;
  }

  /**
   * Sort provided static data.
   */
  protected sort() {
    if (!_.isUndefined(this.sortColumn)) {
      this.allData = _.orderBy(this.allData, [this.sortColumn], [this.sortType]);
    }
  }
}
