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
              <th *ngFor="let field of options.fields"
                  [style.width]="field.width" [attr.data-id]="field.name"
                  [class.ng-grid-header-sort]="_isOrderedByField(field)"
                  [class.ng-grid-header-sort-asc]="_isOrderedByField(field, 'asc')"
                  [class.ng-grid-header-sort-desc]="_isOrderedByField(field, 'desc')"
                  [class.ng-grid-header-sort-disable]="!_isSortingAllowed(field)"
                  (click)="_sortClick($event)">
                {{field.renderHeading(field)}}
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="ng-grid-body" [style.width]="options.width"
          [class.scroll]="options.height" [style.height]="options.height">
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

  private _orderBy: string;
  private _orderByType: string = Grid.ORDER_TYPE_ASC;

  static ORDER_TYPE_ASC: string = 'asc';
  static ORDER_TYPE_DESC: string = 'desc';

  ngOnInit() {
    if (this.options.fields.length == 0 && this.options.data.length > 0) {
      for (let column in this.options.data[0]) {
        this.options.fields.push(new GridColumn({name: column}));
      }
    }

  }

  sort(fieldName: string) {
    let field: any = _.find(this.options.fields, function (item) {
      return item.name == fieldName;
    });

    if (this._isSortingAllowed(field)) {
      this._orderByType = this._getOrderByType(field.name);
      this._orderBy = field.name;

      this.options.data = _.orderBy(this.options.data, [this._orderBy], [this._orderByType]);
    }
  }

  private _isSortingAllowed(field: GridColumn) {
    return this.options.sorting && field.sorting;
  }

  private _sortClick(event) {
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
}