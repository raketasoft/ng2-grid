import {Component} from 'angular2/core';
import {Grid, GridColumn, GridOptions} from '../ng2-grid';
import DEMO_DATA from './demo-data';

@Component({
  selector: 'demo-app',
  template: `
    <h2>Basic Example</h2>
    <ng-grid [options]="basicOptions">Loading...</ng-grid>
    <h2>Column Definition Example</h2>
    <ng-grid [options]="columnOptions">Loading...</ng-grid>`,
  directives: [Grid]
})
export class DemoAppComponent {
  basicOptions: GridOptions;
  columnOptions: GridOptions;

  ngOnInit() {
    this.basicOptions = new GridOptions({
      data: DEMO_DATA,
      height: '300px',
      searching: false
    });

    this.columnOptions = new GridOptions({
      fields: [
        new GridColumn({ heading: "Name", name: "name", width: "150px" }),
        new GridColumn({ heading: "Age", name: "age", width: "50px" }),
        new GridColumn({ heading: "Address", name: "address", width: "200px" }),
        new GridColumn({ heading: "Country", name: "country.name", width: "100px" }),
        new GridColumn({ heading: "Married", name: "isMarried", width: "50px", sorting: false, searching: false }),
      ],
      data: DEMO_DATA,
      height: '300px'
    });
  }
}
