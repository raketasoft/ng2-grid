import {Component} from 'angular2/core';

@Component({
  selector: 'ng-grid',
  template: `
    <table class="table" [attr.width]="width" [attr.height]="height">
      <thead>
        <tr>
          <th *ngFor="#field of fields" width="{{field.width}}">{{field.title}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="#row of data">
          <td *ngFor="#field of fields">{{renderCell(field, row)}}</td>
        </tr>
      </tbody>
    </table>`
})
export class Grid {
  width: string = '100%';
  height: string;
  data: Array<Object> = [];
  fields: Array<Object> = [];
  sorting: boolean;
  paging: boolean;

  constructor() {
  }

  ngOnInit() {
    this.data = [
      {name: 'Otto Clay', age: 61, address: 'Ap #897-1459 Quam Avenue', country: 'China', isMarried: 1}
    ];
    this.fields = [
      { title: "Name", name: "name", width: 150 },
      { title: "Age", name: "age", width: 50 },
      { title: "Address", name: "address", width: 200 },
      { title: "Country", name: "country", width: 100 },
      { title: "Married", name: "isMarried", width: 50  },
    ]
  }

  private renderCell(field: Object, row: Object) {
    let value = row[field['name']];
    return value;
  }
}