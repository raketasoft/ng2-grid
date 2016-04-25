import {Component, Input} from 'angular2/core';

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
  @Input() options: Object;

  width: string = '100%';
  height: string;
  data: Array<Object> = [];
  fields: Array<Object> = [];
  sorting: boolean;
  paging: boolean;

  ngOnInit() {
    this.initOptions();
  }

  /**
   * @returns void
   */
  private initOptions():void {
    for (let option in this.options) {
      this[option] = this.options[option];
    }
  }

  /**
   * @param {Object} field
   * @param {Object} row
   * @returns void
   */
  private renderCell(field: Object, row: Object):void {
    let value = row[field['name']];
    return value;
  }
}