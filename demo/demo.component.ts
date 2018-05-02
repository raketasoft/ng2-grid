import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { GridComponent, GridDataProvider, GridEvent, GridOptions } from '../src/index';

import * as _ from 'lodash';

import { Person } from './models/person';

import DEMO_DATA from './data';
import { HttpClient } from '@angular/common/http';

/**
 * Demo component class.
 *
 * Contains examples about component usage.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.1
 */
@Component({
  selector: 'demo',
  templateUrl: './demo.component.html'
})
export class DemoComponent implements OnInit, AfterViewInit {
  basicOptions: GridOptions;
  remoteDataOptions: GridOptions;
  fullConfigurationOptions: GridOptions;
  @ViewChild('basicGrid') basicGrid: GridComponent;
  @ViewChild('columnGrid') columnGrid: GridComponent;
  isMarriedItems: Array<any>;
  countryItems: Array<any>;

  constructor(private http: HttpClient,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: _.cloneDeep(DEMO_DATA),
      height: '300px'
    });

    this.remoteDataOptions = new GridOptions({
      url: 'http://localhost:3030/',
      height: '300px'
    });

    this.fullConfigurationOptions = new GridOptions({
      additionalRequestParams: {
        'expand': 'company,interests'
      },
      bodyCssClass: 'body-table',
      data: null,
      dataItemCallback: function (row: any) {
        return new Person(row);
      },
      defaultPageSize: 10,
      defaultSortColumn: 'name',
      defaultSortType: GridDataProvider.SORT_DESC,
      defaultFilteringColumn: 'country.id',
      defaultFilteringColumnValue: 2,
      filtering: true,
      heading: true,
      headingCssClass: 'heading-table',
      height: '300px',
      httpService: this.http,
      pageButtonCount: 10,
      pageElementPosition: 'right',
      pageParam: 'page',
      pageSizeOptions: [5, 10, 20, 50],
      pageSizeElementPosition: 'left',
      pageSizeParam: 'pageSize',
      paging: true,
      requireFilters: true,
      rowAlternateStyle: false,
      rowHoverStyle: false,
      rowSelectionStyle: true,
      rowStyleCallback: function (item: Person) {
        return item.isRetired ? 'red' : 'green';
      },
      selection: true,
      selectionMultiple: false,
      sortParam: 'orderBy',
      sorting: true,
      totalCountHeader: 'X-Pagination-Total-Count',
      url: 'http://localhost:3030/',
      width: '100%',
      uniqueId: 'id'
    });

    this.isMarriedItems = this.getIsMarriedItems();
    this.countryItems = this.getCountryItems();
  }

  ngAfterViewInit() {
    this.columnGrid.options = new GridOptions({
      headingFixed: true,
      selection: true,
      defaultPageSize: 5,
      pageSizeOptions: [5, 10, 20, 50],
    });
    this.columnGrid.setData(_.cloneDeep(DEMO_DATA));
    this.columnGrid.setFilter('country.id', '2');
    this.columnGrid.setSort('id');
    this.columnGrid.setPageSize(10);
    this.columnGrid.render();

    this.changeDetectorRef.detectChanges();
  }

  onItemClick(e: MouseEvent, item: any) {
    e.preventDefault();
    e.stopPropagation();
    alert(item.name);
  }

  getIsMarriedItems(): Array<any> {
    return [
      {value: 'true', text: 'Yes'},
      {value: 'false', text: 'No'},
    ];
  }

  getCountryItems(): Array<any> {
    return [
      {value: 1, text: 'Brazil'},
      {value: 2, text: 'Canada'},
      {value: 3, text: 'China'},
      {value: 4, text: 'France'},
      {value: 5, text: 'Russia'},
      {value: 6, text: 'United Kingdom'},
      {value: 7, text: 'United States'},
    ];
  }

  onClearSelectionBtnClick() {
    this.columnGrid.clearSelection();
  }

  onGridEvent(event: GridEvent) {
    console.log(event);
  }

  /**
   * Cell callback style method.
   *
   * @param {any} data
   *
   * @return {string}
   */
  getCellCssClass(data: any): string {
    if (data.age > 60) {
      return 'red';
    }

    return 'green';
  }
}
