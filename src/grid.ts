import {Component, Input} from 'angular2/core';
import {GridColumn} from './grid-column';
import {GridOptions} from './grid-options';
import * as _ from 'lodash';

@Component({
  selector: 'ng-grid',
  template: `
    <div class="ng-grid">
      <div class="ng-grid-header" [style.width]="options.width"
          [class.scroll]="options.height">
        <table [style.width]="options.width">
          <thead>
            <tr>
              <th *ngFor="let field of options.fields" class="ng-grid-heading"
                  [style.width]="field.width" [attr.data-id]="field.name"
                  [class.sort]="_isOrderedByField(field)"
                  [class.sort-asc]="_isOrderedByField(field, 'asc')"
                  [class.sort-desc]="_isOrderedByField(field, 'desc')"
                  [class.sort-disable]="!_isSortingAllowed(field)"
                  (click)="_headingOnClick($event)">
                {{field.renderHeading(field)}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td *ngFor="let field of options.fields">
                <input type="text" [attr.name]="field.name" (keyup.enter)="_searchInputOnEnter($event)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ng-grid-body" [style.width]="options.width"
          [class.scroll]="options.height" [style.max-height]="options.height">
        <table class="table" [style.width]="options.width">
          <tbody>
            <tr *ngFor="let row of options.data">
              <td *ngFor="let field of options.fields" [style.width]="field.width">
                {{field.renderCell(row)}}
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

  data: Array<any> = [];

  private _orderBy: string;
  private _orderByType: string = Grid.ORDER_TYPE_ASC;

  static ORDER_TYPE_ASC: string = 'asc';
  static ORDER_TYPE_DESC: string = 'desc';

  ngOnInit() {
    if (this.options.fields.length == 0 && this.options.data.length > 0) {
      let row: any = this.options.data[0];
      for (let key in row) {
        this.options.fields.push(new GridColumn({
          name: this._getColumnName(key, row)
        }));
      }
    }
    this.data = this.options.data;
  }

  private _searchInputOnEnter(event) {
    let element: HTMLInputElement = <HTMLInputElement>event.target;
    let fieldName: string = element.getAttribute('name');
    let keyword: string = element.value;

    this.search(fieldName, keyword);
  }

  search(fieldName: string, keyword: string) {
    this.options.data = _.filter(this.data, function(item) {
      let value: string = _.get(item, fieldName).toString();

      return value.match(new RegExp(keyword, 'i'));
    });
  }

  sort(fieldName: string) {
    let field: GridColumn = _.find(this.options.fields, function(item) {
      return item.name == fieldName;
    });

    if (this._isSortingAllowed(field)) {
      this._orderByType = this._getOrderByType(field.name);
      this._orderBy = field.name;

      this.options.data = _.orderBy(this.data, [this._orderBy], [this._orderByType]);
    }
  }

  private _isSortingAllowed(field: GridColumn) {
    return this.options.sorting && field.sorting;
  }

  private _headingOnClick(event) {
    let element: HTMLElement = <HTMLElement>event.target;
    let fieldName: string = element.getAttribute('data-id');

    this.sort(fieldName);
  }

  private _isOrderedByField(field: GridColumn, orderByType?: string): boolean {
    let isOrderedByField = field.name == this._orderBy;
    if (_.isUndefined(orderByType)) {
      return isOrderedByField;
    }

    return isOrderedByField && this._orderByType == orderByType;
  }

  private _getOrderByType(fieldName: string): string {
    return fieldName != this._orderBy ? this._orderByType :
      (this._orderByType == Grid.ORDER_TYPE_ASC ?
        Grid.ORDER_TYPE_DESC : Grid.ORDER_TYPE_ASC);
  }

  private _getColumnName(key: string, row: any): string {
    if (_.isObject(row[key])) {
      return key.concat('.', this._getNestedKey(row[key]))
    }

    return key;
  }

  private _getNestedKey(object: any): string {
    let firstKey: string = _.keys(object)[0];
    let firstKeyValue: any = object[firstKey];

    if (_.isObject(firstKeyValue)) {
      firstKey.concat('.', this._getNestedKey(firstKeyValue));
    }

    return firstKey;
  }

}