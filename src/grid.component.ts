import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { isFunction, isUndefined, isNull, isObject, flatMap, filter, get, isEmpty, keys } from 'lodash';
import { Dictionary } from 'lodash';

import { DataItemCallback, GridOptions } from './grid-options';
import { StyleCallback } from './style-callback.interface';
import { GridColumnComponent } from './grid-column.component';
import { GridDataProvider } from './grid-data-provider';
import { GridEvent } from './grid-event';
import { GridFilter } from './grid-filter.interface';

/**
 * Data grid component class.
 *
 * Component configuration is done through the options property.
 * Supports sorting, filtering and paging.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.1
 */
@Component({
  selector: 'ng-grid',
  template: `    
      <div class="ng-grid"
           (mousedown)="onGridMouseDown($event)"
           (mousemove)="onGridMouseMove($event)"
           (dragstart)="onGridDragStart($event)">
          <div #header class="ng-grid-header"
               [class.scroll]="options.get('height')"
               [style.width]="options.get('width')">
              <table [class]="getHeadingCssClass()" [style.width]="options.get('width')">
                  <thead *ngIf="options.get('heading')">
                  <tr>
                      <th *ngIf="options.get('selection')" class="ng-grid-heading selection">
                          <input #selectAll type="checkbox"
                                 *ngIf="options.get('selectionMultiple')"
                                 [ngModel]="allResultsSelected()"
                                 (click)="onSelectAllCheckboxClick(selectAll.checked)">
                      </th>
                      <th *ngFor="let column of columns" class="ng-grid-heading"
                          [style.width]="column.width"
                          [class.sort]="isSortedBy(column)"
                          [class.sort-asc]="isSortedBy(column, 'asc')"
                          [class.sort-desc]="isSortedBy(column, 'desc')"
                          [class.sort-disable]="!isSortingAllowed(column)"
                          [ngClass]="column.cssClass"
                          (click)="onHeadingClick(column)">
                          {{column.resolveHeading()}}
                      </th>
                  </tr>
                  </thead>
                  <tbody *ngIf="options.get('filtering')">
                  <tr>
                      <td *ngIf="options.get('selection')" class="ng-grid-filter selection"></td>
                      <td *ngFor="let column of columns" class="ng-grid-filter">
                          <input type="text" *ngIf="isInputFilterEnabled(column)"
                                 [ngModel]="getFilter(column.name)"
                                 (keyup.enter)="onInputFilterEnter($event, column)"
                                 (blur)="onInputFilterBlur($event, column)"
                                 (change)="onInputFilterChange($event, column)"/>
                          <select *ngIf="isSelectFilterEnabled(column)"
                                  [ngModel]="getFilter(column.name)"
                                  (ngModelChange)="onSelectFilterChange($event, column)">
                              <option></option>
                              <option
                                      *ngFor="let item of column.items"
                                      [value]="item[column.valueField]">{{item[column.textField]}}</option>
                          </select>
                          <ng-grid-column-template-renderer
                                  *ngIf="isTemplateColumn(column) && column.headerTemplate"
                                  [template]="column.headerTemplate"
                                  [column]="column"
                                  [data]="row"
                          >
                          </ng-grid-column-template-renderer>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </div>
          <div #body class="ng-grid-body"
               [class.scroll]="options.get('height')"
               (scroll)="onBodyScroll(body, header)"
               [style.width]="options.get('width')"
               [style.max-height]="options.get('height')">
              <p *ngIf="!isResultsDisplayAllowed()" [style.width]="getFullTableWidth()">
                  To view results please add search filters
              </p>
              <p *ngIf="isResultsDisplayAllowed() && getResults().length === 0" [style.width]="getFullTableWidth()">
                  No results found
              </p>
              <table #table [class]="getBodyCssClass()" [style.width]="options.get('width')"
                     *ngIf="isResultsDisplayAllowed()">
                  <tbody>
                  <tr *ngFor="let row of getResults(); let i = index"
                      [class]="getRowCssClass(i, row)"
                      (click)="onRowClick(row)">
                      <td *ngIf="options.get('selection')" class="ng-grid-cell selection">
                          <input type="checkbox"
                                 [ngModel]="isRowSelected(row)"
                                 (click)="onSelectItemCheckboxClick($event, row)">
                      </td>
                      <td *ngFor="let column of columns" class="ng-grid-cell"
                          [style.width]="column.width"
                          [style.text-align]="column.textAlign"
                          [ngClass]="column.cellStyleCallback(row)">
                          <span *ngIf="column.cellTemplate">
                              <ng-grid-column-template-renderer [template]="column.cellTemplate" [column]="column" [data]="row">
                              </ng-grid-column-template-renderer>
                          </span>
                          <span *ngIf="!column.cellTemplate">
                              {{column.resolveCell(row)}}
                          </span>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </div>
          <div #footer class="ng-grid-footer clearfix">
              <div class="ng-grid-pager {{options.get('pageElementPosition')}}"
                   *ngIf="options.paging && isResultsDisplayAllowed()">
                  <span>Pages:</span>
                  <a href="#" *ngIf="getPageIndex() > 1" [attr.data-page]="1"
                     (click)="onPageButtonClick($event)">First</a>
                  <a href="#" *ngIf="getPageIndex() > 1" [attr.data-page]="getPageIndex() - 1"
                     (click)="onPageButtonClick($event)">Prev</a>
                  <ng-template ngFor let-page [ngForOf]="pages">
                      <a href="#" *ngIf="page != getPageIndex()" [attr.data-page]="page"
                         (click)="onPageButtonClick($event)">{{page}}</a>
                      <span *ngIf="page == getPageIndex()">{{page}}</span>
                  </ng-template>
                  <a href="#" *ngIf="getPageIndex() < getTotalPages()"
                     [attr.data-page]="getPageIndex() + 1"
                     (click)="onPageButtonClick($event)">Next</a>
                  <a href="#" *ngIf="getPageIndex() < getTotalPages()"
                     [attr.data-page]="getTotalPages()"
                     (click)="onPageButtonClick($event)">Last</a>
                  <span>{{getPageIndex()}} of {{getTotalPages()}}</span>
              </div>
              <div class="ng-grid-pager-size {{options.get('pageSizeElementPosition')}}"
                   *ngIf="isPageSizeOptionsEnabled()">
                  <span>Page size:</span>
                  <select [ngModel]="getPageSize()"
                          (ngModelChange)="onPageSizeDropDownChange($event)">
                      <option
                              *ngFor="let value of options.get('pageSizeOptions')"
                              [value]="value">{{value}}
                      </option>
                  </select>
              </div>
          </div>
          <ng-grid-sticky-scroll
                  *ngIf="options.get('stickyScroll') && tableRef"
                  [scrollableElement]="tableRef"
          >
          </ng-grid-sticky-scroll>
      </div>`
})
export class GridComponent implements OnInit, AfterContentInit, AfterViewInit {
  static ROW_ALT_CLASS = 'alt';
  static ROW_HOVER_CLASS = 'hover';
  static ROW_SELECT_CLASS = 'select';

