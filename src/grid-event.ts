import { Loadable } from './loadable';

/**
 * Grid event class.
 *
 * Encapsulates data about event emitted from Grid component.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha.15
 */
export class GridEvent extends Loadable {
  static FILTER_CHANGE_EVENT = 'filterChange';
  static ITEM_SELECT_EVENT = 'itemSelect';
  static PAGE_CHANGE_EVENT = 'pageChange';
  static PAGE_SIZE_CHANGE_EVENT = 'pageSizeChange';
  static REQUEST_SEND_EVENT = 'requestSend';
  static SERVER_ERROR_EVENT = 'serverError';
  static SORT_CHANGE_EVENT = 'sortChange';
  static UPDATE_EVENT = 'update';

  data: any;
  target: any;
  type: string;
}
