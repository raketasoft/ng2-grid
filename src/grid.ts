import {Component, Input} from 'angular2/core';
import {GridOptions} from './grid-options';
import * as _ from 'underscore';

@Component({
  selector: 'ng-grid',
  template: `
    <div class="ng-grid">
      <div class="ng-grid-header" [style.width]="options.width" \n\
          [class.scroll]="options.height">
        <table [style.width]="options.width">
          <thead>
            <tr>
              <th *ngFor="#field of options.fields"
                  [style.width]="field.width" [attr.data-id]="field.name"
                  (click)="sort($event)">
                {{_renderHeading(field)}}
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="ng-grid-body" [style.width]="options.width" \n\
          [class.scroll]="options.height" [style.height]="options.height">
        <table class="table" [style.width]="options.width">
          <tbody>
            <tr *ngFor="#row of options.data">
              <td *ngFor="#field of options.fields" [style.width]="field.width">
                {{_renderCell(field, row)}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ng-grid-footer">
      </div>
    </div>`
})
export class Grid {
  @Input() options: GridOptions;

  private _orderBy: string;
  private _orderByType: string = Grid.ORDER_TYPE_ASC;

  static ORDER_TYPE_ASC: string = 'asc';
  static ORDER_TYPE_DESC: string = 'desc';

  ngOnInit() {
    if (this.options.fields.length == 0 && this.options.data.length > 0) {
      this.options.fields = new Array<any>();
      for (let column in this.options.data[0]) {
        this.options.fields.push({name: column});
      }
    }
  }

  sort(event) {
    let element = <HTMLElement>event.target;
    let field = element.getAttribute('data-id');

    this._orderByType = this._getSortOrder(field);
    this._orderBy = field;

    let data = _.chain(this.options.data).sortBy(this._orderBy).value();

    this.options.data = this._orderByType == Grid.ORDER_TYPE_ASC ?
      data : data.reverse();
  }

  private _getSortOrder(field: string): string {
    return field != this._orderBy ? Grid.ORDER_TYPE_ASC :
      (this._orderByType == Grid.ORDER_TYPE_ASC ?
        Grid.ORDER_TYPE_DESC : Grid.ORDER_TYPE_DESC);
  }

  private _renderHeading(field: any): string {
    return field.heading ? field.heading : field.name;
  }

  private _renderCell(field: any, row: any): string {
    let value = this._readProperty(row, field.name);
    
    return value;
  }

  private _readProperty(object: any, property: string): any {
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