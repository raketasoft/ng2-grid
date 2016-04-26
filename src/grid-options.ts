export class GridOptions {
  width: string = '100%';
  height: string;
  sorting: boolean;
  paging: boolean;
  data: Array<any> = [];
  fields: Array<any> = [];

  constructor(options?: any) {
    if (typeof options !== 'undefined') {
      for (let option in options) {
        this[option] = options[option];
      }
    }
  }
}