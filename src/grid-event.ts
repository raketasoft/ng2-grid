import { Loadable } from './loadable';

/**
 * Grid event class.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.15
 */
export class GridEvent extends Loadable {
  static FILTER_CHANGE_EVENT: string = 'filterChange';
  static ITEM_SELECT_EVENT: string = 'itemSelect';
  static PAGE_CHANGE_EVENT: string = 'pageChange';
  static PAGE_SIZE_CHANGE_EVENT: string = 'pageSizeChange';
  static REQUEST_SEND_EVENT: string = 'requestSend';
  static SERVER_ERROR_EVENT: string = 'serverError';
  static SORT_CHANGE_EVENT: string = 'sortChange';
  static UPDATE_EVENT: string = 'update';

  data: any;
  target: any;
  type: string;
}