  @ContentChildren(GridColumnComponent) columnList: QueryList<GridColumnComponent>;
  @Output() filterChange: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() sortChange: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() pageChange: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() pageSizeChange: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() itemSelect: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() requestSend: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() serverError: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @Output() update: EventEmitter<GridEvent> = new EventEmitter<GridEvent>();
  @ViewChild('header') headerRef: ElementRef;
  @ViewChild('body') bodyRef: ElementRef;
  @ViewChild('table') tableRef: ElementRef;

  private _options: GridOptions;
  private columns: Array<GridColumnComponent> = [];
  private data: Array<any>;
  private errors: Array<any> = [];
  private filters: Dictionary<GridFilter> = {};
  private dataProvider: GridDataProvider;
  private pages: Array<number> = [];
  private selectionMap: Array<any> = [];
  private selectedItems: Array<any> = [];
  private dataIsLoaded: Subject<boolean> = new Subject<boolean>();

  private headerOffsetTop: number;
  private headerOffsetHeight: number;
  private bodyOffsetTop: number;
  private bodyOffsetHeight: number;
  private headerTopLimit: number;
  private headerTop: number;
  private bodyScrollLeft: number;
  private bodyClientX: number;
  private fullTableWidth: string;

  /**
   * Class constructor.
   *
   * @param {HttpClient} http
   * @param {Renderer2} renderer
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) {
    this.http = http;
    this.dataProvider = new GridDataProvider(this.http, this._options);
  }

  /**
   * Setter for grid options.
   *
   * @param {GridOptions} value
   */
  @Input('options')
  set options(value: GridOptions) {
    this._options = value;
    this.initDataProvider();
  }

  /**
   * Getter for grid options.
   */
  get options(): GridOptions {
    return this._options;
  }

