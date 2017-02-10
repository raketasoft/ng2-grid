import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Http } from '@angular/http';

import {
  GridComponent,
  GridColumnComponent,
  GridEvent,
  GridOptions,
  GridDataProvider
} from '../src/index';

import DEMO_DATA from './data';
import * as _ from 'lodash';

@Component({
  selector: 'my-demo',
  templateUrl: './demo.component.html'
})
export class DemoComponent implements OnInit, AfterViewInit {
  basicOptions: GridOptions;
  columnOptions: GridOptions;
  remoteDataOptions: GridOptions;
  fullConfigurationOptions: GridOptions;
  @ViewChild('basicGrid') basicGrid: GridComponent;
  @ViewChild('columnGrid') columnGrid: GridComponent;
  isMarriedItems: Array<any>;
  countryItems: Array<any>;

  constructor(
    private http: Http,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: _.cloneDeep(DEMO_DATA),
      height: '300px'
    });

    this.columnOptions = new GridOptions({
      headingFixed: true,
      selection: true,
      defaultPageSize: 5,
      pageSizeOptions: [5, 10, 20, 50],
    });

    this.remoteDataOptions = new GridOptions({
      url: 'http://localhost:3000/',
      height: '300px'
    });

    this.fullConfigurationOptions = new GridOptions({
      additionalRequestParams: {
        'expand': 'company,interests'
      },
      bodyCssClass: 'body-table',
      data: null,
      defaultPageSize: 5,
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
      rowStyleCallback: function (row: any) {
        return row.isMarried ? 'married' : 'not-married';
      },
      selection: true,
      sortParam: 'orderBy',
      sorting: true,
      totalCountHeader: 'X-Pagination-Total-Count',
      url: 'http://localhost:3000/',
      width: '100%',
      uniqueId: 'id'
    });

    this.isMarriedItems = this.getIsMarriedItems();
    this.countryItems = this.getCountryItems();
  }

  ngAfterViewInit() {
    this.columnGrid.setData(_.cloneDeep(DEMO_DATA));
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
}
