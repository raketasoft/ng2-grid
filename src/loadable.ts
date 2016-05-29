import * as _ from 'lodash';

/**
 * Loadable is a base class that implements loading properties via constructor.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-alpha
 */
export class Loadable {
  /**
   * Class constructor.
   *
   * @param {any} params Optional, if given params would be assigned as properties
   */
  constructor(private _params?: any) {
    this.loadProperties();
  }

  /**
   * Load param values to object properties.
   */
  protected loadProperties() {
    if (!_.isEmpty(this._params)) {
      for (let param in this._params) {
        this[param] = this._params[param];
      }
    }
  }
}
