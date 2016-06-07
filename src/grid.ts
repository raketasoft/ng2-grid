import {
  Component,
  Input,
  OnInit,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { Http, HTTP_PROVIDERS, Response } from '@angular/http';
import { GridOptions } from './grid-options';
import { GridColumn } from './grid-column';
import { GridDataProvider } from './grid-data-provider';
import { GridCellRenderer } from './grid-cell-renderer';
import * as _ from 'lodash';
import 'rxjs/Rx';

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
  moduleId: module.id,
  templateUrl: './grid.html',
  styleUrls: ['./assets/ng2-grid.css'],
  providers: [HTTP_PROVIDERS],
  directives: [GridCellRenderer]
})
export class Grid implements OnInit, AfterContentInit {
  static SORT_ASC: string = 'asc';
  static SORT_DESC: string = 'desc';

  @Input() options: GridOptions;
  @ContentChildren(GridColumn) columnList: QueryList<GridColumn>;

  private columns: Array<GridColumn>;
  private dataProvider: GridDataProvider;
  private data: Array<any>;
  private pageIndex: number = 1;
  private pages: Array<number>;

  /**
   * Class constructor.
   *
   * @param {Http} http
   */
  constructor(private http: Http) {
    this.http = http;
  }

  /**
   * Handle OnInit event.
   */
  ngOnInit() {
    if (_.isUndefined(this.options)) {
      this.options = new GridOptions();
    }
    if (!_.isUndefined(this.options.get('httpService'))) {
      this.http = this.options.get('httpService');
    }
    this.initDataProvider();
    this.render();
  }

  /**
   * Handle AfterViewInit event.
   */
  ngAfterContentInit() {
    this.columns = this.columnList.toArray();
  }

  /**
   * Set data for grid data provider.
   *
   * @returns {Array<any>}
   */
  setData(data: any): Array<any> {
    return this.dataProvider.data = data;
  }

  /**
   * Return data bound to grid data provider.
   *
   * @returns {Array<any>}
   */
  getData(): Array<any> {
    return this.dataProvider.data;
  }

  /**
   * Return data display on current page.
   *
   * @returns {Array<any>}
   */
  getPageData(): Array<any> {
    return this.data;
  }

  /**
   * Return a list of selected grid items.
   *
   * @returns {Array<any>}
   */
  getSelectedItems(): Array<any> {
    var selectedItems: Array<any> = [];

    if (!_.isEmpty(this.data)) {
      for (let row of this.data) {
        if (row.selected) {
          selectedItems.push(row);
        }
      }
    }

    return selectedItems;
  }

