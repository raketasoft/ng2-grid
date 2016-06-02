import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Grid, GridOptions } from '../index';
import DEMO_DATA from './data';

@Component({
  selector: 'demo',
  template: `
    <h2>Basic Example</h2>
    <ng-grid #basicGrid [options]="basicOptions"></ng-grid>
    <h2>Column Definition Example</h2>
    <ng-grid #columnGrid [options]="columnOptions"></ng-grid>
    <h2>Remote Data Example</h2>
    <ng-grid #remoteDataGrid [options]="remoteDataOptions"></ng-grid>`,
  directives: [Grid]
})
export class DemoComponent implements OnInit, AfterViewInit {
  basicOptions: GridOptions;
  columnOptions: GridOptions;
  remoteDataOptions: GridOptions;
  @ViewChild('basicGrid') basicGrid: Grid;

  constructor(private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: DEMO_DATA,
      height: '300px'
    });

    this.columnOptions = new GridOptions({
      data: DEMO_DATA,
      columns: [
        {heading: 'Name', name: 'name', width: '150px',
          template: '<a href="">{{name}}</a>'},
        {heading: 'Age', name: 'age', width: '50px'},
        {heading: 'Address', name: 'address', width: '200px'},
        {heading: 'Country', name: 'country.name', width: '100px'},
        {heading: 'Married', name: 'isMarried', width: '50px', sorting: false,
          filtering: false, template: '{{isMarried ? "Yes" : "No"}}'},
        {sorting: false, filtering: false, width: '100px',
          template: '<a href="">Edit</a> | <a href="">Delete</a>'}
      ],
      defaultPageSize: 50,
      defaultSortColumn: 'name',
      defaultSortType: 'desc',
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
  }

  ngAfterViewInit() {
    this.basicGrid.setSort('name');
    this.basicGrid.setPageSize(50);
    this.basicGrid.render();

    this.changeDetectionRef.detectChanges();
  }
}
