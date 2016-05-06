import * as _ from 'lodash';

export class GridColumn {
  heading: string;
  name: string;
  filtering: boolean = true;
  sorting: boolean = true;
  width: string;

  constructor(options?: any) {
    if (!_.isUndefined(options)) {
      for (let option in options) {
        this[option] = options[option];
      }
    }
  }

  renderHeading(): string {
    return this.heading ? this.heading : this.name;
  }

  renderCell(data: any): string {
    return _.get(data, this.name).toString();
  }
}