  /**
   * Return current page index.
   *
   * @returns {number}
   */
  getPageIndex(): number {
    return this.pageIndex;
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
   * Return total number of grid pages.
   *
   * @returns {number}
   */
  getTotalPages(): number {
    if (this.dataProvider.pageSize === false) {
      return 1;
    }

    return Math.ceil(this.dataProvider.getTotalCount() / this.dataProvider.pageSize);
  }

  /**
   * Render data for given page.
   *
   * @param {number} pageIndex
   */
  setPageIndex(pageIndex: number) {
    this.pageIndex = pageIndex;
  }

  /**
   * Change page size to given value and render data.
   *
   * @param {number} pageSize
   */
  setPageSize(pageSize: number) {
    this.dataProvider.pageSize = pageSize;
    this.pageIndex = 1;
  }

  /**
   * Add a filter value for specific column.
   *
   * @param {string} columnName
   * @param {string} value Keyword to be used as filter for the column
   */
  setFilter(columnName: string, value: string) {
    this.dataProvider.setFilter(columnName, value);
    this.pageIndex = 1;
  }

  /**
   * Calling this method would sort the grid data by the given sort column and
   * sort type.
   *
   * @param {string} sortColumn Name of grid column to be used for sorting
   * @param {string} sortType Optional, values are 'asc' or 'desc'
   */
  setSort(sortColumn: string, sortType?: string) {
    this.dataProvider.setSort(sortColumn, sortType);
  }

  /**
   * Render grid.
   */
  render() {
    this.dataProvider.page = this.pageIndex;

    if (_.isUndefined(this.options.get('url'))) {
      this.refresh();
    } else {
      this.dataProvider.fetch().subscribe(
        (res: Response) => {
          this.refresh();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  /**
   * Determine the background color of grid row.
   *
   * @param {number} index Row index
   * @returns {string} Row color
   */
  protected getAlternateBackground(index: number) {
    if (this.options.get('alternateTemplate') && index % 2 === 0) {
      return this.options.get('alternateTemplateColor');
    }
  }

  /**
   * Get heading css class.
   *
   * @returns {string}
   */
  protected getHeadingCssClass(): string {
    if (_.isUndefined(this.options.get('headingCssClass'))) {
      return '';
    }

    return this.options.get('headingCssClass');
  }


  /**
   * Get body css class.
   *
   * @returns {string}
   */
  protected getBodyCssClass(): string {
    if (_.isUndefined(this.options.get('bodyCssClass'))) {
      return '';
    }

    return this.options.get('bodyCssClass');
  }

  /**
   * Refresh grid and pagination with provider data.
   */
  protected refresh() {
    this.data = this.dataProvider.getData();
    if (this.options.get('paging')) {
      this.paginate();
    }
  }

  /**
   * Handle select/deselect all grid rows.
   *
   * @param {boolean} selected
   */
  protected onSelectAllCheckboxClick(selected: boolean) {
    for (let row of this.data) {
      row.selected = selected;
    }
  }

  /**
   * Handle select/deselect a single grid row.
   *
   * @param {any} row Data row
   */
  protected onSelectItemCheckboxClick(item: any) {
    if (_.isUndefined(item.selected)) {
      item.selected = false;
    }
    item.selected = !item.selected;
  }

  /**
   * Initialize data provider based on grid options.
   */
  protected initDataProvider() {
    this.dataProvider = new GridDataProvider(this.http, {
      additionalRequestParams: this.options.get('additionalRequestParams'),
      data: this.options.get('data'),
      pageParam: this.options.get('pageParam'),
      pageSizeParam: this.options.get('pageSizeParam'),
      pageSize: this.options.get('defaultPageSize'),
      sortParam: this.options.get('sortParam'),
      url: this.options.get('url')
    });

    if (!_.isUndefined(this.options.get('defaultSortColumn'))) {
      this.dataProvider.setSort(
        this.options.get('defaultSortColumn'),
        this.options.get('defaultSortType')
      );
    }
  }

  /**
   * Build a list of the pages that should be display in the grid, based on
   * current page index and max button count.
   */
  protected paginate() {
    let pageButtonCount: number = Math.min(
      this.options.get('pageButtonCount'),
      this.getTotalPages()
    );
    let offsetLeft: number = Math.floor(pageButtonCount / 2);
    let offsetRight: number = Math.ceil(pageButtonCount / 2) - 1;
    let startIndex: number = this.pageIndex - offsetLeft;
    let endIndex: number = this.pageIndex + offsetRight;

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

  /**
   * Page button click handler.
   * When invoked grid data for specific page would be rendered.
   *
   * @param {MouseEvent} event
   */
  protected onPageButtonClick(event: MouseEvent) {
    event.preventDefault();

    let element: HTMLSelectElement = event.target as HTMLSelectElement;
    let pageIndex: number = Number(element.getAttribute('data-page'));

    this.setPageIndex(pageIndex);
    this.render();
  }

  /**
   * Check if page size options are enabled.
   *
   * @returns {boolean}
   */
  protected isPageSizeOptionsEnabled(): boolean {
    return this.options.get('paging')
      && (!_.isEmpty(this.options.get('pageSizeOptions'))
        || this.options.get('pageSizeOptions') !== false);
  }

  /**
   * Page size drop-down change handler.
   * When invoked the page size of the grid would be changed and data would be
   * re-rendered.
   *
   * @param {MouseEvent} event
   */
  protected onPageSizeDropDownChange(event: MouseEvent) {
    let element: HTMLSelectElement = event.target as HTMLSelectElement;
    let pageSize: number = Number(element.options.item(element.selectedIndex).innerHTML);

    this.setPageSize(pageSize);
    this.render();
  }

  /**
   * Filter input blur handler.
   * When invoked a filter would be set with the input value.
   *
   * @param {MouseEvent} event
   */
  protected onFilterInputBlur(event: MouseEvent) {
    let element: HTMLInputElement = event.target as HTMLInputElement;
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
  protected onFilterInputEnter(event: MouseEvent) {
    this.onFilterInputBlur(event);

    this.render();
  }

  /**
   * Grid heading click handler.
   * When invoked the grid would be sorted by the clicked column.
   *
   * @param {MouseEvent} event
   */
  protected onHeadingClick(event: MouseEvent) {
    let element: HTMLElement = event.target as HTMLElement;
    let columnName: string = element.getAttribute('data-id');
    let column: GridColumn = _.find(this.columns, function(item: any) {
      return item.name === columnName;
    });

    if (this.isSortingAllowed(column)) {
      this.setSort(columnName, this.getSortType(column));
      this.render();
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
  protected isSortedBy(column: GridColumn, sortType?: string): boolean {
    let isOrderedByField: boolean =
        column.name === this.dataProvider.getSortColumn();

    if (_.isUndefined(sortType)) {
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
  protected getSortType(column: GridColumn): string {
    return column.name !== this.dataProvider.getSortColumn() ?
      this.dataProvider.getSortType() :
        (this.dataProvider.getSortType() === Grid.SORT_ASC ?
          Grid.SORT_DESC : Grid.SORT_ASC);
  }

  /**
   * Check if sorting is allowed for specific grid column.
   *
   * @param {GridColumn} column
   * @returns {boolean}
   */
  protected isSortingAllowed(column: GridColumn): boolean {
    console.log(this.options.get('sorting'));
    console.log(column);
    return this.options.get('sorting') && column.sorting == true;
  }

  /**
   * Determine the column name used in column options.
   *
   * @param {string} key Data item key
   * @param {any} row Data item, could be primitive data type or an object
   * @returns {string}
   */
  protected getColumnName(key: string, row: any): string {
    if (_.isObject(row[key])) {
      return key.concat('.', this.getNestedKey(row[key]));
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
   * var nestedKey: string = this.getNestedKey(object);
   * console.log(nestedKey); // will output 'country.name.officialName'
   */
  private getNestedKey(object: any): string {
    let firstKey: string = _.keys(object)[0];
    let firstKeyValue: any = object[firstKey];

    if (_.isObject(firstKeyValue)) {
      firstKey.concat('.', this.getNestedKey(firstKeyValue));
    }

    return firstKey;
  }
}
