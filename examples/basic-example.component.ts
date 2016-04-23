import {Component} from 'angular2/core';
import {Grid} from '../ng2-grid';

@Component({
  selector: 'basic-example',
  template: `
<h2>Basic Example</h2>
<ng-grid>Loading...</ng-grid>
`,
  directives: [Grid]
})
export class BasicExampleComponent { }
