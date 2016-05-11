import {Component, Input} from '@angular/core';
import {GridColumn} from './grid-column';
import {GridOptions} from './grid-options';
import {GridDataProvider} from './grid-data-provider';
import {GridSort} from './grid-sort';
import * as _ from 'lodash';

/**
 * Data grid component class.
 * Use as directive. Component configuration is done through the options property.
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
            <tr *ngFor="let row of _data">
              <td *ngFor="let column of options.columns" [style.width]="column.width">
                {{column.renderCell(row)}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ng-grid-footer clearfix">
        <div class="ng-grid-pager {{options.pageElementPosition}}" *ngIf="options.paging">
          <span>Pages:</span>
          <a href="#" *ngIf="_pageIndex > 1" [attr.data-page]="1"
            (click)="_onPageButtonClick($event)">First</a>
          <a href="#" *ngIf="_pageIndex > 1" [attr.data-page]="getPageIndex() - 1"
            (click)="_onPageButtonClick($event)">Prev</a>
          <template ngFor let-page [ngForOf]="_pages">
            <a href="#" *ngIf="page != _pageIndex" [attr.data-page]="page"
              (click)="_onPageButtonClick($event)">{{page}}</a>
            <span *ngIf="page == _pageIndex">{{page}}</span>
          </template>
          <a href="#" *ngIf="_pageIndex < getTotalPages()"
            [attr.data-page]="getPageIndex() + 1"
            (click)="_onPageButtonClick($event)">Next</a>
          <a href="#" *ngIf="_pageIndex < getTotalPages()"
            [attr.data-page]="getTotalPages()"
            (click)="_onPageButtonClick($event)">Last</a>
          <span>{{_pageIndex}} of {{getTotalPages()}}</span>
        </div>
        <div class="ng-grid-pager-size {{options.pageSizeElementPosition}}"
          *ngIf="_pageSizeOptionsEnabled()">
          <span>Page size:</span>
          <select [(ngModel)]="_dataProvider.pageSize"
            (change)="_onPageSizeDropDownChange($event)">
            <option *ngFor="let value of options.pageSizeOptions" [ngValue]="value">
              {{value}}
            </option>
          </select>
        </div>
      </div>
    </div>`
})
export class Grid {
  @Input() options: GridOptions;

  private _dataProvider: GridDataProvider;
  private _data: Array<any>;
  private _pageIndex: number = 1;
  private _pages: Array<number>;

  /**
   * Init properties and render data after component initialization.
   */
  ngOnInit() {
    this._dataProvider = this.options.dataProvider;
    if (_.isEmpty(this.options.columns) && !_.isEmpty(this._dataProvider.data)) {
      this._setDefaultColumnOptions();
    }
    this._render();
  }

  /**
   * Return current page index.
   *
   * @returns {number}
   */
  getPageIndex(): number {
    return this._pageIndex;
  }

  /**
   * Return total number of grid pages.
   *
   * @returns {number}
   */
  getTotalPages(): number {
    return Math.ceil(this._dataProvider.getTotalCount() / this._dataProvider.pageSize);
  }

  /**
   * Render data for given page.
   *
   * @param {number} page
   */
  toPage(page: number) {
    this._pageIndex = page;
    this._render();
  }

  /**
   * Change page size to given value and render data.
   *
   * @param {number} pageSize
   */
  changePageSize(pageSize: number) {
    this._dataProvider.pageSize = pageSize;
    this._pageIndex = 1;
    this._render();
  }

  /**
   * Add a filter value for specific column.
   *
   * @param {string} columnName
   * @param {string} value Keyword to be used as filter for the column
   */
  addFilter(columnName: string, value: string) {
    this._dataProvider.setFilter(columnName, value);
  }

  /**
   * Callling this method would filter the grid data based on all filter values
   * that have been added previously using {{addFilter}} method.
   */
  filter() {
    this._pageIndex = 1;
    this._render();
  }

  /**
   * Calling this method would sort the grid data by the given sort column and
   * sort type.
   *
   * @param {string} sortColumn Name of grid column to be used for sorting
   * @param {string} sortType Optional, values are 'asc' or 'desc'
   */
  sort(sortColumn: string, sortType?: string) {
    this._dataProvider.setSort(sortColumn, sortType);
    this._render();
  }

  /**
   * Render grid data.
   */
  _render() {
    if (this.options.paging) {
      this._data = this._dataProvider.getData(this._pageIndex);
      this._paginate();
    } else {
      this._data = this._dataProvider.getData();
    }
  }

  /**
   * Build a list of the pages that should be display in the grid, based on
   * current page index and max button count.
   */
  private _paginate() {
    let pageButtonCount: number = Math.min(this.options.pageButtonCount,
      this.getTotalPages());
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
   * Page button click handler.
   * When invoked grid data for specific page would be rendered.
   *
   * @param {MouseEvent} event
   */
  private _onPageButtonClick(event: MouseEvent) {
    event.preventDefault();

    let element: HTMLSelectElement = <HTMLSelectElement>event.target;
    let page: number = Number(element.getAttribute('data-page'));

    this.toPage(page);
  }

  /**
   * Check if page size options are enabled.
   *
   * @returns {boolean}
   */
  private _pageSizeOptionsEnabled(): boolean {
    return this.options.paging && !_.isEmpty(this.options.pageSizeOptions);
  }

  /**
   * Page size drop-down change handler.
   * When invoked the page size of the grid would be changed and data would be
   * re-rendered.
   *
   * @param {MouseEvent} event
   */
  private _onPageSizeDropDownChange(event: MouseEvent) {
    let element: HTMLSelectElement = <HTMLSelectElement>event.target;
    let pageSize: number = Number(element.options.item(element.selectedIndex).innerHTML);

    this.changePageSize(pageSize);
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

    this.addFilter(columnName, keyword);
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

    this.filter();
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
      this.sort(columnName, this._getSortType(column));
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
   * @returns {boolean}
   */
  private _isSortedBy(column: GridColumn, sortType?: string): boolean {
    let isOrderedByField = column.name == this._dataProvider.getSortColumn();
    if (_.isUndefined(sortType)) {
      return isOrderedByField;
    }

    return isOrderedByField && this._dataProvider.getSortType() == sortType;
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
    return column.name != this._dataProvider.getSortColumn() ?
      this._dataProvider.getSortType() :
        (this._dataProvider.getSortType() == GridSort.TYPE_ASC ?
          GridSort.TYPE_DESC : GridSort.TYPE_ASC);
  }

  /**
   * Check if sorting is allowed for specific grid column.
   *
   * @param {GridColumn} column
   * @returns {boolean}
   */
  private _isSortingAllowed(column: GridColumn): boolean {
    return this.options.sorting && column.sorting;
  }

  /**
   * Set default column options from provided data.
   * Data keys are used as headings and values are pulled from nested objects.
   */
  private _setDefaultColumnOptions() {
    let row: any = this._dataProvider.data[0];
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