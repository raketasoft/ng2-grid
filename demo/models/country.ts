/**
 * Country model class.
 *
 * Used for transforming row data into specific model via data item callback.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-beta
 */
export class Country {
  public id: number;
  public name: string;

  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;
  }
}