  /**
   * Handle OnInit event.
   */
  ngOnInit() {
    if (isUndefined(this._options)) {
      this._options = new GridOptions();
    }
    if (!isUndefined(this._options.get('httpService'))) {
      this.http = this._options.get('httpService');
    }
    this.dataIsLoaded.subscribe(() => this.refresh());
  }

  /**
   * Handle AfterContentInit event.
   */
  ngAfterContentInit() {
    this.columns = this.columnList.toArray();
  }

  /**
   * Handle AfterViewInit event.
   */
  ngAfterViewInit() {
    this.render();
    this.handleContentResize();
    this.changeDetector.detectChanges();
  }

  /**
   * Set all data bound to the grid.
   *
   * @returns {Array<any>}
   */
  setData(data: Array<any>) {
    this.data = this.dataProvider.sourceData = this.formatData(data);
  }

  /**
   * Return all data bound to the grid.
   *
   * @returns {Array<any>}
   */
  getData(): Array<any> {
    return this.data;
  }

  /**
   * Return number of total results.
   *
   * @returns {number}
   */
  getTotalCount(): number {
    return this.dataProvider.getTotalCount();
  }

  /**
   * Return number of total results.
   *
   * @param {number} totalCount
   */
  setTotalCount(totalCount: number) {
    this.dataProvider.setTotalCount(totalCount);
  }

  /**
   * Set the results displayed in current page.
   *
   * @params {Array<any>} results
   */
  setResults(results: Array<any>) {
    this.dataProvider.setData(this.formatData(results));

    if (this._options.get('pageByPageLoading') && this.isResultsDisplayAllowed()) {
      this.dataIsLoaded.next(true);
    }
  }

  /**
   * Return results displayed on current page.
   *
   * @returns {Array<any>}
   */
  getResults(): Array<any> {
    return this.dataProvider.getData();
  }

  /**
   * Return number of results displayed on current page.
   *
   * @returns {number}
   */
  getCount(): number {
    return this.dataProvider.getCount();
  }

  /**
   * Return current page index.
   *
   * @returns {number}
   */
  getPageIndex(): number {
    return this.dataProvider.pageIndex;
  }

  /**
   * Render data for given page.
   *
   * @param {number} pageIndex
   */
  setPageIndex(pageIndex: number) {
    this.dataProvider.pageIndex = pageIndex;

    this.pageChange.emit(new GridEvent({
      data: pageIndex,
      type: GridEvent.PAGE_CHANGE_EVENT
    }));
  }

  /**
   * Return current page size.
   *
   * @returns {number}
   */
  getPageSize(): number {
    return this.dataProvider.pageSize;
  }

  /**
   * Change page size to given value and render data.
   *
   * @param {number} pageSize
   */
  setPageSize(pageSize: number) {
    this.dataProvider.pageSize = pageSize;
    this.setPageIndex(1);

    this.pageSizeChange.emit(new GridEvent({
      data: pageSize,
      type: GridEvent.PAGE_SIZE_CHANGE_EVENT
    }));
  }

  /**
   * Return total number of grid pages.
   *
   * @returns {number}
   */
  getTotalPages(): number {
    if (!this.getPageSize() || this.getPageSize() > this.getTotalCount()) {
      return 1;
    }

    return Math.ceil(this.getTotalCount() / this.getPageSize());
  }

