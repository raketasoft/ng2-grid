import {Component} from 'angular2/core';
import {Grid, GridOptions} from '../ng2-grid';
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
      height: '300px'
    });

    this.columnOptions = new GridOptions({
      fields: [
        { heading: "Name", name: "name", width: "150px" },
        { heading: "Age", name: "age", width: "50px" },
        { heading: "Address", name: "address", width: "200px" },
        { heading: "Country", name: "country.name", width: "100px" },
        { heading: "Married", name: "isMarried", width: "50px" },
      ],
      data: DEMO_DATA,
      height: '300px'
    });
  }
}
