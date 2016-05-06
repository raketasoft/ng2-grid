import {Component, Input} from 'angular2/core';
import {GridColumn} from './grid-column';
import {GridOptions} from './grid-options';
import * as _ from 'lodash';

/**
 * Data grid component class.
 * Should be used as directive. Component configuration is done through the
 * options property.
 * Supports sorting, filtering and paging.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
@Component({
  selector: 'ng-grid',
  template: `
    <div class="ng-grid">
      <div class="ng-grid-header" [style.width]="options.width"
          [class.scroll]="options.height">
        <table [style.width]="options.width">
          <thead *ngIf="options.heading">
            <tr>
              <th *ngFor="let column of options.columns" class="ng-grid-heading"
                  [style.width]="column.width" [attr.data-id]="column.name"
                  [class.sort]="_isSortedBy(column)"
                  [class.sort-asc]="_isSortedBy(column, 'asc')"
                  [class.sort-desc]="_isSortedBy(column, 'desc')"
                  [class.sort-disable]="!_isSortingAllowed(column)"
                  (click)="_onHeadingClick($event)">
                {{column.renderHeading()}}
              </th>
            </tr>
          </thead>
          <tbody *ngIf="options.filtering">
            <tr>
              <td *ngFor="let column of options.columns">
                <input type="text" *ngIf="column.filtering"
                  [attr.name]="column.name"
                  (keyup.enter)="_onFilterInputEnter($event)"
                  (blur)="_onFilterInputBlur($event)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ng-grid-body" [style.width]="options.width"
          [class.scroll]="options.height" [style.max-height]="options.height">
        <table class="table" [style.width]="options.width">
          <tbody>
            <tr *ngFor="let row of _pageData">
              <td *ngFor="let column of options.columns" [style.width]="column.width">
                {{column.renderCell(row)}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ng-grid-footer clearfix">
        <div class="ng-grid-pager" *ngIf="options.paging">
          <span>Pages:</span>
          <a href="#" *ngIf="_pageIndex > 1" (click)="toPage(1)">First</a>
          <a href="#" *ngIf="_pageIndex > 1"
            (click)="toPage(_pageIndex - 1)">Prev</a>
          <template ngFor let-page [ngForOf]="_pages">
            <a href="#" *ngIf="page != _pageIndex"
              (click)="toPage(page)">{{page}}</a>
            <span *ngIf="page == _pageIndex">{{page}}</span>
          </template>
          <a href="#" *ngIf="_pageIndex < getTotalPages()"
            (click)="toPage(_pageIndex + 1)">Next</a>
          <a href="#" *ngIf="_pageIndex < getTotalPages()"
            (click)="toPage(getTotalPages())">Last</a>
          <span>{{_pageIndex}} of {{getTotalPages()}}</span>
        </div>
        <div class="ng-grid-pager-size" *ngIf="options.paging">
          Results per page:
          <select (change)="_onPageSizeChange($event)">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>`
})
export class Grid {
  @Input() options: GridOptions;

  data: Array<any> = [];

  private _filters: Object = new Object();
  private _pages: Array<number> = [];
  private _pageData: Array<any> = [];
  private _pageIndex: number = 1;
  private _pageSize: number;
  private _sortColumn: string;
  private _sortType: string = Grid.SORT_TYPE_ASC;

  static SORT_TYPE_ASC: string = 'asc';
  static SORT_TYPE_DESC: string = 'desc';

  ngOnInit() {
    if (_.isEmpty(this.options.columns) && !_.isEmpty(this.options.data)) {
      this._setDefaultColumnOptions();
    }
    this.data = this.options.data;

    if (this.options.paging) {
      this._pageSize = this.options.pageSize;
      this.renderPage();
    }
  }

  getPageIndex() {
    return this._pageIndex;
  }

  getTotalPages(): number {
    return Math.round(this.getTotalResults() / this._pageSize);
  }

  getTotalResults(): number {
    return this.data.length;
  }

  getPageSize(): number {
    return this._pageSize;
  }

  render() {
    this.filter();
    this.sort();

    if (this.options.paging) {
      this.renderPage();
    }
  }

  renderPage() {
    this._slice();
    this._paginate();
  }

  toPage(page: number) {
    if (this.options.paging) {
      this._pageIndex = page;
      this.renderPage();
    }
  }

  changePageSize(pageSize: number) {
    this._pageIndex = 1;
    this._pageSize = pageSize;
    this.renderPage();
  }

  private _onPageSizeChange(event: MouseEvent) {
    let element: HTMLSelectElement = <HTMLSelectElement>event.target;
    let pageSize: number = Number(element.options.item(element.selectedIndex).innerHTML);

    this.changePageSize(pageSize);
  }

  private _slice() {
    let start: number = (this._pageIndex-1) * this._pageSize
    let end: number = start + this._pageSize;

    this._pageData = _.slice(this.data, start, end);
  }

  private _paginate() {
    let pageButtonCount: number = Math.min(this.options.pageButtonCount, this.getTotalPages());
    let offsetLeft: number = Math.floor(pageButtonCount / 2);
    let offsetRight: number = Math.ceil(pageButtonCount / 2) - 1;
    let startIndex: number = this._pageIndex - offsetLeft;
    let endIndex: number = this._pageIndex + offsetRight;

    if (startIndex < 1) {
      startIndex = 1;
      endIndex = pageButtonCount;
    } else if (endIndex > this.getTotalPages()) {
      endIndex = this.getTotalPages();
      startIndex = endIndex - pageButtonCount + 1;
    }

    this._pages = [];
    for (let i = startIndex; i <= endIndex; i++) {
      this._pages.push(i);
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
   * Callling this method would filter the grid data based on all filter values
   * that have been added previously using {{setFilter}} method.
   */
  filter() {
    var self = this;

    this.data = _.filter(this.options.data, function(item) {
      var match: boolean = true;
      for (let filter in self._filters) {
        let value: string = _.get(item, filter).toString();

        match = match &&
          (value.match(new RegExp(self._filters[filter], 'i')) !== null);
      }

      return match;
    });

    // reset to first page when data is filtered
    if (this.options.paging) {
      this._pageIndex = 1;
    }
  }

  /**
   * Filter input blur handler.
   * When invoked a filter would be set with the input value.
   *
   * @param {MouseEvent} event
   */
  private _onFilterInputBlur(event) {
    let element: HTMLInputElement = <HTMLInputElement>event.target;
    let columnName: string = element.getAttribute('name');
    let keyword: string = element.value.trim();

    this.setFilter(columnName, keyword);
  }

  /**
   * Filter input enter key hanlder.
   * When invoked a filter would be set with the input value and the grid
   * filter would be triggered.
   *
   * @param {MouseEvent} event
   */
  private _onFilterInputEnter(event: MouseEvent) {
    this._onFilterInputBlur(event);

    this.render();
  }

  /**
   * Set a sort column and sort type for the grid.
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
   * Calling this method would sort the grid data by the already set
   * sort column and sort type.
   * Use {{setSort}} method to set sort column and type.
   */
  sort() {
    if (!_.isUndefined(this._sortColumn)) {
      this.data = _.orderBy(this.data, [this._sortColumn], [this._sortType]);
    }
  }

  /**
   * Grid heading click handler.
   * When invoked the grid would be sorted by the clicked column.
   *
   * @param {MouseEvent} event
   */
  private _onHeadingClick(event: MouseEvent) {
    let element: HTMLElement = <HTMLElement>event.target;
    let columnName: string = element.getAttribute('data-id');
    let column: GridColumn = _.find(this.options.columns, function(item) {
      return item.name == columnName;
    });

    if (this._isSortingAllowed(column)) {
      this.setSort(columnName, this._getSortType(column));
      this.sort();

      if (this.options.paging) {
        this._slice();
      }
    } else {
      console.log('Sorting by "' + column.name + '" is not allowed.');
    }
  }

  /**
   * Check if data is sorted by specific column and type.
   *
   * @param {GridColumn} column
   * @param {string} sortType Optional, if given method would also check
   * current sort type value
   * @returns boolean
   */
  private _isSortedBy(column: GridColumn, sortType?: string): boolean {
    let isOrderedByField = column.name == this._sortColumn;
    if (_.isUndefined(sortType)) {
      return isOrderedByField;
    }

    return isOrderedByField && this._sortType == sortType;
  }

  /**
   * Determine sort type by column name.
   * If column name is different from current sort column the order type would
   * be preserved, otherwise the sort type would be changed to the opposite.
   *
   * @param {GridColumn} column
   * @returns {string}
   */
  private _getSortType(column: GridColumn): string {
    return column.name != this._sortColumn ? this._sortType :
      (this._sortType == Grid.SORT_TYPE_ASC ?
        Grid.SORT_TYPE_DESC : Grid.SORT_TYPE_ASC);
  }

  /**
   * Check if sorting is allowed for specific grid column.
   *
   * @param {GridColumn} column
   * @returns boolean
   */
  private _isSortingAllowed(column: GridColumn): boolean {
    return this.options.sorting && column.sorting;
  }

  /**
   * Set default column options from provided data.
   * Data keys are used as headings and values are pulled from nested objects.
   */
  private _setDefaultColumnOptions() {
    let row: any = this.options.data[0];
    for (let key in row) {
      this.options.columns.push(new GridColumn({
        name: this._getColumnName(key, row),
        heading: key
      }));
    }
  }

  /**
   * Determine the column name used in column options.
   *
   * @param {string} key Data item key
   * @param {any} row Data item, could be primitive data type or an object
   * @returns {string}
   */
  private _getColumnName(key: string, row: any): string {
    if (_.isObject(row[key])) {
      return key.concat('.', this._getNestedKey(row[key]))
    }

    return key;
  }

  /**
   * Get full key name from nested object.
   *
   * @param {any} object Nested object to be iterated
   * @returns {string}
   * @example
   * var object: any = {country: { name: { officialName: "People's Republic of China", name: "China" }, id: 6 }}
   * var nestedKey: string = this._getNestedKey(object);
   * console.log(nestedKey); // will output 'country.name.officialName'
   */
  private _getNestedKey(object: any): string {
    let firstKey: string = _.keys(object)[0];
    let firstKeyValue: any = object[firstKey];

    if (_.isObject(firstKeyValue)) {
      firstKey.concat('.', this._getNestedKey(firstKeyValue));
    }

    return firstKey;
  }
}