  /**
   * Prepare string filter for new RegExp(str)
   * @param {string} str
   *
   * @returns {string}
   */
  escapeRegExp(str: string): string {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  /**
   * Add a filter value for specific column.
   *
   * @param {string} columnName Name of grid column or property of bound data item
   * @param {string} value Value to be used as filter for the column
   * @param {string} columnType Type of the column (text or number)
   *
   * @returns {boolean}
   */
  setFilter(columnName: string, value: string, columnType?: string) {
    const column: GridColumnComponent = this.getColumn(columnName);

    if (!columnType) {
      columnType = column ? column.type : GridColumnComponent.COLUMN_TYPE_STRING;
    }

    if (columnType === GridColumnComponent.COLUMN_TYPE_NUMBER && value.length) {
      const expression: RegExp = new RegExp('^(?:NaN|-?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity))$');
      const isValid: boolean = expression.test(value);

      if (!isValid) {
        if (!this.getError(columnName)) {
          const columnHeading: string = column && column.heading ? column.heading : columnName;
          const message = `Invalid filter value for "${columnHeading}". Please enter valid Number.`;

          this.setError(columnName, message);
        }

        return false;
      }
    }

    this.clearError(columnName);

    const isDataSetAsync: boolean = this.isDataSetAsync();

    if (value) {
      this.filters[columnName] = { raw: value, escaped: this.escapeRegExp(value) };
      if (isDataSetAsync) {
        this.dataProvider.requestParams[columnName] = value;
      }
    } else if (this.filters[columnName]) {
      delete this.filters[columnName];
      if (isDataSetAsync) {
        delete this.dataProvider.requestParams[columnName];
      }
    }
    this.setPageIndex(1);

    this.filterChange.emit(new GridEvent({
      data: value,
      target: column ? column : columnName,
      type: GridEvent.FILTER_CHANGE_EVENT
    }));

    return true;
  }

  /**
   * Return filter value for given column.
   *
   * @param {string} columnName
   * @returns {string}
   */
  getFilter(columnName: string): string {
    return this.filters[columnName] ? this.filters[columnName].raw : undefined;
  }

  /**
   * Clear filter value for given column.
   *
   * @param {string} columnName
   */
  clearFilter(columnName: string) {
    delete this.filters[columnName];
    this.clearError(columnName);
  }

  /**
   * Clear filter values for all columns.
   */
  clearAllFilters() {
    for (let column of this.columns) {
      this.clearFilter(column.name);
    }
  }

  /**
   * Set validation error for given column.
   *
   * @param {string} columnName
   * @param {string} error Error message
   */
  setError(columnName: string, error: string) {
    this.errors[columnName] = error;
  }

  /**
   * Return validation error for given column.
   *
   * @param {string} columnName
   * @returns {any}
   */
  getError(columnName: string): string {
    return this.errors[columnName];
  }

  /**
   * Clear validation error for given column.
   *
   * @param {string} columnName
   */
  clearError(columnName: string) {
    delete this.errors[columnName];
  }

  /**
   * Clear errors for all columns.
   */
  clearAllErrors() {
    for (let column of this.columns) {
      this.clearError(column.name);
    }
  }

  /**
   * Calling this method would sort the grid data by the given sort column and
   * sort type.
   *
   * @param {string} columnName Name of grid column to be used for sorting
   * @param {string} sortType Optional, values are 'asc' or 'desc'
   * @param {boolean} caseInsensitiveSort
   */
  setSort(columnName: string, sortType?: string, caseInsensitiveSort?: boolean) {
    const column: GridColumnComponent = this.getColumn(columnName);

    this.dataProvider.setSort(columnName, sortType, caseInsensitiveSort);
    this.sortChange.emit(new GridEvent({
      data: sortType,
      target: column ? column : columnName,
      type: GridEvent.SORT_CHANGE_EVENT
    }));
  }

  /**
   * Return a list of selected grid items.
   *
   * @returns {Array<any>}
   */
  getSelectedItems(): Array<any> {
    return this.selectedItems;
  }

  /**
   * Clear all selected items.
   */
  clearSelection() {
    this.selectedItems = [];
    this.selectionMap = [];
  }

  /**
   * Return grid column component by given name.
   *
   * @param {string} columnName
   * @returns {GridColumnComponent}
   */
  getColumn(columnName: string): any {
    for (let column of this.columns) {
      if (column.name === columnName) {
        return column;
      }
    }
  }

  /**
   * Render grid.
   */
  render() {
    let hasErrors = false;

    for (let error in this.errors) {
      if (this.errors.hasOwnProperty(error)) {
        hasErrors = true;
        alert(this.errors[error]);
      }
    }

    if (hasErrors) {
      return false;
    }

    if (!this.isDataSetAsync()) {
      this.filter();
      this.refresh();
      this.emitUpdateEvent();
    } else if (this.isResultsDisplayAllowed()) {
      if (!this._options.get('pageByPageLoading')) {
        this.dataProvider.fetch().subscribe(
          (res: HttpResponse<any>) => {
            this.setResults(res.body);
            this.refresh();
            this.emitUpdateEvent();
          },
          (err: any) => {
            console.log(err);

            this.serverError.emit(new GridEvent({
              data: err,
              type: GridEvent.SERVER_ERROR_EVENT
            }));
          }
        );

        this.requestSend.emit(new GridEvent({
          type: GridEvent.REQUEST_SEND_EVENT
        }));
      } else {
        this.emitUpdateEvent();
      }
    } else {
      this.setData([]);
    }
  }

  /**
   * Emit grid update event
   */
  emitUpdateEvent() {
    this.update.emit(new GridEvent({
      data: this.getResults(),
      type: GridEvent.UPDATE_EVENT
    }));
  }

  /**
   * Check if displaying results is allowed.
   *
   * @returns boolean
   */
  isResultsDisplayAllowed(): boolean {
    if (this._options.get('requireFilters')) {
      if (!isUndefined(this.columns)) {
        for (let column of this.columns) {
          if (!isUndefined(this.getFilter(column.name))) {
            return true;
          }
        }
      }

      return false;
    }

    return true;
  }

  /**
   * Handle window resize event.
   */
  @HostListener('window:resize', ['$event'])
  protected onWindowResize(event: UIEvent) {
    this.handleContentResize();
  }

  /**
   * Handle window scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  protected onWindowScroll(event: UIEvent) {
    if (this._options.get('headingFixed')) {
      let documentScrollTop: number = document.documentElement.scrollTop || document.body.scrollTop;
      this.headerRef.nativeElement.style.top = '0';
      this.headerOffsetTop = this.headerRef.nativeElement.offsetTop;
      this.headerOffsetHeight = this.headerRef.nativeElement.offsetHeight;
      this.bodyOffsetTop = this.bodyRef.nativeElement.offsetTop;
      this.bodyOffsetHeight = this.bodyRef.nativeElement.offsetHeight;
      this.headerTopLimit = this.bodyOffsetHeight + this.bodyOffsetTop
          - this.headerOffsetTop - this.headerOffsetHeight;
      this.headerTop = documentScrollTop - this.headerOffsetTop;

      if (!isNull(this.headerRef.nativeElement.offsetParent) &&
          !isNull(this.headerRef.nativeElement.offsetParent.offsetTop)) {
          this.headerTop -= this.headerRef.nativeElement.offsetParent.offsetTop;
      }

      const banner: Element = document.body.querySelector('[role="banner"]');
      if (!isNull(banner)) {
        this.headerTop += banner.clientHeight;
      }

      if (this.headerTop <= 0) {
        this.renderer.removeClass(this.headerRef.nativeElement, 'fixed');
        this.headerRef.nativeElement.style.top = '0';
      } else if (this.headerTop > 0 && this.headerTop < this.headerTopLimit) {
        this.renderer.addClass(this.headerRef.nativeElement, 'fixed');
        this.headerRef.nativeElement.style.top = this.headerTop + 'px';
      } else {
        this.headerRef.nativeElement.style.top = this.headerTopLimit + 'px';
      }
    }
  }

  /**
   * Handle windows mouseup event.
   */
  @HostListener('window:mouseup', ['$event'])
  protected onWindowMouseUp(event: MouseEvent) {
    this.endBodyDrag();
  }

  /**
   * Return fullTableWidth value.
   */
  protected getFullTableWidth() {
    return this.fullTableWidth;
  }


  /**
   * Handle grid body mousedown event.
   */
  protected onGridMouseDown(event: MouseEvent) {
    this.startBodyDrag(event);
  }

  /**
   * Handle grid body mousemove event.
   */
  protected onGridMouseMove(event: MouseEvent) {
    this.bodyDrag(event);
  }

  /**
   * Handle grid body dragstart event.
   */
  protected onGridDragStart(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * Handle content size changes.
   */
  protected handleContentResize() {
    this.fullTableWidth = this.headerRef.nativeElement.firstElementChild.offsetWidth + 'px';
  }

  /**
   * Format data using dataItemCallback if given.
   *
   * @param {Array<any>} data
   *
   * @returns {Array<any>}
   */
  protected formatData(data: Array<any>): Array<any> {
    let callback: DataItemCallback = this._options.get('dataItemCallback');

    return callback ? flatMap(data, callback) : data;
  }

  /**
   * Refresh grid component.
   */
  protected refresh() {
    this.paginate();
    this.handleContentResize();
  }

  /**
   * Filter provided data.
   */
  protected filter() {
    const self: GridComponent = this;

    this.dataProvider.sourceData = filter(this.data, function(item: any) {
      let match = true;
      for (let filterColumn in self.filters) {
        if (self.filters.hasOwnProperty(filterColumn)) {
          let result: any = get(item, filterColumn, '');
          let value: string = result !== null ? result.toString() : '';
          let column: GridColumnComponent = self.getColumn(filterColumn);

          if (column && isFunction(column.filterCallback)) {
            match = match && column.filterCallback(item, self.filters[filterColumn].raw);
          } else if (column && column.type === GridColumnComponent.COLUMN_TYPE_NUMBER) {
            match = match && value === self.filters[filterColumn].raw;
          } else {
            match = match && !isEmpty(value.match(new RegExp(self.filters[filterColumn].escaped, 'i')));
          }
        }
      }

      return match;
    });
  }

  /**
   * Check if input filter is enabled for given column.
   *
   * @param {GridColumnComponent} column
   * @returns {boolean}
   */
  protected isInputFilterEnabled(column: GridColumnComponent) {
    return (column.filterType === GridColumnComponent.FILTER_TYPE_INPUT
        && column.filtering === true);
  }

  /**
   * Check if select filter is enabled for given column.
   *
   * @param {GridColumnComponent} column
   * @returns {boolean}
   */
  protected isSelectFilterEnabled(column: GridColumnComponent) {
    return (column.filterType === GridColumnComponent.FILTER_TYPE_SELECT
        && column.filtering === true);
  }

  /**
   * Checks if given column contains specific component for rendering
   *
   * @param column
   * @returns {boolean}
   */
  protected isTemplateColumn(column: GridColumnComponent): boolean {
    return column.filtering === false && column.type === GridColumnComponent.COLUMN_TYPE_TEMPLATE;
  }

  /**
   * Determine the CSS class that needs to be applied to the each grid row.
   *
   * @param {number} index Row index
   * @param {any} row Row data
   * @returns {string} Row color
   */
  protected getRowCssClass(index: number, row: any) {
    let cssClass = '';

    if (this._options.get('rowAlternateStyle') && index % 2 !== 0) {
      cssClass = this.concatCssClass(cssClass, GridComponent.ROW_ALT_CLASS);
    }
    if (this._options.get('rowHoverStyle')) {
      cssClass = this.concatCssClass(cssClass, GridComponent.ROW_HOVER_CLASS);
    }

    let callback: StyleCallback = this.options.get('rowStyleCallback');

    if (callback) {
      cssClass = this.concatCssClass(cssClass, callback(row));
    }
    if (this.isRowSelected(row) && this._options.get('rowSelectionStyle')) {
      cssClass = this.concatCssClass(cssClass, GridComponent.ROW_SELECT_CLASS);
    }

    return cssClass;
  }

  /**
   * Get heading css class.
   *
   * @returns {string}
   */
  protected getHeadingCssClass(): string {
    if (isUndefined(this._options.get('headingCssClass'))) {
      return '';
    }

    return this._options.get('headingCssClass');
  }

  /**
   * Get body css class.
   *
   * @returns {string}
   */
  protected getBodyCssClass(): string {
    if (isUndefined(this._options.get('bodyCssClass'))) {
      return '';
    }

    return this._options.get('bodyCssClass');
  }

  /**
   * Handle body scroll event.
   *
   * @param {HTMLElement} bodyElement
   * @param {HTMLElement} headerElement
   */
  protected onBodyScroll(bodyElement: HTMLElement, headerElement: HTMLElement) {
    headerElement.scrollLeft = bodyElement.scrollLeft;
  }

  /**
   * Handle select/deselect all grid rows.
   *
   * @param {boolean} selected
   */
  protected onSelectAllCheckboxClick(selected: boolean) {
    if (this._options.get('selection') && this._options.get('selectionMultiple')) {
      for (let row of this.getResults()) {
        this.setRowSelection(row, selected);
      }
    }
  }

  /**
   * Handle row select checkbox click.
   *
   * @param {MouseEvent} event
   * @param {any} row
   */
  protected onSelectItemCheckboxClick(event: MouseEvent, row: any) {
    event.stopPropagation();
    if (this._options.get('selection')) {
      this.setRowSelection(row);
    }
  }

  /**
   * Check if all results on current page are selected.
   *
   * @returns {boolean}
   */
  protected allResultsSelected(): boolean {
    if (!this.getTotalCount()) {
      return false;
    }

    for (let row of this.getResults()) {
      if (!this.isRowSelected(row)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Handle grid row click event.
   *
   * @param {any} row
   */
  protected onRowClick(row: any) {
    if (this._options.get('selection')) {
      this.setRowSelection(row);
    }
  }

  /**
   * Initialize data provider based on grid options.
   */
  protected initDataProvider() {
    this.dataProvider = new GridDataProvider(this.http, {
      pageParam: this._options.get('pageParam'),
      pageSizeParam: this._options.get('pageSizeParam'),
      pageSize: this._options.get('defaultPageSize'),
      requestParams: this._options.get('additionalRequestParams'),
      sortParam: this._options.get('sortParam'),
      sourceUrl: this._options.get('url'),
      pageByPageLoading: this._options.get('pageByPageLoading'),
      totalCountHeader: this._options.get('totalCountHeader')
    });

    if (!isUndefined(this._options.get('defaultSortColumn'))) {
      this.setSort(
        this._options.get('defaultSortColumn'),
        this._options.get('defaultSortType')
      );
    }

    if (!isUndefined(this._options.get('defaultFilteringColumn'))) {
      this.setFilter(
        this._options.get('defaultFilteringColumn'),
        this._options.get('defaultFilteringColumnValue')
      );
    }

    this.setData(this._options.get('data'));
  }

  /**
   * Build a list of the pages that should be display in the grid, based on
   * current page index and max button count.
   */
  protected paginate() {
    if (this._options.get('paging')) {
      let pageButtonCount: number = Math.min(
        this._options.get('pageButtonCount'),
        this.getTotalPages()
      );
      let offsetLeft: number = Math.floor(pageButtonCount / 2);
      let offsetRight: number = Math.ceil(pageButtonCount / 2) - 1;
      let startIndex: number = this.getPageIndex() - offsetLeft;
      let endIndex: number = this.getPageIndex() + offsetRight;

      if (startIndex < 1) {
        startIndex = 1;
        endIndex = pageButtonCount;
      } else if (endIndex > this.getTotalPages()) {
        endIndex = this.getTotalPages();
        startIndex = endIndex - pageButtonCount + 1;
      }

      this.pages = [];
      for (let i: number = startIndex; i <= endIndex; i++) {
        this.pages.push(i);
      }
    }
  }

  /**
   * Page button click handler.
   * When invoked grid data for specific page would be rendered.
   *
   * @param {MouseEvent} event
   */
  protected onPageButtonClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const element: HTMLSelectElement = event.target as HTMLSelectElement;
    const pageIndex: number = Number(element.getAttribute('data-page'));

    this.setPageIndex(pageIndex);
    this.render();
  }

  /**
   * Check if page size options are enabled.
   *
   * @returns {boolean}
   */
  protected isPageSizeOptionsEnabled(): boolean {
    return this._options.get('paging')
      && (!isEmpty(this._options.get('pageSizeOptions'))
        || this._options.get('pageSizeOptions') !== false);
  }

  /**
   * Page size drop-down change handler.
   * When invoked the page size of the grid would be changed and data would be
   * re-rendered.
   *
   * @param {any} event
   */
  protected onPageSizeDropDownChange(event: any) {
    this.setPageSize(event);
    this.render();
  }

  /**
   * Select filter change handler.
   * When invoked a filter would be set with the input value.
   *
   * @param {any} event
   * @param {GridColumnComponent} column
   */
  protected onSelectFilterChange(event: any, column: GridColumnComponent) {
    this.setFilter(column.name, event);
    this.render();
  }

  /**
   * Input filter blur handler.
   * When invoked a filter would be set with the input value.
   *
   * @param {MouseEvent} event
   * @param {GridColumnComponent} column
   */
  protected onInputFilterBlur(event: MouseEvent, column: GridColumnComponent) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    let keyword: string = element.value.trim();

    this.setFilter(column.name, keyword);
  }

  /**
   * Input filter change handler.
   *
   * @param {MouseEvent} event
   * @param {GridColumnComponent} column
   */
  protected onInputFilterChange(event: MouseEvent, column: GridColumnComponent) {
    this.clearError(column.name);
  }

  /**
   * Input filter enter key hanlder.
   * When invoked a filter would be set with the input value and the grid
   * filter would be triggered.
   *
   * @param {MouseEvent} event
   * @param {GridColumnComponent} column
   */
  protected onInputFilterEnter(event: MouseEvent, column: GridColumnComponent) {
    this.onInputFilterBlur(event, column);

    this.render();
  }

  /**
   * Grid heading click handler.
   * When invoked the grid would be sorted by the clicked column.
   *
   * @param {GridColumnComponent} column
   */
  protected onHeadingClick(column: GridColumnComponent) {
    if (this.isSortingAllowed(column)) {
      this.setSort(column.name, this.getSortType(column), column.caseInsensitiveSort);
      this.render();
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
  protected isSortedBy(column: GridColumnComponent, sortType?: string): boolean {
    if (!(column.sorting === true)) {
      return false;
    }

    let isOrderedByField: boolean =
        column.name === this.dataProvider.getSortColumn();

    if (isUndefined(sortType)) {
      return isOrderedByField;
    }

    return isOrderedByField && this.dataProvider.getSortType() === sortType;
  }

  /**
   * Determine sort type by column name.
   * If column name is different from current sort column the order type would
   * be preserved, otherwise the sort type would be changed to the opposite.
   *
   * @param {GridColumn} column
   * @returns {string}
   */
  protected getSortType(column: GridColumnComponent): string {
    return column.name !== this.dataProvider.getSortColumn() ?
      this.dataProvider.getSortType() :
        (this.dataProvider.getSortType() === GridDataProvider.SORT_ASC ?
          GridDataProvider.SORT_DESC : GridDataProvider.SORT_ASC);
  }

  /**
   * Check if sorting is allowed for specific grid column.
   *
   * @param {GridColumn} column
   * @returns {boolean}
   */
  protected isSortingAllowed(column: GridColumnComponent): boolean {
    return this._options.get('sorting') && column.sorting === true;
  }

  /**
   * Determine the column name used in column options.
   *
   * @param {string} key Data item key
   * @param {any} row Data item, could be primitive data type or an object
   * @returns {string}
   */
  protected getColumnName(key: string, row: any): string {
    if (isObject(row[key])) {
      return key.concat('.', this.getNestedKey(row[key]));
    }

    return key;
  }

  /**
   * Check if row is selected.
   *
   * @param {any} row
   * @returns boolean
   */
  protected isRowSelected(row: any): boolean {
    let id: string = row[this._options.get('uniqueId')];

    if (isUndefined(this.selectionMap[id])) {
      return false;
    }

    return this.selectionMap[id];
  }

  /**
   * Start grid body drag.
   *
   * @param {MouseEvent} event
   */
  private startBodyDrag(event: MouseEvent) {
    this.bodyClientX = event.clientX;
    this.bodyScrollLeft = this.bodyRef.nativeElement.scrollLeft;
  }

  /**
   * End grid body drag.
   */
  private endBodyDrag() {
    delete this.bodyClientX;
    delete this.bodyScrollLeft;
    this.bodyRef.nativeElement.style.cursor = 'auto';
  }

  /**
   * Handle grid body drag.
   *
   * @param {MouseEvent} event
   */
  private bodyDrag(event: MouseEvent) {
    if (!isUndefined(this.bodyClientX) && !isUndefined(this.bodyScrollLeft)) {
      this.bodyRef.nativeElement.style.cursor = 'move';
      this.bodyRef.nativeElement.scrollLeft = this.bodyScrollLeft
        - (event.clientX - this.bodyClientX);
    }
  }

  /**
   * Concat css class name to another using space.
   *
   * @param {string} cssClass
   * @param {string} addition
   * @returns {string}
   */
  private concatCssClass(cssClass: string, addition: string): string {
    return cssClass + (cssClass.length ? ' ' : '') + addition;
  }

  /**
   * Handle select/deselect a single grid row.
   *
   * @param {any} row
   * @param {boolean} value
   */
  private setRowSelection(row: any, value?: boolean) {
    let id: string = row[this._options.get('uniqueId')];

    let selected: boolean = !isUndefined(value) ? value :
      (isUndefined(this.selectionMap[id]) || !this.selectionMap[id]);

    let isCurrentRowSelected: boolean = this.isRowSelected(row);

    if (!this._options.get('selectionMultiple')) {
      this.clearSelection();
    }

    if (selected && !isCurrentRowSelected) {
      this.selectedItems.push(row);
    } else if (!selected) {
      this.selectedItems.splice(this.selectedItems.indexOf(row), 1);
    }

    const previousData = this.selectionMap[id];
    this.selectionMap[id] = selected;

    this.itemSelect.emit(new GridEvent({
      previousData,
      data: selected,
      target: row,
      type: GridEvent.ITEM_SELECT_EVENT
    }));
  }

  /**
   * Get full key name from nested object.
   *
   * @param {any} object Nested object to be iterated
   * @returns {string}
   * @example
   * var object: any = {country: { name: { officialName: "People's Republic of China", name: "China" }, id: 6 }}
   * var nestedKey: string = this.getNestedKey(object);
   * console.log(nestedKey); // will output 'country.name.officialName'
   */
  private getNestedKey(object: any): string {
    let firstKey: string = keys(object)[0];
    let firstKeyValue: any = object[firstKey];

    if (isObject(firstKeyValue)) {
      firstKey.concat('.', this.getNestedKey(firstKeyValue));
    }

    return firstKey;
  }

  /**
   * Checks is data loaded asynchronously
   *
   * @returns {boolean}
   */
  private isDataSetAsync(): boolean {
    return !isUndefined(this._options.get('url')) || this._options.get('pageByPageLoading');
  }
}
