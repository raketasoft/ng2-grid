import {Component, Input} from 'angular2/core';
import {GridOptions} from './grid-options';

@Component({
  selector: 'ng-grid',
  template: `
    <table class="table" [attr.width]="options.width" [attr.height]="options.height">
      <thead>
        <tr>
          <th *ngFor="#field of options.fields" width="{{field.width}}">{{field.title}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="#row of options.data">
          <td *ngFor="#field of options.fields">{{_renderCell(field, row)}}</td>
        </tr>
      </tbody>
    </table>`
})
export class Grid {
  @Input() options: GridOptions;

  private _renderCell(field: any, row: any):any {
    let value = this._readProperty(row, field['name']);
    
    return value;
  }

  private _readProperty(object: any, property: string):any {
    if (typeof object === 'undefined') {
      return false;
    }

    var _index = property.indexOf('.');

    if(_index > -1) {
      return this._readProperty(
        object[property.substring(0, _index)],
        property.substr(_index + 1)
      );
    }

    return object[property];
  }
}