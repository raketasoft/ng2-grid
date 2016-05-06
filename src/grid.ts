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
                  (click)="_onHeadingClick($event)">
                {{field.renderHeading(field)}}
              </th>
            </tr>
          </thead>
          <tbody *ngIf="options.filtering">
            <tr>
              <td *ngFor="let field of options.fields">
                <input type="text" *ngIf="field.filtering"
                  [attr.name]="field.name"
                  (keyup.enter)="_onFilterInputEnter($event)"
                  (blur)="_onFilterInputBlur($event)" />
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

  private _filters: Array<string> = [];
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

  setFilter(fieldName: string, keyword: string) {
    if (!_.isEmpty(keyword)) {
      this._filters[fieldName] = keyword;
    } else if (!_.isEmpty(this._filters[fieldName])) {
      delete this._filters[fieldName];
    }
  }

  filter() {
    var self = this;

    this.options.data = _.filter(this.data, function(item) {
      var match: boolean = true;
      for (let filter in self._filters) {
        let value: string = _.get(item, filter).toString();

        match = match &&
          (value.match(new RegExp(self._filters[filter], 'i')) !== null);
      }

      return match;
    });

    this.sort();
  }


  private _onFilterInputBlur(event) {
    let element: HTMLInputElement = <HTMLInputElement>event.target;
    let fieldName: string = element.getAttribute('name');
    let keyword: string = element.value.trim();

    this.setFilter(fieldName, keyword);
  }

  private _onFilterInputEnter(event) {
    this._onFilterInputBlur(event);

    this.filter();
  }

  setSort(sortField: string, sortType?:string) {
    if (!_.isUndefined(sortType)) {
      this._orderByType = sortType;
    }
    this._orderBy = sortField;
  }

  sort() {
    this.options.data = _.orderBy(this.options.data, [this._orderBy],
      [this._orderByType]);
  }

  private _onHeadingClick(event) {
    let element: HTMLElement = <HTMLElement>event.target;
    let fieldName: string = element.getAttribute('data-id');
    let field: GridColumn = _.find(this.options.fields, function(item) {
      return item.name == fieldName;
    });

    if (this._isSortingAllowed(field)) {
      this.setSort(fieldName, this._getOrderByType(fieldName));
      this.sort();
    } else {
      console.log('Sorting by "' + field.name + '" is not allowed.');
    }
  }

  private _isSortingAllowed(field: GridColumn) {
    return this.options.sorting && field.sorting;
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