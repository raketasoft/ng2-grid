 import * as _ from 'lodash';

/**
 * Object is a base class that implements loading properties via constructor.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class Object {
  /**
   * Class constructor.
   *
   * @param {any} params Optional, if given params would be assigned as properties
   */
  constructor(params?: any) {
    if (!_.isEmpty(params)) {
      for (let param in params) {
        this[param] = params[param];
      }
    }
  }
}