import {Component} from 'angular2/core';
import {Grid, GridOptions} from '../ng2-grid';
import DATA from './data';

@Component({
  selector: 'basic-example',
  template: `
<h2>Basic Example</h2>
<ng-grid [options]="gridOptions">Loading...</ng-grid>
`,
  directives: [Grid]
})
export class BasicExampleComponent {
  gridOptions: GridOptions;

  ngOnInit() {
    this.gridOptions = new GridOptions({
      fields: [
        { title: "Name", name: "name", width: 150 },
        { title: "Age", name: "age", width: 50 },
        { title: "Address", name: "address", width: 200 },
        { title: "Country", name: "country.name", width: 100 },
        { title: "Married", name: "isMarried", width: 50 },
      ],
      data: DATA
    });
  }
}
