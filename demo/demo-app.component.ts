import {Component} from 'angular2/core';
import {Grid, GridColumn, GridOptions, GridDataProvider} from '../ng2-grid';
import DEMO_DATA from './demo-data';

@Component({
  selector: 'demo-app',
  template: `
    <h2>Basic Example</h2>
    <ng-grid [options]="basicOptions">Loading...</ng-grid>
    <h2>Column Definition Example</h2>
    <ng-grid [options]="columnOptions">Loading...</ng-grid>
    <h2>Remote Data Example</h2>
    <ng-grid [options]="remoteDataOptions">Loading...</ng-grid>`,
  directives: [Grid]
})
export class DemoAppComponent {
  basicOptions: GridOptions;
  columnOptions: GridOptions;
  remoteDataOptions: GridOptions;

  ngOnInit() {

    this.basicOptions = new GridOptions({
      dataProvider: new GridDataProvider({ data: DEMO_DATA }),
      height: '300px'
    });

    var columnDataProvider: GridDataProvider = new GridDataProvider({ data: DEMO_DATA });
    columnDataProvider.setSort('name', 'asc');
    this.columnOptions = new GridOptions({
      columns: [
        new GridColumn({ heading: "Name", name: "name", width: "150px" }),
        new GridColumn({ heading: "Age", name: "age", width: "50px" }),
        new GridColumn({ heading: "Address", name: "address", width: "200px" }),
        new GridColumn({ heading: "Country", name: "country.name", width: "100px" }),
        new GridColumn({ heading: "Married", name: "isMarried", width: "50px",
          sorting: false, filtering: false }),
      ],
      dataProvider: columnDataProvider,
      defaultPageSize: 50,
      height: '300px'
    });

    this.remoteDataOptions = new GridOptions({
      dataProvider: new GridDataProvider({
        useRemoteData: true,
        url: "http://localhost:8000/demo/demo-data.json"
      }),
      height: '300px'
    });
  }
}
