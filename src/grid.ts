import {Component, Input} from 'angular2/core';
import {GridOptions} from './grid-options';

@Component({
  selector: 'ng-grid',
  template: `
    <table class="table" [style.width]="options.width">
      <thead>
        <tr>
          <th *ngFor="#field of options.fields" width="{{field.width}}">
            {{_renderHeading(field)}}
          </th>
        </tr>
      </thead>
      <tbody [style.overflow-x]="options.width ? 'auto' : 'visible'"
        [style.overflow-y]="options.height ? 'auto' : 'visible'"
        [style.width]="options.width" [style.height]="options.height"
        [style.display]="'block'">
        <tr *ngFor="#row of options.data">
          <td *ngFor="#field of options.fields">
            {{_renderCell(field, row)}}
          </td>
        </tr>
      </tbody>
    </table>`
})
export class Grid {
  @Input() options: GridOptions;

  ngOnInit() {
    if (this.options.fields.length == 0 && this.options.data.length > 0) {
      this.options.fields = new Array<any>();
      for (let column in this.options.data[0]) {
        this.options.fields.push({name: column});
      }
      console.log(this.options.fields);
    }
  }

  private _renderHeading(field: any):string {
    return field.heading ? field.heading : field.name;
  }

  private _renderCell(field: any, row: any):string {
    let value = this._readProperty(row, field.name);
    
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