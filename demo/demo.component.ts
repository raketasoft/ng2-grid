import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Grid, GridOptions } from '../ng2-grid';
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
export class DemoComponent {
  basicOptions: GridOptions;
  columnOptions: GridOptions;
  remoteDataOptions: GridOptions;
  @ViewChild('basicGrid') basicGrid: Grid;

  constructor(private _changeDetectionRef : ChangeDetectorRef) { }

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: DEMO_DATA,
      height: '300px'
    });

    this.columnOptions = new GridOptions({
      data: DEMO_DATA,
      columns: [
        {heading: "Name", name: "name", width: "150px"},
        {heading: "Age", name: "age", width: "50px"},
        {heading: "Address", name: "address", width: "200px"},
        {heading: "Country", name: "country.name", width: "100px"},
        {heading: "Married", name: "isMarried", width: "50px", sorting: false, filtering: false}
      ],
      defaultPageSize: 50,
      defaultSortColumn: 'name',
      defaultSortType: 'desc',
      height: '300px'
    });

    this.remoteDataOptions = new GridOptions({
      url: "http://localhost:3000/",
      additionalRequestParams: {
        'expand': 'company,interests'
      },
      height: '300px',
    });
  }

  ngAfterViewInit() {
    this.basicGrid.sort('name');

    this._changeDetectionRef.detectChanges();
  }
}
