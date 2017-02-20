import * as _ from 'lodash';

/**
 * Loadable is a class that implements loading properties via constructor.
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
  constructor(private params?: any) {
    this.loadProperties();
  }

  /**
   * Load param values to object properties.
   */
  protected loadProperties() {
    if (!_.isEmpty(this.params)) {
      for (let param in this.params) {
        this[param] = this.params[param];
      }
    }
  }
}
