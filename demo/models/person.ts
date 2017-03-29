import { Country } from './country';

/**
 * Person model class.
 *
 * Used for transforming row data into specific model via data item callback.
 *
 * @author Branimir Borisov <branimir@raketasoft.com>
 * @since 1.0.0-beta
 */
export class Person {
  public id: number;
  public name: string;
  public age: number;
  public address: string;
  public country: Country;
  public isMarried: boolean;

  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;
    this.age = params.age;
    this.address = params.address;
    this.country = new Country(params.country);
    this.isMarried = params.isMarried;
  }

  get isRetired(): boolean {
    return this.age > 60;
  }
}
