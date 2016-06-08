import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { GridComponent, GridColumnComponent, GridOptions } from '../index';
import DEMO_DATA from './data';

@Component({
  selector: 'demo',
  moduleId: module.id,
  templateUrl: './demo.component.html',
  providers: [HTTP_PROVIDERS],
  directives: [GridComponent, GridColumnComponent]
})
export class DemoComponent implements OnInit, AfterViewInit {
  basicOptions: GridOptions;
  columnOptions: GridOptions;
  remoteDataOptions: GridOptions;
  fullConfigurationOptions: GridOptions;
  @ViewChild('basicGrid') basicGrid: GridComponent;

  constructor(
    private http: Http,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: DEMO_DATA,
      height: '300px'
    });

    this.columnOptions = new GridOptions({
      data: DEMO_DATA,
      height: '300px',
      selection: true
    });

    this.remoteDataOptions = new GridOptions({
      url: 'http://localhost:3000/',
      additionalRequestParams: {
        'expand': 'company,interests'
      },
      height: '300px',
    });

    this.fullConfigurationOptions = new GridOptions({
      additionalRequestParams: {
        'expand': 'company,interests'
      },
      alternateTemplateColor: '#f9f9f9',
      alternateTemplate: false,
      bodyCssClass: 'body-table',
      data: null,
      defaultPageSize: 5,
      defaultSortColumn: 'name',
      defaultSortType: GridComponent.SORT_DESC,
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
      filtering: true,
      selection: true,
      sortParam: 'orderBy',
      sorting: true,
      totalCountHeader: 'X-Pagination-Total-Count',
      url: 'http://localhost:3000/',
      width: '100%'
    });
  }

  ngAfterViewInit() {
    this.basicGrid.setSort('name');
    this.basicGrid.setPageSize(50);
    this.basicGrid.render();

    this.changeDetectorRef.detectChanges();
  }

  onItemClick(e: MouseEvent, item: any) {
    e.preventDefault();
    console.log(item);
  }

  getIsMarriedItems(): Array<any> {
    return [
      {value: true, text: 'Yes'},
      {value: false, text: 'No'},
    ];
  }
}
