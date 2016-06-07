import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Grid, GridColumn, GridOptions } from '../index';
import DEMO_DATA from './data';

@Component({
  selector: 'demo',
  moduleId: module.id,
  templateUrl: './demo.component.html',
  directives: [Grid, GridColumn]
})
export class DemoComponent implements OnInit, AfterViewInit {
  basicOptions: GridOptions;
  columnOptions: GridOptions;
  remoteDataOptions: GridOptions;
  @ViewChild('basicGrid') basicGrid: Grid;
  @ViewChild('columnGrid') columnGrid: Grid;
  @ViewChild('remoteDataGrid') remoteDataGrid: Grid;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: DEMO_DATA,
      height: '300px'
    });

    this.columnOptions = new GridOptions({
      data: DEMO_DATA,
      headingCssClass: 'heading-table',
      bodyCssClass: 'body-table',
      defaultPageSize: 50,
      defaultSortColumn: 'name',
      defaultSortType: Grid.SORT_DESC,
      height: '300px',
      selection: true
    });

    this.remoteDataOptions = new GridOptions({
      url: 'http://localhost:3000/',
      additionalRequestParams: {
        'expand': 'company,interests'
      },
      alternateTemplate: false,
      height: '300px',
    });
  }

  ngAfterViewInit() {
    this.basicGrid.setSort('name');
    this.basicGrid.setPageSize(50);
    this.basicGrid.render();

    this.changeDetectorRef.detectChanges();
  }

  onNameColumnClick(e: MouseEvent, item: any) {
    e.preventDefault();
    console.log(item);
  }
}
